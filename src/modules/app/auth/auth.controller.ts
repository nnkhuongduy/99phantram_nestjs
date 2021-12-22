import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';

import { AuthService } from 'src/modules/auth/auth.service';
import { AppJwtAuthGuard } from 'src/modules/auth/guards/app-jwt.guard';
import { AppLocalAuthGuard } from 'src/modules/auth/guards/app-local.guard';
import { AuthRequestDto } from './dtos/auth-request.dto';

@Controller('/api/app/auth')
export class AppAuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AppLocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() authRequestDto: AuthRequestDto) {
    return this.authService.login(req.user, authRequestDto.remember);
  }

  @Get()
  @UseGuards(AppJwtAuthGuard)
  authenticate(@Request() req) {
    return req.user;
  }
}
