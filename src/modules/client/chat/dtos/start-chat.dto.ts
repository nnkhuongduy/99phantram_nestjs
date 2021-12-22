import { IsMongoId, IsNotEmpty } from 'class-validator';

export class StartChatDto {
  @IsNotEmpty()
  @IsMongoId()
  receiverId: string;

  @IsNotEmpty()
  message: string;
}
