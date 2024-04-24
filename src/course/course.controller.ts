import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { CourseService } from './course.service';
import { QueryDto } from './dtos/query';
import { CourseDto } from './dtos/course';

@ApiTags('courses')
@Controller()
export class CourseController {
  constructor(private courseService: CourseService) {}

  @Get('courses')
  @ApiQuery({ name: 'take', required: false })
  @ApiQuery({ name: 'skip', required: false })
  findAll(@Query() query: QueryDto) {
    return this.courseService.find(parseInt(query?.skip), parseInt(query?.take));
  }

  @Get('course/:id')
  async getOne(@Param('id') id: string) {
    const course = await this.courseService.findOne(parseInt(id));
    if (!course) {
      throw new NotFoundException('course not found');
    }
    return course;
  }

  @Post('course')
  cretaeCourse(@Body() body: CourseDto) {
    return this.courseService.create(body);
  }

  @Patch('course/:id')
  updateCourse(@Param('id') id: string, @Body() body: CourseDto) {
    return this.courseService.update(parseInt(id), body);
  }

  @Delete('course/:id')
  removeCourse(@Param('id') id: string) {
    return this.courseService.delete(parseInt(id));
  }
}
