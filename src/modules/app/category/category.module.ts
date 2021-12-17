import { Module } from '@nestjs/common';

import { CategoryModule } from 'src/modules/category/category.module';
import { AppCategoryController } from './category.controller';

@Module({
  imports: [CategoryModule],
  controllers: [AppCategoryController],
})
export class AppCategoryModule {}
