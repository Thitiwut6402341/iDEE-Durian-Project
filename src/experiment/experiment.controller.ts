import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ValidationPipe,
} from '@nestjs/common';
import { ExperimentService } from './experiment.service';
import { UploadPictureDto } from './dto/upload-picture.dto';

@Controller('experiment')
export class ExperimentController {
  constructor(private readonly experimentService: ExperimentService) {}

  @Post()
  create(@Body() data: any) {
    return this.experimentService.create(data);
  }

  @Post('many')
  creates(@Body() data: any[]) {
    return this.experimentService.creates(data);
  }

  @Get()
  async findAll() {
    return this.experimentService.findAll();
  }

  @Put()
  async update(@Body() dataUpdate: any) {
    return this.experimentService.update(dataUpdate);
  }

  @Put('many')
  async updateMany(@Body() dataUpdate: any[]) {
    return this.experimentService.updateMany(dataUpdate);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.experimentService.delete(id);
  }

  @Post('upload-picture')
  async uploadPicture(
    @Body(new ValidationPipe()) uploadPictureDto: UploadPictureDto,
  ) {
    return this.experimentService.uploadPicture(uploadPictureDto);
  }
}
