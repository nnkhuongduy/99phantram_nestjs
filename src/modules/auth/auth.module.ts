import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AppJwtAuthGuard } from './guards/app-jwt.guard';
import { ClientJwtAuthGuard } from './guards/client-jwt.guard';
import { AppLocalAuthGuard } from './guards/app-local.guard';
import { AppJwtStrategy } from './strategies/app-jwt.strategy';
import { ClientJwtStrategy } from './strategies/client-jwt.strategy';
import { AppLocalStrategy } from './strategies/app-local.strategy';
import { ClientLocalStrategy } from './strategies/client-local.strategy';
import { UserInfoStrategy } from './strategies/user-info.strategy';
import { UserInfoGuard } from './guards/user-info.guard';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    AuthService,
    AppLocalStrategy,
    AppJwtStrategy,
    AppLocalAuthGuard,
    AppJwtAuthGuard,
    ClientJwtAuthGuard,
    ClientLocalStrategy,
    ClientJwtStrategy,
    UserInfoStrategy,
    UserInfoGuard,
  ],
  exports: [AuthService],
})
export class AuthModule {}
