import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Req,
  Res,
  Delete,
  Query,
} from '@nestjs/common';
import { OrchardRegisterService } from './orchard-register.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { Request, Response } from 'express';

import {
  CreateOrchardRegisterDto,
  OrchardInfoDto,
  EditOrchardInfoDto,
} from './dto';

@Controller('orchard-register')
export class OrchardRegisterController {
  constructor(
    private readonly orchardRegisterService: OrchardRegisterService,
  ) {}

  @Get('get-datacollection')
  async getDataCollection(@Res() res: Response) {
    // return this.orchardRegisterService.getDataCollection();
    const result = await this.orchardRegisterService.getDataCollection();
    return res.status(res.statusCode).json(result);
  }

  @Get('iot-devices')
  async findAllDevices(@Res() res: Response) {
    // return this.orchardRegisterService.getDataCollection();
    const result = await this.orchardRegisterService.findAllDevices();
    return res.status(res.statusCode).json(result);
  }

  @Post('register')
  async OrchardRegister(
    @Body() createOrchardRegisterDto: CreateOrchardRegisterDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return await this.orchardRegisterService.createOrchardRegister(
    //   createOrchardRegisterDto,
    //   req.decoded,
    // );
    const result = await this.orchardRegisterService.createOrchardRegister(
      createOrchardRegisterDto,
      req.decoded,
    );
    return res.status(res.statusCode).json(result);
  }

  @Get('all-orchard')
  async findAll(@Res() res: Response) {
    // return this.orchardRegisterService.findAll();
    const result = await this.orchardRegisterService.findAll();
    return res.status(res.statusCode).json(result);
  }

  @Get('all-id')
  async findID(@Res() res: Response) {
    // return this.orchardRegisterService.findID();
    const result = await this.orchardRegisterService.findID();
    return res.status(res.statusCode).json(result);
  }

  @Post('orchard-info')
  async getOrchardInformation(
    @Body() orchardInfoDto: OrchardInfoDto,
    @Res() res: Response,
  ) {
    // return this.orchardRegisterService.getOrchardInformation(orchardInfoDto);
    const result =
      await this.orchardRegisterService.getOrchardInformation(orchardInfoDto);
    return res.status(res.statusCode).json(result);
  }

  @Put('edit-info')
  async editInformation96(
    @Body() editOrchardInfoDto: EditOrchardInfoDto,
    // @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.orchardRegisterService.editInformation(
    //   editOrchardInfoDto,
    //   req.decoded,
    // );
    const result =
      await this.orchardRegisterService.editInformation(editOrchardInfoDto);
    return res.status(res.statusCode).json(result);
  }

  @Delete('delete-orchard')
  async deleteOrchard(
    @Query('orchard_code') orchardCode: string,
    @Res() res: Response,
  ) {
    // return this.orchardRegisterService.deleteOrchard(orchardCode);
    const result = await this.orchardRegisterService.deleteOrchard(orchardCode);
    return res.status(res.statusCode).json(result);
  }
}
