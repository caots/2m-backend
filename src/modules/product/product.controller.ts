import { Body, Controller, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/commons/auth/roles.decorator';
import { RolesGuard } from 'src/commons/auth/roles.guard';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptor';
import { JwtAuthGuard } from '../../commons/auth/jwt.strategy';
import { GetProductDto } from './dto/getProduct.dto';
import { CreateProductDto, UpdateProductDto } from './dto/updateProduct.dto';
import { ProductService } from './product.service';
import LocalFilesInterceptor from 'src/commons/interceptors/localFiles.interceptor';
import { UserRole } from 'src/commons/constants/config';

@ApiTags('Product')
@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    // get list product
    @Get()
    @UseInterceptors(TransformInterceptor)
    async getListProduct(@Request() req: GetProductDto) {
        return this.productService.getListProduct();
    }

    // get product by id
    @Get('/:productId')
    @UseInterceptors(TransformInterceptor)
    async getProductById(@Request() req, @Param('productId') productId: number) {
        return this.productService.getProductById(productId);
    }


    // create product
    @Post('/')
    @UseInterceptors(LocalFilesInterceptor({
        fieldName: 'file',
        path: 'image_products'
    }))
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(TransformInterceptor)
    async createProductById(@Request() req, @UploadedFile() file: Express.Multer.File, @Body() body: CreateProductDto) {
        return this.productService.createProduct(body, file);
    }

    // update product
    @Put('/:productId')
    @UseInterceptors(LocalFilesInterceptor({
        fieldName: 'file',
        path: 'image_products'
    }))
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @UseInterceptors(TransformInterceptor)
    async updateProductById(@Request() req, @Param('productId') productId: number, @UploadedFile() file: Express.Multer.File, @Body() body: UpdateProductDto) {
        return this.productService.updateProductById(productId, body, file);
    }
}
