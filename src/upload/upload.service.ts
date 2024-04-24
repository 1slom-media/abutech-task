import { Injectable, NotFoundException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './response';
import { InjectRepository } from '@nestjs/typeorm';
import { FilesEntity } from './upload.entity';
import { Repository } from 'typeorm';
const streamifier = require('streamifier');

@Injectable()
export class UploadService {
  constructor(
    @InjectRepository(FilesEntity) private repo: Repository<FilesEntity>,
  ) {}

  async uploadFile(
    file: Express.Multer.File,
    filename: string,
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          if (error) return reject(error);
          this.saveFile(result, filename)
            .then((savedFile) => {
              resolve(savedFile);
            })
            .catch((err) => {
              reject(err);
            });
        },
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  private async saveFile(
    fileData: CloudinaryResponse,
    filename: string,
  ): Promise<FilesEntity> {
    const { format, secure_url, bytes } = fileData;
    const filesize = `${bytes / (1024 * 1024)}MB`;
    const newFile = new FilesEntity();
    newFile.filename = filename;
    newFile.extension = format;
    newFile.url = secure_url;
    newFile.filesize = filesize;
    return await this.repo.save(newFile);
  }

  find(skip:number,take:number) {
    if(+skip>0 && +take>0){
      return this.repo.find({
        skip:take * (skip - 1),
        take:take
      })
    }else{
      return this.repo.find();
    }
  }

  async update(id: number, filename: string) {
    const file = await this.repo.findOneBy({ id });
    if (!file) {
      throw new NotFoundException('file not found');
    }
    file.filename = filename;
    return await this.repo.save(file);
  }

  async delete(id: number) {
    const file = await this.repo.findOneBy({ id });

    if (!file) {
      throw new NotFoundException('file not found');
    }

    return this.repo.remove(file);
  }
}
