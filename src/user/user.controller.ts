import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Req,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  LoginDto,
  ChangePasswordDto,
  CreateUserDto,
  ResetPasswordDto,
} from './dto';
import { TJwtPayload } from 'src/types/jwt-payload';
import { Request, Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    // return this.userService.login(loginDto);
    const result = await this.userService.login(loginDto);
    return res.status(res.statusCode).json(result);
  }

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    // return this.userService.createUser(createUserDto);
    const result = await this.userService.createUser(createUserDto);
    return res.status(res.statusCode).json(result);
  }

  @Patch('change-password')
  async changePassword(
    @Body() changePasswordDto: ChangePasswordDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.userService.changePassword(changePasswordDto, req.decoded);
    const result = await this.userService.changePassword(
      changePasswordDto,
      req.decoded,
    );
    return res.status(res.statusCode).json(result);
  }

  @Patch('reset-password')
  async resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @Res() res: Response,
  ) {
    // return this.userService.resetPassword(resetPasswordDto);
    const result = await this.userService.resetPassword(resetPasswordDto);
    return res.status(res.statusCode).json(result);
  }

  @Get('gen-pass/:password')
  async generatePassword(
    @Param('password') password: string,
    @Res() res: Response,
  ) {
    // return this.userService.generatePassword(password);
    const result = await this.userService.generatePassword(password);
    return res.status(res.statusCode).json(result);
  }
}
