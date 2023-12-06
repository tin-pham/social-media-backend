import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './local/local.stategy';
import { JwtStrtegy } from './jwt/jwt.strategy';
import { AuthController } from './auth.controller';
import { UserRepository } from '../user/user.repository';
import { AuthService } from './auth.service';
import { CacheModule } from '../cache/cache.module';
import { RefreshTokenService } from './jwt/refresh-token.service';
import { JwtRefreshTokenStrategy } from './jwt/jwt-refresh-token.strategy';

const configService = new ConfigService();

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: configService.get('JWT_SECRET'),
      signOptions: { expiresIn: configService.get('JWT_EXPIRATION_TIME') },
    }),
    CacheModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserRepository,
    LocalStrategy,
    JwtStrtegy,
    JwtRefreshTokenStrategy,
    RefreshTokenService,
  ],
})
export class AuthModule {}