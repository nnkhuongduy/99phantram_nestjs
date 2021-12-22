import { IsMongoId, IsNotEmpty, IsString, Length } from 'class-validator';

export class StepTwoUpdateDto {
  @IsNotEmpty()
  @IsString()
  @Length(10, 13)
  phoneNumber: string;

  @IsNotEmpty()
  @IsMongoId()
  province: string;

  @IsNotEmpty()
  @IsMongoId()
  ward: string;

  @IsNotEmpty()
  @IsMongoId()
  block: string;

  @IsNotEmpty()
  @IsString()
  address: string;
}
