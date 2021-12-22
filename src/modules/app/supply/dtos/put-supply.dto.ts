import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class PutSupplyDto {
  @IsNotEmpty()
  @IsNumber()
  status: number;

  @IsNotEmpty()
  @IsBoolean()
  sendMail: boolean;

  @IsOptional()
  reason: string;
}
