import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards, Request, Put, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from '../auth/dto/user.create-dto';
import { JwtAuthGuard } from '../../commons/auth/jwt.strategy';
import { UpdateEmailDto, UpdateProfileDto, UpdateUserDto } from './dto/user.update-dto';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptor';

@ApiTags('Users')
@Controller('user')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor (private readonly userService: UserService){}

    @Post('/list')
    createManyUser (@Body() userList: CreateUserDto[]): Promise<void> {
        return this.userService.createManyUser(userList);
    }
    
    @Get('/list')
    findUserList (): Promise<UserEntity[]>{
        return this.userService.findAll();
    }

    @Get('/search')
    findUserByEmail (@Query('email') email: string): Promise<UserEntity>{
        return this.userService.findUserByEmail(email);
    }

    @Get('/:userId')
    findUserById (@Param('userId') userId: number): Promise<UserEntity>{
        return this.userService.findUserById(userId);
    }

    @Patch()
    @UseGuards(AuthGuard('jwt'))
    updateUserById (@Request() req, @Body() updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return this.userService.updateUserById(req.user.userId, updateUserDto);    
    }

    @Delete()
    @UseGuards(AuthGuard('jwt'))
    deleteUser (@Request() req): Promise<void> {
        return this.userService.removeUserById(req.user.userId);
    }

    // update email
    @Put('update-email')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    updateEmailUser (@Request() req, @Body() body: UpdateEmailDto): Promise<Object> {
        return this.userService.updateUserEmail(req.user.userId, body.email);
    }


    // update profile
    @Put('update-profile')
    @UseGuards(AuthGuard('jwt'))
    @UseInterceptors(TransformInterceptor)
    updateProfileUser (@Request() req, @Body() body: UpdateProfileDto): Promise<Object> {
        return this.userService.updateUserProfile(req.user.userId, body);
    }
}
