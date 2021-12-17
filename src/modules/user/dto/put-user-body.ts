import {
  IsEmail,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Gender, UserStatus } from 'src/schemas/user.schema';

export class PutUserBodyDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(Object.keys(Gender).map((key) => typeof key === 'number'))
  sex: Gender;

  @IsOptional()
  address: string;

  @IsOptional()
  phoneNumber: string;

  @IsOptional()
  avatar: string;

  @IsNotEmpty()
  @IsMongoId()
  role: string;

  @IsNotEmpty()
  @IsNumber()
  @IsEnum(Object.keys(UserStatus).map((key) => typeof key === 'number'))
  status: UserStatus;
}
