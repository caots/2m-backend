import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ENV_VALUE } from '../constants/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor () {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: ENV_VALUE.JWT_SECRET,
        });
    }

    async validate(payload: any) {
        return payload;
    }
}

export class JwtAuthGuard extends AuthGuard('jwt') { }