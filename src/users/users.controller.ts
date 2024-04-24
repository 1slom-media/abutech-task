import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateUserDto, LoginDto, UserDto } from './dtos/user';
import { Request, Response } from 'express';
import { AuthGuard } from '../Guards/auth.guard';
import { CurrentUser } from './decorators/current-user';
import { UsersEntity } from './users.entity';
import { CurrentUserInterceptor } from './interceptor/current-user';
import { UsersService } from './users.service';
import { Serialize } from '../interceptors/serialize.interceptor';

@ApiTags('users')
@Controller('')
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private authservice: AuthService,
    private userService: UsersService,
  ) {}

  @Get('users')
  @Serialize(UserDto)
  findAll() {
    return this.userService.findAll();
  }

  @Get('user/:id')
  @Serialize(UserDto)
  findOne(@Param('id') id: string) {
    return this.userService.findOne(parseInt(id));
  }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmi(@CurrentUser() user: UsersEntity) {
    return user;
  }

  @Post('register')
  async register(
    @Body() body: CreateUserDto,
    @Res() res: Response,
    @Session() session: any,
  ) {
    const user = await this.authservice.register(body, res);
    session.userId = user.id;
    return res.json({
      message: 'user created',
      user: user,
    });
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Res() res: Response,
    @Session() session: any,
  ) {
    const user = await this.authservice.login(body, res);
    session.userId = user.id;
    return res.json({
      message: 'login success',
      user: user,
    });
  }

  @Post('logout')
  async logout(@Res() res: Response, @Session() session: any) {
    session.userId = null;
    const log = await this.authservice.logout(res);
    return res.json({
      message: 'user logout',
    });
  }

  @Post('refresh-token')
  async refreshToken(@Res() res: Response, @Req() req: Request) {
    try {
      return this.authservice.refreshToken(req, res);
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Patch('user/:id')
  updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.userService.updateProfile(parseInt(id), body);
  }
}
