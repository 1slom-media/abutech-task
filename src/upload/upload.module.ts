import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { UploadProvider } from './upload';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesEntity } from './upload.entity';

@Module({
  imports:[TypeOrmModule.forFeature([FilesEntity])],
  controllers: [UploadController],
  providers: [UploadService, UploadProvider],
})
export class UploadModule {}
