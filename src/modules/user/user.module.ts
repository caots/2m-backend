import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './user.controller';
import { UserEntity } from './entity/user.entity';
import { UserService } from './user.service';
import { UserSubscriber } from './user.subscriber';
import { AuthModule } from 'src/modules/auth/auth.module';
import { UserSessionEntity } from './entity/userSession.entity';
import { MailService } from '../mail/mail.service';
import { UserForgotResetEntity } from './entity/userForgotReset.entity';
@Module({
    imports: [
        TypeOrmModule.forFeature([UserEntity, UserSessionEntity, UserForgotResetEntity]),
        forwardRef(() => AuthModule),
    ],
    controllers: [UserController],
    providers: [UserService, UserSubscriber, MailService],
    exports: [UserService]
})
export class UserModule {}
