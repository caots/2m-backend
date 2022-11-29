import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entity/product.entity';
import { ProductItemsEntity } from './entity/productItem.entity';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductEntity, ProductItemsEntity]),
        MulterModule.register({
            dest: './uploads',
        }),
    ],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService]
})
export class ProductModule { }
