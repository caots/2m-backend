import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import StripeService from 'src/commons/services/stripe.service';
import { CouponEntity } from '../coupons/entity/coupon.entity';
import { ProductEntity } from '../product/entity/product.entity';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { OrderItemsEntity } from './entity/orderItems.entity';
import { OrdersEntity } from './entity/orders.entity';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrdersEntity, OrderItemsEntity]),
    forwardRef(() => UserModule),
    ProductModule
  ],
  controllers: [OrdersController],
  providers: [OrdersService, StripeService],
  exports: [OrdersService]

})
export class OrdersModule { }
