import { MailerService } from '@nestjs-modules/mailer';
import { HttpException, Injectable } from '@nestjs/common';
import { ENV_VALUE } from 'src/commons/constants/config';

@Injectable()
export class MailService {

    constructor(private mailerService: MailerService) { }

    async sendUserConfirmation(email: string, token: string,) {
        try {
            const subject = "2M Sign up Confirmation";
            const fileTemplate = "activeAccount";
            const mainUrl = `${ENV_VALUE.WEBSITE_URL}/active-account?token=${encodeURIComponent(token)}`
            const response = {
                mainUrl,
                logoUrl: "",
                currentYear: new Date().getFullYear()
            }
            console.log('mainUrl: ', mainUrl)
            const result = await this.mailerService.sendMail({
                from: ENV_VALUE.MAIL_FROM_ADDRESS,
                to: email, subject,
                template: fileTemplate,
                context: response,
            });
            return result;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }

    async sendUserResetPassword(email: string, token: string,) {
        try {
            const subject = "2M Forgot Password";
            const fileTemplate = "forgotPassword";
            const mainUrl = `${ENV_VALUE.WEBSITE_URL}/resetPassword?token=${encodeURIComponent(token)}`
            const response = {
                mainUrl,
                logoUrl: "",
                currentYear: new Date().getFullYear()
            }
            console.log('mainUrl: ', mainUrl)
            const result = await this.mailerService.sendMail({
                from: ENV_VALUE.MAIL_FROM_ADDRESS,
                to: email, subject,
                template: fileTemplate,
                context: response,
            });
            return result;
        } catch (err) {
            throw new HttpException(err.message, err.status);
        }
    }
}
