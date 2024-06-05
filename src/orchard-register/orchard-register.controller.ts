import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  ValidationPipe,
  Req,
  Delete,
  Query,
  Request,
} from '@nestjs/common';
import { OrchardRegisterService } from './orchard-register.service';
import { CreateOrchardRegisterDto } from './dto/create-orchard-register.dto';
import { OrchardInfoDto } from './dto/orchard-info.dto';
import { EditOrchardInfoDto } from './dto/edit-orchard-info.dto';
import { TJwtPayload } from 'src/types/jwt-payload';

@Controller('orchard-register')
export class OrchardRegisterController {
  constructor(
    private readonly orchardRegisterService: OrchardRegisterService,
  ) { }

  @Get('get-datacollection')
  async getDataCollection() {
    return this.orchardRegisterService.getDataCollection();
  }

  @Post('register')
  async OrchardRegister(
    @Body() createOrchardRegisterDto: CreateOrchardRegisterDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return await this.orchardRegisterService.OrchardRegister(
      createOrchardRegisterDto,
      decoded,
    );
  }

  @Get('all-orchard')
  async findAll() {
    return this.orchardRegisterService.findAll();
  }

  @Get('all-id')
  async findID() {
    return this.orchardRegisterService.findID();
  }

  @Post('orchard-info')
  async getOrchardInformation(
    @Body(new ValidationPipe()) orchardInfoDto: OrchardInfoDto,
  ) {
    return this.orchardRegisterService.getOrchardInformation(orchardInfoDto);
  }

  @Put('edit-info')
  async editInformation96(
    @Body(new ValidationPipe()) editOrchardInfoDto: EditOrchardInfoDto,
    @Request() req: any,

  ) {
    const { decoded } = req;
    return this.orchardRegisterService.editInformation(editOrchardInfoDto, decoded);
  }

  @Delete('delete-orchard')
  async deleteOrchard(@Query('orchard_code') orchardCode: string) {
    return this.orchardRegisterService.deleteOrchard(orchardCode);
  }
}
