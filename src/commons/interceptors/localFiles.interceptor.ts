import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname } from 'path';
import fs from 'fs';
import { FolderPath } from '../constants/config';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  path?: string;
}

function LocalFilesInterceptor(options: LocalFilesInterceptorOptions): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;
    constructor(configService: ConfigService) {
      const filesDestination = "./uploads/";
      const destination = `${filesDestination}${options.path}`

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename: (req, file, callback) => {
            callback(null, `${Date.now()}-${file.originalname.replace(/\s/g, '_')}`);
          }
        }),
        fileFilter: (req, file, cb) => {
          file.filename = Date.now() + '-' + file.originalname.replace(/\s/g, '_');
          cb(null, true);
        },
      }
      this.fileInterceptor = new (FileInterceptor(options.fieldName, { ...multerOptions }));
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }
  return mixin(Interceptor);
}

export default LocalFilesInterceptor;