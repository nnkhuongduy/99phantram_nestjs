import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class ClientJwtAuthGuard extends AuthGuard('clientJwt') {}
