import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ContainerService } from './container.service';
import { ContainerSendDto, UpdateContainerDto } from './dto';
import { Response } from 'express';

@Controller('container')
export class ContainerController {
  constructor(private readonly containerService: ContainerService) {}

  @Post('create-container')
  async createContainer(
    @Body() ContainerSendDto: ContainerSendDto,
    @Res() res: Response,
  ) {
    // return this.containerService.createContainer(ContainerSendDto);
    const result =
      await this.containerService.createContainer(ContainerSendDto);
    return res.status(result.statusCode).json(result);
  }

  @Get('get-all-container')
  async findContainerAll(@Res() res: Response) {
    // return this.containerService.findContainerAll();
    const result = await this.containerService.findContainerAll();
    return res.status(result.statusCode).json(result);
  }

  @Put('update-container')
  async updateContainer(
    @Body() updateContainerDto: UpdateContainerDto,
    @Res() res: Response,
  ) {
    // return this.containerService.updateContainer(
    //   transport_id,
    //   updateContainerDto,
    // );
    const result =
      await this.containerService.updateContainer(updateContainerDto);
    return res.status(result.statusCode).json(result);
  }

  @Delete('delete-container')
  deleteContainer(@Query('container_id') container_id: string) {
    return this.containerService.deleteContainer(container_id);
  }
}
