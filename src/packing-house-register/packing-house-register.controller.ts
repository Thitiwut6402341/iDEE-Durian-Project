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
} from '@nestjs/common';
import { PackingHouseRegisterService } from './packing-house-register.service';
import { PackingHouseRegisterDto } from './dto/packing-house-register.dto';
import { EditPackingHouseRegisterDto } from './dto/edit-packing-house-info.dto';
import { PackingHouseInfoDto } from './dto/packing-house-info.dto';
import { TJwtPayload } from 'src/types/jwt-payload';
@Controller('packing-house-register')
export class PackingHouseRegisterController {
  constructor(
    private readonly packingHouseRegisterService: PackingHouseRegisterService,
  ) {}

  @Get('all-packing-house')
  async findAll() {
    return this.packingHouseRegisterService.findAll();
  }

  @Post('register')
  async PackingHouseRegister(
    @Body(new ValidationPipe())
    packingHouseRegisterDto: PackingHouseRegisterDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return await this.packingHouseRegisterService.PackingHouseRegister(
      packingHouseRegisterDto,
      req.decoded,
    );
  }

  @Put('edit-info')
  async editPackingHouseInfo(
    @Body(new ValidationPipe())
    editPackingHouseRegisterDto: EditPackingHouseRegisterDto,
  ) {
    return await this.packingHouseRegisterService.editPackingHouseInfo(
      editPackingHouseRegisterDto,
    );
  }

  @Post('packing-house-info')
  async getPackingHouseInfo(
    @Body(new ValidationPipe()) packingHouseInfoDto: PackingHouseInfoDto,
  ) {
    return await this.packingHouseRegisterService.getPackingHouseInfo(
      packingHouseInfoDto,
    );
  }

  @Delete('delete-packing-house')
  async deletePackingHouse(
    @Query('packing_house_code') packingHouseCode: string,
  ) {
    return this.packingHouseRegisterService.deletePackingHouse(
      packingHouseCode,
    );
  }
}
