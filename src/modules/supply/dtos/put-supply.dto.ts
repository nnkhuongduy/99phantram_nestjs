import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { SupplyStatus } from 'src/schemas/supply.schema';

export class PutSupplyDto {
  @IsNotEmpty()
  status: SupplyStatus;

  @IsNotEmpty()
  @IsBoolean()
  sendEmail: boolean;

  @IsOptional()
  @IsString()
  reason: string;
}
