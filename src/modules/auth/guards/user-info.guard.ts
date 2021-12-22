import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserInfoGuard extends AuthGuard('userInfo') {}
