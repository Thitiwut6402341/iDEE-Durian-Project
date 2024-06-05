import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Put,
  Res,
} from '@nestjs/common';
import { RawdataService } from './rawdata.service';
import { InsertRawDataDto } from './dto/insert-rawdata.dto';
import { UploadPictureDto } from './dto/upload-picture.dto';
import { Response } from 'express';
import * as path from 'path';
import { UpdateRawDataDto } from './dto/update-rawdata.dto';

@Controller('raw-data')
export class RawdataController {
  constructor(private readonly rawdataService: RawdataService) {}

  @Post('insert')
  async insertRawData(
    @Body(new ValidationPipe()) insertRawDataDto: InsertRawDataDto,
  ) {
    return this.rawdataService.insertRawData(insertRawDataDto);
  }

  @Put('update')
  async updateRawData(
    @Body(new ValidationPipe()) updateRawDataDto: UpdateRawDataDto,
  ) {
    return this.rawdataService.updateRawData(updateRawDataDto);
  }

  @Get('get-all')
  async getAllRawData() {
    return this.rawdataService.getAllRawData();
  }

  @Post('upload-picture')
  async uploadPicture(
    @Body(new ValidationPipe()) uploadPictureDto: UploadPictureDto,
  ) {
    return this.rawdataService.uploadPicture(uploadPictureDto);
  }
}
