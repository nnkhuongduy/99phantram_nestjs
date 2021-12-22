import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class PostSpecDto {
  id: string;
  value: string;
}

export class PostSupplyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1000)
  price: number;

  @IsNotEmpty()
  description: string;

  specs: PostSpecDto[];

  @IsNotEmpty()
  images: string[];

  @IsNotEmpty()
  thumbnail: string;

  @IsNotEmpty()
  categories: string[];

  @IsNotEmpty()
  locations: string[];

  @IsNotEmpty()
  address: string;

  @IsNotEmpty()
  productStatus: number;
}