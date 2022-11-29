import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import moment from 'moment';
import { COUPON_TYPE, STATUS_COMMON } from 'src/commons/constants/config';
import { MESSAGES_ERROR, PAYMENT_COUPON_MESSAGE } from 'src/commons/constants/message.constants';
import { Repository } from 'typeorm';
import { CouponEntity } from './entity/coupon.entity';

@Injectable()
export class CouponsService {

  constructor(
    @InjectRepository(CouponEntity)
    private couponRepository: Repository<CouponEntity>,
  ) { }

  async checkCoupon(couponCode: string): Promise<CouponEntity> {
    try {
      const findCoupon: CouponEntity = await this.findCouponByCode(couponCode);
      if (findCoupon.status != STATUS_COMMON.ACTIVE) {
        throw new BadRequestException(PAYMENT_COUPON_MESSAGE.Invalid);
      }
      if(findCoupon.discount_type == COUPON_TYPE.EXPIRED_DATE){
        const currentDate  = moment().utc().format("YYYY-MM-DD HH:mm:ss");
        if(!moment(currentDate).isBetween(findCoupon.expired_from, findCoupon.expired_to)) throw new BadRequestException(PAYMENT_COUPON_MESSAGE.Invalid);
      }else{
        if(findCoupon.is_nbr_user_limit <= findCoupon.nbr_used) throw new BadRequestException(PAYMENT_COUPON_MESSAGE.Invalid);
      }
      return findCoupon;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findCouponByCode(code: string): Promise<CouponEntity> {
    try {
      const findCoupon: CouponEntity = await this.couponRepository.findOne({ code });
      if (!findCoupon) {
        throw new BadRequestException(PAYMENT_COUPON_MESSAGE.notFound)
      }
      return findCoupon;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }


}
