import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    private readonly logger = new Logger(GoogleStrategy.name);
    constructor(configService: ConfigService) {
        const clientID = configService.get<string>('GOOGLE_CLIENT_ID');
        const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET');
        const callbackURL = configService.get<string>('GOOGLE_CALLBACK_URL');

        super({
            clientID,
            clientSecret,
            callbackURL,
            scope: ['email', 'profile'],
        });

        this.logger.log(`GOOGLE_CLIENT_ID: ${clientID}`);
        this.logger.log(`GOOGLE_CALLBACK_URL: ${callbackURL}`);
    }

    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile;
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken,
        };
        done(null, user);
    }
}
