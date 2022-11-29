import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/modules/user/entity/user.entity';
import { UserModule } from 'src/modules/user/user.module';
import { UserSessionEntity } from '../user/entity/userSession.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from '../../commons/auth/jwt.strategy';
import { LocalStrategy } from '../../commons/auth/local.strategy';
import { ENV_VALUE } from 'src/commons/constants/config';
import { MailService } from '../mail/mail.service';
import { UserForgotResetEntity } from '../user/entity/userForgotReset.entity';

@Module({
    imports:[
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                secret: ENV_VALUE.JWT_SECRET,
                signOptions: { expiresIn: `${ENV_VALUE.JWT_SECRET_EXPIRES}s`}
            })
        }),
        TypeOrmModule.forFeature([UserEntity, UserSessionEntity, UserForgotResetEntity]),
        PassportModule,
        forwardRef(() => UserModule),
    ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JwtStrategy, MailService],
    exports: [AuthService],
})
export class AuthModule {}
