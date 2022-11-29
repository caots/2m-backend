import { BadRequestException, forwardRef, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Inject } from '@nestjs/common/decorators';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import * as moment from "moment";
import { COMMON_STATUS, ENV_VALUE, STATUS_VERIFIED } from 'src/commons/constants/config';
import { MESSAGES_ERROR } from 'src/commons/constants/message.constants';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { UserService } from 'src/modules/user/user.service';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from '../mail/mail.service';
import { UserForgotResetEntity } from '../user/entity/userForgotReset.entity';
import { UserSessionEntity } from '../user/entity/userSession.entity';
import { SetPasswordDto } from './dto/active-account.dto';
import { CreateUserDto } from './dto/user.create-dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(UserSessionEntity)
        private userSessionRepository: Repository<UserSessionEntity>,
        @InjectRepository(UserForgotResetEntity)
        private userForgotResetEntity: Repository<UserForgotResetEntity>,
        @Inject(forwardRef(() => UserService))
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService,
    ) { }

    async createUser(user: CreateUserDto): Promise<UserEntity> {
        try {
            const { email, password, name, age } = user;
            const findUser: UserEntity = await this.userRepository.findOne({ email });
            if (findUser) throw new BadRequestException(MESSAGES_ERROR.EMAIL_EXIST);
            const hashPassword: string = await this.hashPassword(password);
            const verifiedToken = bcrypt.hashSync(`${user.email}${Date.now()}`, 10);
            const newUser = await this.userRepository.save({ email, full_name: name, verified_token: verifiedToken, age, password: hashPassword, status: 'active', roles: 'user' });
            if (!newUser) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            // send email active to user
            const sendMail = await this.mailService.sendUserConfirmation(newUser.email, newUser.verified_token);
            console.log('sendMail: ', sendMail)
            if (!sendMail) throw new BadRequestException(MESSAGES_ERROR.sendMailError);
            return newUser;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async resendEmailRegister(userId: number): Promise<Object> {
        try {
            const user: UserEntity = await this.getProfile(userId);
            if (!user) throw new BadRequestException(MESSAGES_ERROR.USER_NOT_FOUND);
            const verifiedToken = bcrypt.hashSync(`${user.email}${Date.now()}`, 10);
            user.verified_token = verifiedToken;
            const newUser = await this.userRepository.update(user.id, user);
            if (!newUser) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            // send email active to user
            const sendMail = await this.mailService.sendUserConfirmation(user.email, user.verified_token);
            console.log('sendMail: ', sendMail)
            if (!sendMail) throw new BadRequestException(MESSAGES_ERROR.sendMailError);
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async login(email: string, password: string, is_mobile: number = 0) {
        try {
            const findUser = await this.validateUser(email, password)
            if (!findUser) {
                throw new BadRequestException(MESSAGES_ERROR.WRONG_EMAIL_OR_PASSWORD)
            }
            if (!findUser.email_verified || findUser.email_verified == STATUS_VERIFIED.INACTIVE) {
                throw new BadRequestException(MESSAGES_ERROR.EMAIL_NOT_VERIFIED)
            }

            return await this.saveSessionUser(findUser, is_mobile)
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async forgotPassword(email: string): Promise<Object> {
        try {
            const findUser: UserEntity = await this.userRepository.findOne({ email });
            if (!findUser) throw new BadRequestException(MESSAGES_ERROR.WRONG_EMAIL);
            if (findUser.status != COMMON_STATUS.Active) throw new BadRequestException(MESSAGES_ERROR.USER_NOT_ACTIVE);
            if (findUser.email_verified == STATUS_VERIFIED.INACTIVE) throw new BadRequestException(MESSAGES_ERROR.EMAIL_NOT_VERIFIED);
            const userForgot = await this.genTokenForgot(email);
            // send email active to user
            const sendMail = await this.mailService.sendUserResetPassword(userForgot.email, userForgot.token);
            console.log('sendMail: ', sendMail)
            if (!sendMail) throw new BadRequestException(MESSAGES_ERROR.sendMailError);
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async setNewPassword(body: SetPasswordDto): Promise<Object> {
        try {
            const token = decodeURIComponent(body.token);
            let userForgotPassword = await this.findTokenForgot(token);
            const findUser: UserEntity = await this.userRepository.findOne({ email: userForgotPassword.email });
            if (!findUser) throw new NotFoundException(MESSAGES_ERROR.USER_NOT_FOUND)
            const hashPassword: string = await this.hashPassword(body.password);
            findUser.password = hashPassword;
            const results = await this.userService.updateUserById(findUser.id, findUser);
            if (!results) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            await this.deleteTokenForgotById(userForgotPassword.id);
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async findTokenForgot(token: string): Promise<UserForgotResetEntity> {
        try {
            const userForgot = await this.userForgotResetEntity.findOne({ token });
            if (!userForgot) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            return userForgot;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async deleteTokenForgotById(id: number): Promise<Object> {
        try {
            const results = await this.userForgotResetEntity.delete(id);
            if (!results) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            return results;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async genTokenForgot(email: string): Promise<UserForgotResetEntity> {
        try {
            const token = bcrypt.hashSync(moment.utc().toISOString(), 10);
            const userForgot = {
                email,
                token
            };
            const newUserForgot = await this.userForgotResetEntity.save(userForgot);
            if (!newUserForgot) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain);
            return newUserForgot;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    generateJWT(id: number, email: string, roles: string): Promise<string> {
        return this.jwtService.signAsync({ id, email, roles });
    }

    hashPassword(password: string): Promise<string> {
        return bcrypt.hash(password, 12);
    }

    comparePassword(newPassword: string, passwordHash: string): boolean {
        return bcrypt.compareSync(newPassword, passwordHash);
    }

    async validateUser(email: string, password: string): Promise<UserEntity> {
        try {
            const findUser: UserEntity = await this.userService.findUserByEmail(email);
            if (!findUser || !this.comparePassword(password, findUser.password)) {
                throw new BadRequestException(MESSAGES_ERROR.WRONG_EMAIL_OR_PASSWORD)
            }
            return findUser;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async saveSessionUser(user: UserEntity, is_mobile: number = 0) {
        try {
            const result = await this.createSession(user, is_mobile);
            const auth_info = { user_id: result.userId, access_token: result.access_token, refresh_token: result.refresh_token, expires_in: result.expires_in };
            return auth_info;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }

    }

    async createSession(user: UserEntity, is_mobile: number = 0): Promise<UserSessionEntity> {
        try {
            await this.removeAllExpiresByUser(user.id)
            let expiresIn = is_mobile ? ENV_VALUE.JWT_SECRET_EXPIRES_MOBILE : ENV_VALUE.JWT_SECRET_EXPIRES
            let refreshExpiresIn = ENV_VALUE.JWT_REFRESH_SECRET_EXPIRES
            const jwtInfo = { userId: user.id, email: user.email, roles: user.roles }
            const token = this.jwtService.sign(jwtInfo, {
                expiresIn: is_mobile == 1 ? `${ENV_VALUE.JWT_SECRET_EXPIRES_MOBILE}s` : `${ENV_VALUE.JWT_SECRET_EXPIRES}s`
            })
            const refreshToken = uuidv4()
            const userSessionModel = new UserSessionEntity();
            userSessionModel.userId = user.id
            userSessionModel.access_token = token;
            userSessionModel.refresh_token = refreshToken;
            userSessionModel.expires_in = parseInt(expiresIn);
            userSessionModel.created_at = moment().utc().format("YYYY-MM-DD HH:mm:ss");
            userSessionModel.expires_date = new Date().getTime() + parseInt(refreshExpiresIn) * 1000
            const result = await this.userSessionRepository.save({ ...userSessionModel });
            return result;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async getProfile(userId: number) {
        return await this.userService.findUserById(userId);
    }

    async logout(token: string, userId: number) {
        try {
            return await this.userSessionRepository.delete({ access_token: token, userId })
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async activeAccount(tokenEncode: string) {
        try {
            const token = decodeURIComponent(tokenEncode);
            let user = await this.userService.findUserByVerifiedToken(token);
            if (!user) throw new NotFoundException(MESSAGES_ERROR.USER_NOT_FOUND)
            user.verified_token = null;
            user.email_verified = STATUS_VERIFIED.ACTIVE;
            const results = await this.userService.updateUserById(user.id, user);
            if (!results) throw new BadRequestException(MESSAGES_ERROR.pleaseTryAgain)
            return { success: true };
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async refreshToken(token: string, userId: number) {
        try {
            const findUser: UserEntity = await this.userService.findUserById(userId);
            if (!findUser) {
                throw new NotFoundException(MESSAGES_ERROR.USER_NOT_FOUND)
            }
            const checkSession = await this.userSessionRepository.findOne({ refresh_token: token, userId })
            if (!checkSession) {
                throw new BadRequestException(MESSAGES_ERROR.TOKEN_INVALID)
            }
            await this.userSessionRepository.delete({ refresh_token: token, userId })
            return await this.saveSessionUser(findUser)
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async refreshTokenForApp(token: string) {
        try {
            const session = await this.userSessionRepository.findOne({ refresh_token: token })
            if (!session || session.expires_date < new Date().getTime()) {
                throw new BadRequestException(MESSAGES_ERROR.TOKEN_INVALID)
            }
            const findUser: UserEntity = await this.userService.findUserById(session.userId);
            if (!findUser) {
                throw new NotFoundException(MESSAGES_ERROR.USER_NOT_FOUND)
            }
            await this.userSessionRepository.delete({ refresh_token: token })
            return await this.saveSessionUser(findUser)
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async removeAllExpiresByUser(idUser: number) {
        try {
            const result = await this.userSessionRepository
                .createQueryBuilder()
                .delete()
                .from(UserSessionEntity)
                .where({ userId: idUser })
                .andWhere(`expires_date < ${new Date().getTime()}`)
                .execute()
            return result;
        } catch (err) {
            throw err;
        }
    }
}
