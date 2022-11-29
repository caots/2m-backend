import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { STATUS_VERIFIED } from 'src/commons/constants/config';
import { MESSAGES_ERROR } from 'src/commons/constants/message.constants';
import { Connection, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from '../auth/dto/user.create-dto';
import { MailService } from '../mail/mail.service';
import { UpdateProfileDto } from './dto/user.update-dto';
import { OrdersEntity } from '../orders/entity/orders.entity';
import { OrdersService } from '../orders/orders.service';
import { UpdateUserDto } from './dto/user.update-dto';
import { UserEntity } from './entity/user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        
        private connection: Connection,
        private readonly mailService: MailService,

    ) { }

    async createManyUser(users: CreateUserDto[]): Promise<void> {
        const queryRunner = this.connection.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const user of users) {
                await queryRunner.manager.save(user);
            }
            await queryRunner.commitTransaction();
        } catch (err) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find({ relations: ['address'] });
    }

    async findUserById(id: number): Promise<UserEntity> {
        const selectedUser: UserEntity = await this.userRepository.findOne({ id });
        return selectedUser;
    }

    async findUserByVerifiedToken(verifiedToken: string): Promise<UserEntity> {
        const selectedUser: UserEntity = await this.userRepository.findOne({ verified_token: verifiedToken });
        return selectedUser;
    }

    async findUserByEmail(email: string): Promise<UserEntity> {
        const selectedUser: UserEntity = await this.userRepository.findOne({ email });
        return selectedUser;
    }

    async updateUserById(userId: number, updateUserDto: UpdateUserDto): Promise<UpdateResult> {
        return await this.userRepository.update(userId, updateUserDto);
    }

    async updateUserSslStripeById(userId: number, customer_ssl: string): Promise<UpdateResult> {
        return await this.userRepository.update(userId, { customer_ssl });
    }

    async removeUserById(userId: number): Promise<void> {
        const user: UserEntity = await this.findUserById(userId);
        await this.userRepository.delete(userId);
    }

    async updateUserEmail(userId: number, email: string): Promise<Object> {
        try {
            const checkExistEmail = await this.findUserByEmail(email);
            if (checkExistEmail) throw new BadRequestException(MESSAGES_ERROR.EMAIL_EXIST);
            const verifiedToken = bcrypt.hashSync(`${email}${Date.now()}`, 10);
            const currentUser = await this.findUserById(userId);
            currentUser.email = email;
            currentUser.email_verified = STATUS_VERIFIED.INACTIVE;
            currentUser.verified_token = verifiedToken;
            const updateUser = await this.updateUserById(userId, currentUser);
            if (!updateUser) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            // send mail active account
            const sendMail = await this.mailService.sendUserConfirmation(email, verifiedToken);
            console.log('sendMail: ', sendMail)
            if (!sendMail) throw new BadRequestException(MESSAGES_ERROR.sendMailError);
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async updateUserProfile(userId: number, body: UpdateProfileDto): Promise<Object> {
        try {
            const currentUser = await this.findUserById(userId);
            currentUser.full_name = body.full_name;
            currentUser.age = body.age;
            const updateUser = await this.updateUserById(userId, currentUser);
            if (!updateUser) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }
}
