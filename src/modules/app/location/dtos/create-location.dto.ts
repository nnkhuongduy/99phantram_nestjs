import { IsNotEmpty } from "class-validator";

export class CreateLocationDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  locationLevel: number;

  @IsNotEmpty()
  status: number;

  subLocations: string[];
}