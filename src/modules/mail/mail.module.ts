import { MailerModule } from '@nestjs-modules/mailer';
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter';
import { Module } from '@nestjs/common';
import 'dotenv/config';
import { join } from 'path';
import { MailService } from './mail.service';
@Module({
    imports: [
        MailerModule.forRoot({
            transport: {
                host: process.env.MAIL_HOST,
                port: Number.parseInt(process.env.MAIL_PORT),
                secure: false,
                auth: {
                    user: process.env.MAIL_USERNAME,
                    pass: process.env.MAIL_PASSWORD,
                },
                tls: {
                    rejectUnauthorized: false,
                },
            },
            defaults: {
                from: 'no-reply-aws@amazon.com',
            },
            template: {
                dir: join(__dirname, '../../../templates'),
                adapter: new EjsAdapter(),
                options: {
                    strict: false,
                },
            },
        }),
    ],
    providers: [MailService],
    exports: [MailService]

})
export class MailModule { }
