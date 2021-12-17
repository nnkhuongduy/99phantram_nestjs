import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AppJwtAuthGuard } from './guards/jwt.guard';
import { AppLocalAuthGuard } from './guards/local.guard';
import { AppJwtStrategy } from './strategies/jwt.strategy';
import { AppLocalStrategy } from './strategies/local.strategy';

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
  ],
  exports: [AuthService],
})
export class AuthModule {}
