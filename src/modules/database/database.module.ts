import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category, CategorySchema } from 'src/schemas/category.schema';
import {
  ChatMessage,
  ChatMessageSchema,
} from 'src/schemas/chat-message.schema';
import { Chat, ChatSchema } from 'src/schemas/chat.schema';
import { Location, LocationSchema } from 'src/schemas/location.schema';
import { Order, OrderSchema } from 'src/schemas/order.schema';
import { Rating, RatingSchema } from 'src/schemas/rating.schema';
import { Role, RoleSchema } from 'src/schemas/role.schema';
import {
  ServiceType,
  ServiceTypeSchema,
} from 'src/schemas/service-type.schema';
import { Service, ServiceSchema } from 'src/schemas/service.schema';
import { Spec, SpecSchema } from 'src/schemas/spec.schema';
import { Supply, SupplySchema } from 'src/schemas/supply.schema';
import { User, UserSchema } from 'src/schemas/user.schema';

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Spec.name, schema: SpecSchema },
      { name: Category.name, schema: CategorySchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Location.name, schema: LocationSchema },
      { name: Supply.name, schema: SupplySchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: ServiceType.name, schema: ServiceTypeSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Spec.name, schema: SpecSchema },
      { name: Category.name, schema: CategorySchema },
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: Chat.name, schema: ChatSchema },
      { name: Location.name, schema: LocationSchema },
      { name: Supply.name, schema: SupplySchema },
      { name: Role.name, schema: RoleSchema },
      { name: User.name, schema: UserSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Rating.name, schema: RatingSchema },
      { name: ServiceType.name, schema: ServiceTypeSchema },
      { name: Service.name, schema: ServiceSchema },
    ]),
  ],
})
export class DatabaseModule {}
