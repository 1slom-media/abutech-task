import { MiddlewareConsumer, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UploadModule } from './upload/upload.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesEntity } from './upload/upload.entity';
import { CourseModule } from './course/course.module';
import { CourseEntity } from './course/course.entity';
import { UsersModule } from './users/users.module';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisOptions } from './utils/redis';
import { UsersEntity } from './users/users.entity';
import { UserCourseModule } from './user-course/user-course.module';
const cookieSession = require('cookie-session');

@Module({
  imports: [
    // env file settings
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    // redis-cache settings
    CacheModule.registerAsync(RedisOptions),
    // database settings
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          type: 'postgres',
          port: config.get<number>('PG_PORT'),
          username: config.get<string>('PG_USER'),
          host: config.get<string>('PG_HOST'),
          database: config.get<string>('PG_DATABASE'),
          password: config.get<string>('PG_PASSWORD'),
          entities: [FilesEntity, CourseEntity,UsersEntity],
          synchronize: true,
        };
      },
    }),
    UploadModule,
    CourseModule,
    UsersModule,
    UserCourseModule,
  ],
  controllers: [AppController],
  providers: [
    AppService
  ],
})
export class AppModule {
  constructor(private configService:ConfigService){}
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(cookieSession({
      keys: [this.configService.get("COOKIE_KEY")]
    })).forRoutes("*");
  }
}
