import { Body, Controller, Get, Post, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/commons/auth/jwt.strategy';
import { TransformInterceptor } from 'src/commons/interceptors/transform.interceptor';
import { AuthService } from './auth.service';
import { ActiveAccountDto, SetPasswordDto } from './dto/active-account.dto';
import { ForgotPasswordDto } from './dto/forgotPassword.dto';
import { CreateUserDto } from './dto/user.create-dto';
import { LoginBody, RefreshTokenDto } from './dto/user.login-dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/register')
    @UseInterceptors(TransformInterceptor)
    async createUser(@Body() user: CreateUserDto) {
        return this.authService.createUser(user);
    }

     @Post('/resend-email')
    @UseInterceptors(TransformInterceptor)
    async resendEmailRegister(@Request() req) {
        return this.authService.resendEmailRegister(req.user.userId);
    }

    @Post('login')
    @UseInterceptors(TransformInterceptor)
    async login(@Body() body: LoginBody) {
        const { email, password, is_mobile } = body;
        return this.authService.login(email, password, is_mobile);
    }

    @Post('forgot-password')
    @UseInterceptors(TransformInterceptor)
    async forgotPassword(@Body() body: ForgotPasswordDto) {
        const { email } = body;
        return this.authService.forgotPassword(email);
    }

    @Post('set-password')
    @UseInterceptors(TransformInterceptor)
    async setPassword(@Request() req, @Body() body: SetPasswordDto) {
        return this.authService.setNewPassword(body)
    }

    @Get('profile')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformInterceptor)
    async getProfile(@Request() req) {
        return this.authService.getProfile(req.user.userId)
    }

    @Post('active-account')
    @UseInterceptors(TransformInterceptor)
    async activeAccount(@Request() req, @Body() body: ActiveAccountDto) {
        return this.authService.activeAccount(body.token)
    }

    @Get('logout')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async logout(@Request() req){
        const token = (req.headers.authorization).replace('Bearer ','')
        await this.authService.logout(token,req.user.userId)
        return true
    }

    @Post('refresh-token')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(TransformInterceptor)
    async refreshToken(@Request() req, @Body() data: RefreshTokenDto){
        return await this.authService.refreshToken(data.refreshToken,req.user.userId)
    }

    @Post('refresh-token-app')
    @UseInterceptors(TransformInterceptor)
    async refreshTokenForApp(@Body() data: RefreshTokenDto){
        return await this.authService.refreshTokenForApp(data.refreshToken)
    }

    // login with auth firebase
    
}
