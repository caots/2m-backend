import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ENV_VALUE } from './commons/constants/config';
var express = require("express")

async function bootstrap () {
    const app = await NestFactory.create(AppModule);
    app.use('/images',express.static('uploads'));
    app.setGlobalPrefix('api');
    const options = new DocumentBuilder()
        .setTitle('M2 API')
        .setDescription('API description')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('api', app, document);
    app.use(morgan('tiny'));
    app.enableCors()
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    await app.listen(ENV_VALUE.APP_PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
