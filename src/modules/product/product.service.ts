import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UPLOAD_TYPE } from 'src/commons/constants/config';
import { MESSAGES_PRODUCT_ERROR } from 'src/commons/constants/message.constants';
import { resizeUploadImageProduct } from 'src/commons/services/image.service';
import { Connection, Repository } from 'typeorm';
import { CreateProductDto, ProductItemDto, UpdateProductDto } from './dto/updateProduct.dto';
import { ICreateProduct, ProductEntity } from './entity/product.entity';
import { ICreateProductItem, ProductItemsEntity } from './entity/productItem.entity';

var fs = require('fs');

@Injectable()
export class ProductService {
    constructor(
        @InjectRepository(ProductEntity)
        private productRepository: Repository<ProductEntity>,
        @InjectRepository(ProductItemsEntity)
        private productItemsSessionRepository: Repository<ProductItemsEntity>,
        private connection: Connection,
    ) { }

    async findProductById(id: number): Promise<ProductEntity> {
        try {
            const selectProduct: ProductEntity = await this.productRepository.findOne({ id });
            return selectProduct;

        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async getListProduct(): Promise<ProductEntity[]> {
        try {
            let products = await this.productRepository
                .createQueryBuilder()
                .getMany();
            if (products && products.length > 0) {
                products = await Promise.all(
                    products.map(async (product: ProductEntity) => {
                        const productItems = await this.productItemsSessionRepository
                            .createQueryBuilder()
                            .where("product_id = :productId")
                            .setParameters({ productId: product.id })
                            .getMany();
                        if (productItems && productItems.length > 0) product['items'] = productItems;
                        return product;
                    })
                )
            }
            return products;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async getProductById(productId: number): Promise<ProductEntity> {
        try {
            let product = await this.productRepository.findOne({ id: productId });
            if (product) {
                const productItems = await this.productItemsSessionRepository
                    .createQueryBuilder()
                    .where("product_id = :productId")
                    .setParameters({ productId: product.id })
                    .getMany();
                if (productItems && productItems.length > 0) product['items'] = productItems;
            }
            return product;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async createProduct(body: CreateProductDto, file: Express.Multer.File): Promise<Object> {
        try {
            const productImage = file ? await resizeUploadImageProduct(file, UPLOAD_TYPE.ProductImage) : null;
            const product: ICreateProduct = {
                name: body?.name,
                price: body.price,
                description: body?.description,
                make: body.make,
                model: body.model,
                product_image: productImage,
                size: body.size,
                year: body.year
            }
            const createProduct = await this.productRepository.save(product);
            if (!createProduct) throw new BadRequestException(MESSAGES_PRODUCT_ERROR.PRODUCT_CREATE_ERROR);
            if(!body.productItems || body.productItems.length <= 0) return { success: true };
            // save product items
            await Promise.all(
                body.productItems.map(async (productItem: ProductItemDto) => {
                    const newProductItem: ICreateProductItem = {
                        name: productItem.name,
                        price: productItem.price,
                        product_id: createProduct.id
                    }
                    const orderItemSaved = await this.productItemsSessionRepository.save({ ...newProductItem });
                    if (!orderItemSaved) throw new BadRequestException(MESSAGES_PRODUCT_ERROR.PRODUCT_ITEM_CREATE_ERROR);
                    return orderItemSaved;
                })
            )
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async updateProductById(productId: number, body: UpdateProductDto, file: Express.Multer.File): Promise<Object> {
        try {
            let product = await this.productRepository.findOne({ id: productId });
            if (!product) throw new NotFoundException(MESSAGES_PRODUCT_ERROR.PRODUCT_NOT_FOUND);
            product.name = body.name;
            product.price = body.price;
            product.product_image = file ? await resizeUploadImageProduct(file, UPLOAD_TYPE.ProductImage) : null;
            const updateProduct = await this.productRepository.update(productId, product);
            if (!updateProduct) throw new BadRequestException(MESSAGES_PRODUCT_ERROR.PRODUCT_UPDATE_ERROR);
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }
}


