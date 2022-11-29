import { Controller, Post, UseGuards, Request, Body, UseInterceptors} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/commons/auth/jwt.strategy';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptor';
import { CouponsService } from './coupons.service';
import { CheckCouponCodeDto } from './dto/checkCoupon.dto';

@ApiTags('Coupons')
@Controller('coupon')
@ApiBearerAuth()
export class CouponsController {
    constructor (private readonly couponsService: CouponsService){}


    // @Post('/check-coupon')
    // @UseInterceptors(TransformInterceptor)
    // async createUser(@Body() req: CheckCouponCodeDto) {
    //     return this.couponsService.checkCoupon(req.coupon_code);
    // }
   
}
