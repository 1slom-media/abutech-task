import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { FileDto } from './dtos/create';
import { ApiBody, ApiConsumes, ApiQuery, ApiTags } from '@nestjs/swagger';
import { QueryDto } from './dtos/query';

@ApiTags('files')
@Controller()
export class UploadController {
  constructor(private uploadService: UploadService) {}

  @Get('files')
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  findAll(@Query() query: QueryDto) {
    return this.uploadService.find(parseInt(query.skip), parseInt(query.take));
  }

  @Post('uploads')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        filename: { type: 'string' },
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @Body() body: FileDto) {
    return this.uploadService.uploadFile(file, body.filename);
  }

  @Patch('file/:id')
  updateFile(@Param('id') id: string, @Body() body: FileDto) {
    return this.uploadService.update(parseInt(id), body.filename);
  }

  @Delete('file/:id')
  removeFile(@Param('id') id: string) {
    return this.uploadService.delete(parseInt(id));
  }
}
