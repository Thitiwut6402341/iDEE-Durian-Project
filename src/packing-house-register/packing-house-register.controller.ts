import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  ValidationPipe,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { PackingHouseRegisterService } from './packing-house-register.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { Request, Response } from 'express';

import {
  PackingHouseRegisterDto,
  EditPackingHouseRegisterDto,
  PackingHouseInfoDto,
} from './dto';

@Controller('packing-house-register')
export class PackingHouseRegisterController {
  constructor(
    private readonly packingHouseRegisterService: PackingHouseRegisterService,
  ) {}

  @Get('all-packing-house')
  async findAll(@Res() res: Response) {
    // return this.packingHouseRegisterService.findAll();
    const result = await this.packingHouseRegisterService.findAll();
    return res.status(result.statusCode).json(result);
  }

  @Post('register')
  async createPackingHouse(
    @Body(new ValidationPipe())
    packingHouseRegisterDto: PackingHouseRegisterDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return await this.packingHouseRegisterService.createPackingHouse(
    //   packingHouseRegisterDto,
    //   req.decoded,
    // );
    const result = await this.packingHouseRegisterService.createPackingHouse(
      packingHouseRegisterDto,
      req.decoded,
    );
    return res.status(result.statusCode).json(result);
  }

  @Put('edit-info')
  async editPackingHouseInfo(
    @Body(new ValidationPipe())
    editPackingHouseRegisterDto: EditPackingHouseRegisterDto,
    @Res() res: Response,
  ) {
    // return await this.packingHouseRegisterService.editPackingHouseInfo(
    //   editPackingHouseRegisterDto,
    // );
    const result = await this.packingHouseRegisterService.editPackingHouseInfo(
      editPackingHouseRegisterDto,
    );
    return res.status(result.statusCode).json(result);
  }

  @Post('packing-house-info')
  async getPackingHouseInfo(
    @Body(new ValidationPipe()) packingHouseInfoDto: PackingHouseInfoDto,
    @Res() res: Response,
  ) {
    // return await this.packingHouseRegisterService.getPackingHouseInfo(
    //   packingHouseInfoDto,
    // );
    const result =
      await this.packingHouseRegisterService.getPackingHouseInfo(
        packingHouseInfoDto,
      );
    return res.status(result.statusCode).json(result);
  }

  @Delete('delete-packing-house')
  async deletePackingHouse(
    @Query('packing_house_code') packingHouseCode: string,
    @Res() res: Response,
  ) {
    // return this.packingHouseRegisterService.deletePackingHouse(
    //   packingHouseCode,
    // );
    const result =
      await this.packingHouseRegisterService.deletePackingHouse(
        packingHouseCode,
      );
    return res.status(result.statusCode).json(result);
  }
}
