import { BadRequestException, HttpException, HttpService, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ENV_VALUE, FIRMWARE_LIST, FolderPath, LICENSE_STATUS, READ_FILE_BIN } from "src/commons/constants/config";
import { MESSAGES_ERROR, MESSAGES_PRODUCT_ERROR, MESSAGES_VEHICLE_ERROR } from "src/commons/constants/message.constants";
import { logger } from "src/commons/middleware";
import { convertToArrayHex, getRandomHex, hex2a } from "src/commons/services/product.service";
import { Repository } from "typeorm";
import { CreateVehicleDto } from "./dto/createVehicle.dto";
import { FlashSuccessDto, TuneVehicleDto, UnStockVehicleDto } from "./dto/tuneVehicle.dto";
import { VehicleEntity } from "./entity/vehicle.entity";

var fs = require('fs');
@Injectable()
export class VehicleService {
  constructor(
    @InjectRepository(VehicleEntity)
    private vehicleRepository: Repository<VehicleEntity>,
    private readonly httpService: HttpService,
  ) { }

  async getListVehicle(userId: number): Promise<VehicleEntity[]> {
    try {
      let vehicles = await this.vehicleRepository
        .createQueryBuilder()
        .where("user_id = :userId")
        .setParameters({ userId: userId })
        .getMany();
      return vehicles;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findVehicleById(id: number): Promise<VehicleEntity> {
    try {
      const selectedVehicle: VehicleEntity = await this.vehicleRepository.findOne({ id });
      return selectedVehicle;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findVehicleByVIN(vinNumber: string): Promise<VehicleEntity> {
    try {
      const selectedVehicle: VehicleEntity = await this.vehicleRepository.findOne({ vin_number: vinNumber });
      return selectedVehicle;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findVehicleByLicenseActive(license: string): Promise<VehicleEntity> {
    try {
      const selectedVehicle: VehicleEntity = await this.vehicleRepository.findOne({
        license_key: license,
        license_status: LICENSE_STATUS.ASSIGNED
      });
      return selectedVehicle;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async saveLogsVehicleDev(file: Express.Multer.File): Promise<Object> {
    try {
      if (!file) throw new BadRequestException(MESSAGES_ERROR.COMMON_ERROR);
      return file.path;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }


  async createNewVehicle(userId: number, body: CreateVehicleDto): Promise<VehicleEntity> {
    try {
      const vehicleExist = await this.findVehicleByVIN(body.vin_number);
      if (vehicleExist) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_EXIST);
      const newVehicle = {
        user_id: userId,
        vin_number: body.vin_number,
        model: body.model,
        firmware: body.firmware,
        hardware: body.hardware,
        engine_code: body.engine_code,
        make_car: body.make_car,
      }
      const result = await this.vehicleRepository.save(newVehicle);
      return result;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async tuneVehicle(userId: number, body: TuneVehicleDto): Promise<Object> {
    try {
      // check license key in order items
      // check license assign??
      const activeLicense = await this.findVehicleByLicenseActive(body.license_key);
      if (activeLicense) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_LICENSE_ASSIGNED);
      // flashing process
      const downloadFile = await this.flashingVehicle(userId, body.first_ids, body.license_key);
      return downloadFile;
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async flashCompletedVehicle(body: FlashSuccessDto): Promise<Object> {
    try {
      // check license key in order items
      // check license assign??
      const activeLicense = await this.findVehicleByLicenseActive(body.license_key);
      if (activeLicense) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_LICENSE_ASSIGNED);
      const vehicleExist = await this.findVehicleById(body.vehicle_id);
      if (!vehicleExist) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_NOT_FOUND);
      // update 
      vehicleExist.license_key = body.license_key;
      vehicleExist.license_status = LICENSE_STATUS.ASSIGNED;
      const updateVehicle = await this.vehicleRepository.update(body.vehicle_id, vehicleExist);
      if (!updateVehicle) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_UPDATE_ERROR);
      return { success: true };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async unStockVehicle(body: UnStockVehicleDto): Promise<Object> {
    try {
      const vehicleExist = await this.findVehicleById(body.vehicle_id);
      if (!vehicleExist) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_NOT_FOUND);
      // check license assign??
      if (!vehicleExist.license_key || (vehicleExist.license_key && vehicleExist.license_status == LICENSE_STATUS.UNASSIGNED)) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_LICENSE_UNASSIGNED);
      // update 
      vehicleExist.license_key = null;
      vehicleExist.license_status = LICENSE_STATUS.UNASSIGNED;
      const updateVehicle = await this.vehicleRepository.update(body.vehicle_id, vehicleExist);
      if (!updateVehicle) throw new BadRequestException(MESSAGES_VEHICLE_ERROR.VEHICLE_UPDATE_ERROR);
      return { success: true };
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async getModelVehicle(vinNumber: string): Promise<Object> {
    try {
      const API_KEY = ENV_VALUE.API_KEY_MODEL_CAR;
      const data: any = await this.httpService.get(`https://auto.dev/api/vin/${vinNumber}?apikey=${API_KEY}`).toPromise();
      let model = '';
      let makeCar = '';
      if (data?.data?.model || data?.data?.make) {
        model = data?.data?.model?.name;
        makeCar = data?.data?.make?.name;
        return {
          model: model,
          make_car: makeCar
        };
      }
      //Try to other api
      const dataRetry: any = await this.httpService.get(`https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vinNumber}?format=json`).toPromise();
      if (dataRetry?.data?.Results[0]?.Model || dataRetry?.data?.Results[0]?.Make) {
        model = dataRetry?.data?.Results[0].Model;
        makeCar = dataRetry?.data?.Results[0].Make;
        return {
          model: model,
          make_car: makeCar
        };
      }
      throw new BadRequestException(MESSAGES_VEHICLE_ERROR.GET_MODEL_INFO_ERROR);
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async flashingVehicle(userId: number, firstIds: string[], licenseKey: string) {
    try {
        // const licenseKey = getRandomHex(userId + "", 14);
        // process bytes
        if (firstIds.length <= 0) throw new BadRequestException(MESSAGES_PRODUCT_ERROR.BYTES_NOT_DATA);
        const binaryFirmware = hex2a(firstIds.join(''));
        if(!binaryFirmware) throw new BadRequestException(MESSAGES_PRODUCT_ERROR.FIRSTID_NOT_DATA);
        console.log('binaryFirmware: ', binaryFirmware)
        logger.info('binaryFirmware');
        logger.info(JSON.stringify(binaryFirmware));
        const findFirmware = FIRMWARE_LIST.find(firmware => firmware.ASCIIFirmware == binaryFirmware);
        if(!findFirmware) throw new BadRequestException(MESSAGES_PRODUCT_ERROR.NOT_FOUND_LICENSE_LOCATION);
        const licenseAddress = findFirmware.Location;
        logger.info('licenseAddress');
        logger.info(JSON.stringify(licenseAddress));
        const licenseAddressInArraysBin = parseInt(licenseAddress, 16);

        // read file bin and convert to array buffer
        const readFileName = READ_FILE_BIN.find(data => data.type == binaryFirmware);
        if(!readFileName) throw new BadRequestException(MESSAGES_PRODUCT_ERROR.NOT_FOUND_FILE_TO_UPDATE);
        const binary = await fs.readFileSync(`${FolderPath.uploadBinsPath}/${readFileName.file}`);
        if (!binary) throw new HttpException(MESSAGES_ERROR.COMMON_ERROR, HttpStatus.BAD_REQUEST);
        let binaryConvert = convertToArrayHex(binary);
        if (!binaryConvert || binaryConvert.length <= 0) throw new HttpException(MESSAGES_ERROR.COMMON_ERROR, HttpStatus.BAD_REQUEST);
        // replace new hex 16 bytes to file
        const licenseKeys = licenseKey.split('');
        const value16BytesHexArrs = [];
        licenseKeys.forEach((value, index) => {
            if (index % 2 == 0) value16BytesHexArrs.push(`${licenseKeys[index]}${licenseKeys[index + 1]}`)
        })
        let licenseAddressInArraysBinTmp = licenseAddressInArraysBin;
        value16BytesHexArrs.forEach(value => {
            binaryConvert[licenseAddressInArraysBinTmp] = value;
            licenseAddressInArraysBinTmp += 1;
        });

        // write file and return    
        const BufferDataUpdated = Buffer.from(binaryConvert.join(""), "hex");
        const fileName = `data-${userId}-${new Date().getTime()}.bin`;
        const pathFileName = `${FolderPath.uploadBinsPath}/${fileName}`;
        const downloadPathFileName = `${FolderPath.downloadBinsPath}/${fileName}`;
        console.log('fileName binary updated: ', fileName)
        await fs.writeFileSync(pathFileName, BufferDataUpdated, "binary");
        // const url = await uploadToS3(pathFileName, fileName, 'application/octet-stream');
        // if (!url) { return null; }
        // fs.unlinkSync(pathFileName);
        return downloadPathFileName;
    } catch (err) {
        logger.error(JSON.stringify(err));
        throw new HttpException(err.message, err.status);
    }

  }
}