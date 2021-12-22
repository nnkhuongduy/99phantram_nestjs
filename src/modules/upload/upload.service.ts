import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

@Injectable()
export class UploadService implements OnModuleInit {
  private _S3: S3;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    this._S3 = new S3({
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY'),
      region: 'ap-southeast-1',
    });
  }

  uploadFile(file: Express.Multer.File, bucket: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._S3.upload(
        {
          Bucket: bucket,
          Body: file.buffer,
          Key: file.originalname,
        },
        (error, data) => {
          if (error) reject(error);

          resolve(data.Location);
        },
      );
    });
  }

  uploadFiles(files: Express.Multer.File[], bucket: string): Promise<string[]> {
    return new Promise(async (resolve, reject) => {
      const urls = [];

      for (const file of files) {
        const url = await this.uploadFile(file, bucket);
        urls.push(url);
      }

      resolve(urls);
    });
  }
}
