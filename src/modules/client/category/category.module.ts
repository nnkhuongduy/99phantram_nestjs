import { Module } from "@nestjs/common";

import { ClientCategoryController } from "./category.controller";

@Module({
  controllers: [ClientCategoryController],
})
export class ClientCategoryModule {}