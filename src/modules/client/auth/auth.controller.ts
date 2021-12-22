import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthService } from 'src/modules/auth/auth.service';
import { AppLocalAuthGuard } from 'src/modules/auth/guards/app-local.guard';
import { ClientJwtAuthGuard } from 'src/modules/auth/guards/client-jwt.guard';
import { UserService } from 'src/modules/user/user.service';
import { UserInfoGuard } from 'src/modules/auth/guards/user-info.guard';
import { LoginDto } from './dtos/login.dto';
import { RegistrationDto } from './dtos/registration.dto';
import { StepTwoUpdateDto } from './dtos/step-two.dto';

@Controller('/api/auth')
export class FrontendAuthController {
  constructor(
    private userSerivce: UserService,
    private authService: AuthService,
  ) {}

  @Post('registration')
  async registration(@Body() body: RegistrationDto) {
    await this.userSerivce.register(body);
  }

  @Get('verification/:id')
  async verification(@Param('id') id: string) {
    await this.userSerivce.verification(id);
  }

  @Post('login')
  @UseGuards(AppLocalAuthGuard)
  async login(@Body() body: LoginDto, @Req() req) {
    return await this.authService.login(req.user, body.remember);
  }

  @Get('authenticate')
  @UseGuards(ClientJwtAuthGuard)
  @UseGuards(UserInfoGuard)
  async authenticate(@Req() req) {
    return req.user;
  }

  @Post('step-two')
  @UseGuards(ClientJwtAuthGuard)
  async stepTwoUpdate(@Body() body: StepTwoUpdateDto, @Req() req) {
    await this.userSerivce.stepTwoUpdate(req.user, body);
  }
}
