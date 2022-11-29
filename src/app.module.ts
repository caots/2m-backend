import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import ormconfig from './config/ormconfig';
import { AuthModule } from './modules/auth/auth.module';
import { CouponsModule } from './modules/coupons/coupons.module';
import { OrdersModule } from './modules/orders/orders.module';
import { ProductController } from './modules/product/product.controller';
import { ProductModule } from './modules/product/product.module';
import { UserModule } from './modules/user/user.module';
import { VehicleModule } from './modules/vehicle/vehicle.module';
import { MailModule } from './modules/mail/mail.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        TypeOrmModule.forRoot(ormconfig),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads'
        }),
        UserModule,
        AuthModule,
        ProductModule,
        VehicleModule,
        MailModule,
        OrdersModule,
        CouponsModule,
        VehicleModule
    ],
    controllers: [ProductController],
})
export class AppModule {}
