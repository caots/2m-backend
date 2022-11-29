import { BadRequestException, forwardRef, HttpException, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { INTENT_PAYMENT_STRIPE_STATUS, PAGE_SIZE, STATUS_COMMON, STATUS_PAYMENT } from 'src/commons/constants/config';
import { MESSAGES_ERROR, PAYMENT_COUPON_MESSAGE, PAYMENT_MESSAGE } from 'src/commons/constants/message.constants';
import { logger } from 'src/commons/middleware';
import { FormatCardNumber, MathRoundService } from 'src/commons/services/payment.service';
import { getRandomHex } from 'src/commons/services/product.service';
import StripeService from 'src/commons/services/stripe.service';
import { Repository } from 'typeorm';
import { CouponEntity } from '../coupons/entity/coupon.entity';
import { ProductEntity } from '../product/entity/product.entity';
import { ProductService } from '../product/product.service';
import { UserEntity } from '../user/entity/user.entity';
import { UserService } from '../user/user.service';
import { CreateUserDto } from './dto/createCustomer.dto';
import { OptionProductCardDto, PayOrdersDto, ProductItemCardDto } from './dto/payOrder.dto';
import { ShippingDto } from './dto/shipping.dto';
import { IntentPaymentEntity } from './entity/intentPayment.interface';
import { ICreateOrderItem, OrderItemsEntity } from './entity/orderItems.entity';
import { ICreateOrder, OrdersEntity } from './entity/orders.entity';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(OrderItemsEntity)
    private orderItemsRepository: Repository<OrderItemsEntity>,

    @InjectRepository(OrdersEntity)
    private ordersRepository: Repository<OrdersEntity>,

    @Inject(forwardRef(() => UserService))
    private userService: UserService,
    private productService: ProductService,
    private stripeService: StripeService
  ) { }

  async payOrders(userId: number, data: PayOrdersDto): Promise<Object> {
    try {
      // process code payment
      // calculator total amount
      logger.info('start payment');
      const totalAmount = await this.calculatorTotalAmount(data);
      // get user in DB is customer in stripe
      const currentUser = await this.userService.findUserById(userId);
      if (!currentUser) throw new BadRequestException(MESSAGES_ERROR.USER_NOT_FOUND);
      if (!currentUser.customer_ssl) {
        const userStripe = {
          name: currentUser.full_name,
          email: currentUser.email
        } as CreateUserDto;
        logger.info('create customer stripe');
        const customerStripe = await this.createCustomerStripe(userStripe);
        logger.info(JSON.stringify(customerStripe));
        const updateUser = await this.userService.updateUserSslStripeById(currentUser.id, customerStripe.id);
        if (!updateUser) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
      }
      // start payment
      let intentResponse: IntentPaymentEntity;
      if (data.payment_method_id) {
        logger.info('create intent');
        intentResponse = await this.stripeService.paymentIntentCreate(totalAmount, data.payment_method_id);
        logger.info(JSON.stringify(intentResponse));
      } else if (data.payment_intent_id) {
        logger.info('confirm 3DS');
        intentResponse = await this.stripeService.confirm3DSCard(data.payment_intent_id);
        logger.info(JSON.stringify(intentResponse));
      }
      return this.generateResponsePayment(intentResponse, data.cardToken, currentUser, data, totalAmount)
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async calculatorTotalAmount(dataOrders: PayOrdersDto): Promise<number> {
    try {
      if (!dataOrders.products || dataOrders.products.length <= 0) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
      let totalAmount = 0;
      await Promise.all(
        dataOrders.products.map(async (productItem: ProductItemCardDto) => {
          const product = await this.productService.findProductById(productItem.id);
          totalAmount += MathRoundService(productItem.quantity * product.price);
          if (productItem.options) {
            const options: OptionProductCardDto[] = JSON.parse(productItem.options);
            options.forEach(option => {
              totalAmount += option.price;
            })
          }
        })
      )
      return totalAmount * 100;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async getTaxes(shippingData: ShippingDto, userId: number): Promise<Object> {
    try {
      const currentUser = await this.userService.findUserById(userId);
      if (!currentUser) throw new BadRequestException(MESSAGES_ERROR.USER_NOT_FOUND);
      return;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async generateResponsePayment(intent: IntentPaymentEntity, cardToken: string, currentUser: UserEntity, dataOrders: PayOrdersDto, totalAmount: number): Promise<Object> {
    try {
      if (
        intent.status === INTENT_PAYMENT_STRIPE_STATUS.requires_action &&
        intent.next_action.type === 'use_stripe_sdk'
      ) {
        // Tell the client to handle the action
        return {
          card3DS: {
            requires_action: true,
            payment_intent_client_secret: intent.client_secret
          }
        };
      } else if (intent.status === INTENT_PAYMENT_STRIPE_STATUS.succeeded) {
        if (cardToken) {
          logger.info('Create source');
          const cardResponse = await this.stripeService.createSource(currentUser?.customer_ssl, cardToken);
          logger.info(JSON.stringify(cardResponse));
          if (!cardResponse) throw new BadRequestException(PAYMENT_COUPON_MESSAGE.PaymentFail);
          //payment success
          // save order
          const newOrder = await this.saveOrdersSuccess(dataOrders, totalAmount, currentUser.id)
          // save order items
          const newOrderItems = await this.saveOrderItemSuccess(dataOrders, newOrder);
          newOrder['orderItems'] = newOrderItems;
          return newOrder;
        }
        return { success: false };
      } else {
        logger.info('Payment Fail');
        logger.info(JSON.stringify(intent));
        throw new BadRequestException(`${intent.status}-${PAYMENT_COUPON_MESSAGE.InvalidPaymentStatus}`);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async createCustomerStripe(userData: CreateUserDto) {
    try {
      const stripeCustomer = await this.stripeService.createCustomer(userData.name, userData.email);
      return stripeCustomer;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async saveOrdersSuccess(dataOrders: PayOrdersDto, totalAmount: number, userId: number): Promise<OrdersEntity> {
    try {
      // create order
      const newOrderData: ICreateOrder = {
        total_price: totalAmount,
        ssl_card_type: dataOrders.card_type,
        ssl_cvc: dataOrders.cvc,
        ssl_exp_date: dataOrders.exp_date,
        ssl_card_number: FormatCardNumber(dataOrders.card_number),
        ssl_card_name: dataOrders.card_name,
        address: dataOrders.shipping_address,
        city_name: dataOrders.shipping_city,
        state_name: dataOrders.shipping_state,
        postcode: dataOrders.shipping_postcode,
        country: dataOrders.shipping_country,
        status: STATUS_PAYMENT.COMPLETED,
        user_id: userId
      }
      const results = await this.ordersRepository.save({ ...newOrderData });
      if (!results) throw new BadRequestException(PAYMENT_MESSAGE.SaveOrderError);
      return results;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async saveOrderItemSuccess(dataOrders: PayOrdersDto, newOrder: OrdersEntity) {
    try {
      const orderItems = await Promise.all(
        dataOrders.products.map(async (productItem: ProductItemCardDto) => {
          const product = await this.productService.findProductById(productItem.id);
          const licenseKey = getRandomHex(newOrder.id + "", 14);
          const newOrderItemData: ICreateOrderItem = {
            price: product.price,
            quantity: productItem.quantity,
            license_status: STATUS_COMMON.ACTIVE,
            order_id: newOrder.id,
            product_id: productItem.id,
            license_key: licenseKey, // generate license_key
            options: productItem.options,
          }
          const orderItemSaved = await this.orderItemsRepository.save({ ...newOrderItemData });
          if (!orderItemSaved) throw new BadRequestException(PAYMENT_MESSAGE.SaveOrderItemError);
          return orderItemSaved;
        })
      )
      return orderItems;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async getOrdersByUser(userId: number, page: number = 1, pageSize: number = PAGE_SIZE.COMMON): Promise<Object> {
    try {
      const skip = (page - 1) * pageSize;
      let [result, total] = await this.ordersRepository.findAndCount(
        {
          where: { user_id: userId },
          order: { created_at: "DESC" },
          take: pageSize,
          skip: skip
        }
      );
      if (result.length > 0) {
        result = await Promise.all(
          result.map(async (order: OrdersEntity) => {
            const orderItems = await this.orderItemsRepository.createQueryBuilder()
              .where('order_id = :orderId')
              .setParameters({ orderId: order.id })
              .getMany();
            if (orderItems && orderItems.length > 0) order["items"] = orderItems;
            return order
          })
        )
      }
      return {
        data: result,
        count: total
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

}
