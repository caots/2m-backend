import { HttpException } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import * as fs from "fs";
import * as moment from "moment";
import * as path from "path";
import * as sharp from "sharp";
import { ENV_VALUE, FolderPath, UPLOAD_TYPE } from '../constants/config';
import { logger } from '../middleware';

export const resizeUploadImageProduct = async (file: any, uploadType: number) => {
  try {
    const pathFile = `${FolderPath.uploadProductPath}`;
    let nameOfFile = file.filename;
    let resizeWith, resizeHeight;
    switch (uploadType) {
      case UPLOAD_TYPE.ProductImage:
        nameOfFile = `${FolderPath.product}-${nameOfFile}`;
        resizeWith = 800;
        resizeHeight = 800;
        break;
      default:
        break;
    }

    const ext = path.extname(file.originalname);
    let pathFileOutPut = `${pathFile}/${nameOfFile}`;

    const imageFile = [".png", ".jpeg", ".jpg", ".tiff"];
    if (imageFile.includes(ext)) {
      const result = await sharp(file.path).resize(resizeWith, resizeHeight).jpeg({ mozjpeg: true }).toFile(pathFileOutPut);
      pathFileOutPut = pathFileOutPut.substring(2);
    } else {
      pathFileOutPut = file.path;
    }
    //const url = await uploadToS3(pathFileOutPut, nameOfFile, file.mimetype);
    //if (!url) { return null; }
    const filePath = file.path;
    //const filePathOutPut = pathFileOutPut;
    fs.unlinkSync(filePath);
    // if (filePathOutPut != filePath) {
    //   fs.unlinkSync(filePathOutPut);
    // };
    return pathFileOutPut;
  } catch (err) {
    logger.error(JSON.stringify(err));
    throw new HttpException(err.message, err.status);
    return null;
  }
}

export const uploadToS3 = async (pathFileOutPut: string, nameOfFile: string, mimetype: string) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: ENV_VALUE.S3_ID,
      secretAccessKey: ENV_VALUE.S3_SECRET
    });
    console.log(`Before upload s3.`);
    console.log(moment().utc().format("YYYY-MM-DD HH:mm:ss"));
    const fileContent = fs.readFileSync(pathFileOutPut);
    const params = {
      Bucket: ENV_VALUE.S3_BUCKET_NAME,
      Key: "uploads/" + nameOfFile, // File name you want to save as in S3
      Body: fileContent,
      ContentType: mimetype
    };
    const dataUpload = await s3.upload(params).promise();
    // Uploading files to the bucket
    if (!dataUpload) {
      return null;
    }
    console.log(`File uploaded successfully.`);
    console.log(moment().utc().format("YYYY-MM-DD HH:mm:ss"));
    console.log(dataUpload);

    return dataUpload.Location;
  } catch (err) {
    logger.error(JSON.stringify(err));
    throw new HttpException(err.message, err.status);
  };


}