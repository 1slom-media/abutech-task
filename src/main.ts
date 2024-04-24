import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { CourseModule } from './course/course.module';
import { UploadModule } from './upload/upload.module';
// import * as cookieParser from 'cookie-parser';
import { UsersModule } from './users/users.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001',
      'http://localhost:5173',
    ],
    credentials: true,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Content-Type',
      'X-Requested-With',
      'apollo-require-preflight',
    ],
    methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  });
  // app.use(cookieParser());
  const options = new DocumentBuilder()
    .setTitle('swagger api documentation')
    .setDescription('The  API description')
    .setVersion('1.0')
    .build();
  const Document = SwaggerModule.createDocument(app, options, {
    include: [UsersModule,CourseModule,UploadModule],
  });
  SwaggerModule.setup('api', app, Document);
  await app.listen(3000);
}
bootstrap();
