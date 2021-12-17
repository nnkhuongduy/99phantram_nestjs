import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { _99AppModule } from './modules/app/app.module';
import { DatabaseModule } from './modules/database/database.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: `mongodb+srv://${config.get<string>(
          'DATABASE_USERNAME',
        )}:${config.get<string>(
          'DATABASE_PASSWORD',
        )}@99phantram.6mk6v.mongodb.net/99phantram?retryWrites=true&w=majority`,
      }),
      inject: [ConfigService],
    }),
    DatabaseModule,
    _99AppModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
