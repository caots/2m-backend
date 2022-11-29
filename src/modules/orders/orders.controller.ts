import { Controller, Post, UseGuards, Request, Body, UseInterceptors, Get, Query } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/commons/auth/jwt.strategy';
import { Roles } from 'src/commons/auth/roles.decorator';
import { RolesGuard } from 'src/commons/auth/roles.guard';
import { PAGE_SIZE, UserRole } from 'src/commons/constants/config';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptor';
import { PayOrdersDto } from './dto/payOrder.dto';
import { ShippingDto } from './dto/shipping.dto';
import { OrdersService } from './orders.service';

@ApiTags('Orders')
@Controller('order')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    // @Post('/getTax')
    // @UseInterceptors(TransformInterceptor)
    // async getTax(@Body() body: ShippingDto, @Request() req) {
    //     const userId = req.user.userId;
    //     return this.ordersService.getTaxes(body, userId);
    // }

    @Post('/payment')
    @Roles(UserRole.USER)
    @UseInterceptors(TransformInterceptor)
    async payOrders(@Body() body: PayOrdersDto, @Request() req) {
        const userId = req.user.userId;
        return this.ordersService.payOrders(userId, body);
    }

    @Get('/get-by-user')
    @Roles(UserRole.USER)
    @UseInterceptors(TransformInterceptor)
    async getOrdersByUser(
        @Query('page') page: number = 1, 
        @Query('size') pageSize: number = PAGE_SIZE.COMMON, 
        @Request() req
    ) {
        const userId = req.user.userId;
        return this.ordersService.getOrdersByUser(userId, page, pageSize);
    }
}
