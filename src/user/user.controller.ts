import { Controller, Get, Post, Patch, Param, Body, Req } from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginDto,
  ChangePasswordDto,
  CreateUserDto,
  ResetPasswordDto,
} from './dto';
import { Request } from 'express';
import { TJwtPayload } from 'src/types/jwt-payload';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.userService.login(loginDto);
  }

  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch('change-password')
  changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.userService.changePassword(changePasswordDto, req.decoded);
  }

  @Patch('reset-password')
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Get('gen-pass/:password')
  generatePassword(@Param('password') password: string) {
    return this.userService.generatePassword(password);
  }
}
