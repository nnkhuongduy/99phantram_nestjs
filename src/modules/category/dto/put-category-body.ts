import { IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { CategoryLevel, CategoryStatus } from 'src/schemas/category.schema';

export class PutCategoryBodyDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  image: string;

  @IsNotEmpty()
  @IsEnum(Object.keys(CategoryLevel).filter((key) => typeof key === 'number'))
  categoryLevel: number;

  @IsNotEmpty()
  @IsEnum(Object.keys(CategoryStatus).filter((key) => typeof key === 'number'))
  status: number;

  @IsNotEmpty()
  slug: string;

  @IsNotEmpty()
  @IsArray()
  subCategories: string[];
}
