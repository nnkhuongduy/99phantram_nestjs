import {
  Controller,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { AMAZON_BUCKETS } from './constants';
import { UploadService } from './upload.service';

@Controller('/api/file')
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Post('avatar')
  async uploadAvatar() {}

  @Post('image')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage() {}

  @Post('images')
  @UseInterceptors(FilesInterceptor('images'))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    return {
      urls: await this.uploadService.uploadFiles(files, AMAZON_BUCKETS.images),
    };
  }

  @Post('thumbnail')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async uploadThumbnail(@UploadedFile() file: Express.Multer.File) {
    return {
      url: await this.uploadService.uploadFile(file, AMAZON_BUCKETS.thumbnails),
    };
  }
}
