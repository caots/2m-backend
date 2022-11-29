import { Body, Controller, Get, Param, Post, Put, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from 'src/commons/auth/jwt.strategy';
import { Roles } from 'src/commons/auth/roles.decorator';
import { RolesGuard } from 'src/commons/auth/roles.guard';
import { UserRole } from 'src/commons/constants/config';
import LocalFilesInterceptor from 'src/commons/interceptors/localFiles.interceptor';
import { TransformInterceptor } from "src/commons/interceptors/transform.interceptor";
import { CreateVehicleDto } from './dto/createVehicle.dto';
import { FlashSuccessDto, TuneVehicleDto, UnStockVehicleDto } from './dto/tuneVehicle.dto';
import { VehicleService } from "./vehicle.service";

@ApiTags('Vehicle')
@Controller('vehicle')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService
    ) { }

  // get list vehicle
  @Get()
  @Roles(UserRole.USER)
  @UseInterceptors(TransformInterceptor)
  async getListVehicle(@Request() req) {
    return this.vehicleService.getListVehicle(req.user.userId);
  }

  // create vehicle
  @Post()
  @Roles(UserRole.USER)
  @UseInterceptors(TransformInterceptor)
  async createVehicle(@Request() req, @Body() body: CreateVehicleDto) {
    return this.vehicleService.createNewVehicle(req.user.userId, body);
  }

  // check and Assign vehicle
  @Put('/tune')
  @Roles(UserRole.USER)
  @UseInterceptors(TransformInterceptor)
  async tuneVehicle(@Request() req, @Body() body: TuneVehicleDto) {
    return this.vehicleService.tuneVehicle(req.user.userId, body);
  }

  // flash completed
  @Put('/flash-completed')
  @Roles(UserRole.USER)
  @UseInterceptors(TransformInterceptor)
  async flashCompletedVehicle(@Request() req, @Body() body: FlashSuccessDto) {
    return this.vehicleService.flashCompletedVehicle(body);
  }

  // Unassign vehicle
  @Put('/un-stock')
  @Roles(UserRole.USER)
  @UseInterceptors(TransformInterceptor)
  async unStockVehicle(@Request() req, @Body() body: UnStockVehicleDto) {
    return this.vehicleService.unStockVehicle(body);
  }

  // Unassign vehicle
  @Get('/get-model/:vin_number')
  @Roles(UserRole.USER)
  @UseInterceptors(TransformInterceptor)
  async getModelVehicle(@Request() req, @Param('vin_number') vinNumber: string) {
    return this.vehicleService.getModelVehicle(vinNumber);
  }

  // update product
  @Post('/save-logs')
  @UseInterceptors(LocalFilesInterceptor({
      fieldName: 'file',
      path: 'logs-dev'
  }))
  @Roles(UserRole.USER)
  @UseInterceptors(TransformInterceptor)
  async updateProductById(@Request() req, @UploadedFile() file: Express.Multer.File) {
      return this.vehicleService.saveLogsVehicleDev(file);
  }
}