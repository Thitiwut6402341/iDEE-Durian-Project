import { Injectable, BadRequestException } from '@nestjs/common';
import {
  LoginDto,
  ChangePasswordDto,
  CreateUserDto,
  ResetPasswordDto,
} from './dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { TJwtPayload } from 'src/types/jwt-payload';
import { config } from 'src/common/config/config';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private UserModel: Model<UserDocument>,
  ) { }

  async login(loginDto: LoginDto) {
    // return loginDto;
    try {
      // console.log(process.env.JWT_SECRET);
      const user = await this.UserModel.findOne(
        {
          email: loginDto.email,
        },
        {
          // _id: 0,
          // user_id: { $toString: '$_id' },
          email: 1,
          name: 1,
          role: 1,
          password: 1,
        },
      );

      if (!user)
        throw new BadRequestException(
          'There is no user with this email address',
        );

      // const userWithUserId = user as User & { user_id: string };

      const isMatched = await bcrypt.compare(loginDto.password, user.password);

      if (!isMatched)
        throw new BadRequestException(
          'Password is incorrect, please try again',
        );

      //? generate token
      const payload: TJwtPayload = {
        user_id: user._id,
        email: user.email,
        role: 'admin',
      };

      const token = jwt.sign(payload, config.JWT_SECRET, {
        expiresIn: '1d',
      });

      return {
        status: 'success',
        message: 'Login successfully',
        data: [
          {
            user_id: user._id,
            email: user.email,
            name: user.name,
            role: user.role,
            token,
          },
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async createUser(createUserDto: CreateUserDto) {
    // return createUserDto;
    try {
      const checkUser = await this.UserModel.findOne({
        email: createUserDto.email,
      });

      if (checkUser) throw new BadRequestException('User already exists');

      const user = new this.UserModel(createUserDto);
      const saltRounds = 10;
      const hash = await bcrypt.hash(createUserDto.password, saltRounds);
      user.password = hash;
      user.save();

      return {
        status: 'success',
        message: 'User created successfully',
        data: [user],
      };
    } catch (error) {
      // console.log(error);
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    decoded: TJwtPayload,
  ) {
    // console.log(decoded);
    // return changePasswordDto;
    try {
      if (changePasswordDto.old_password === changePasswordDto.new_password)
        throw new BadRequestException(
          'Old password and new password cannot be the same',
        );

      const user = await this.UserModel.findOne(
        {
          email: decoded.email,
        },
        { _id: 0, user_id: { $toString: '$_id' }, email: 1, password: 1 },
      );

      if (!user)
        throw new BadRequestException(
          'There is no user with this email address',
        );

      const isMatched = await bcrypt.compare(
        changePasswordDto.old_password,
        user.password,
      );

      if (!isMatched)
        throw new BadRequestException(
          'Password is incorrect, please try again',
        );

      const saltRounds = 10;
      const hash = await bcrypt.hash(
        changePasswordDto.new_password,
        saltRounds,
      );

      const modified = await this.UserModel.updateOne(
        {
          email: decoded.email,
        },
        {
          password: hash,
        },
      );

      return {
        status: 'success',
        message: 'Password changed successfully',
        data: [{ modified }],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto) {
    // return resetPasswordDto;
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash('0000', saltRounds);

      const modified = await this.UserModel.updateOne(
        {
          email: resetPasswordDto.email,
        },
        {
          password: hash,
        },
      );

      return {
        status: 'success',
        message: 'Password reset successfully',
        data: [{ modified }],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async generatePassword(password: string) {
    // return password;
    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(password, saltRounds);

      return {
        status: 'success',
        message: 'Password generated successfully',
        data: [{ password: hash }],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }
}
