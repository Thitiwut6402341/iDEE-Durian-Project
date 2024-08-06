import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { SettingService } from './setting.service';
import {
  CreateNgCaseDto,
  UpdateNgCaseDto,
  CreateCultivarDto,
  UpdateCultivarDto,
} from './dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) {}

  //! NG Case -------------------------------------------------------------------------
  @Post('ng-case')
  async createNgCase(
    @Body() createNgCaseDto: CreateNgCaseDto,
    @Res() res: Response,
  ) {
    // return this.settingService.createNgCase(createNgCaseDto);
    const result = await this.settingService.createNgCase(createNgCaseDto);
    return res.status(result.statusCode).json(result);
  }

  @Get('ng-case')
  async getNgCases(@Res() res: Response) {
    // return this.settingService.getNgCases();
    const result = await this.settingService.getNgCases();
    return res.status(result.statusCode).json(result);
  }

  @Put('ng-case')
  async updateNgCase(
    @Body() updateNgCaseDto: UpdateNgCaseDto,
    @Res() res: Response,
  ) {
    // return this.settingService.updateNgCase(updateNgCaseDto);
    const result = await this.settingService.updateNgCase(updateNgCaseDto);
    return res.status(result.statusCode).json(result);
  }

  @Delete('ng-case/:case_id')
  async deleteNgCase(@Param('case_id') case_id: string, @Res() res: Response) {
    // return this.settingService.deleteNgCase(case_id);
    const result = await this.settingService.deleteNgCase(case_id);
    return res.status(result.statusCode).json(result);
  }

  //! Soil Types -------------------------------------------------------------------------
  @Get('soil-types')
  async getSoilTypes(@Res() res: Response) {
    // return this.settingService.getSoilTypes();
    const result = await this.settingService.getSoilTypes();
    return res.status(result.statusCode).json(result);
  }

  //! Cultivar -------------------------------------------------------------------------
  @Post('cultivar')
  async createCultivar(
    @Body() createCultivarDto: CreateCultivarDto,
    @Res() res: Response,
  ) {
    // return this.settingService.createCultivar(createCultivarDto);
    const result = await this.settingService.createCultivar(createCultivarDto);
    return res.status(result.statusCode).json(result);
  }

  @Get('cultivar')
  async getCultivars(@Res() res: Response) {
    // return this.settingService.getCultivars();
    const result = await this.settingService.getCultivars();
    return res.status(result.statusCode).json(result);
  }

  @Put('cultivar')
  async updateCultivar(
    @Body() updateCultivarDto: UpdateCultivarDto,
    @Res() res: Response,
  ) {
    // return this.settingService.updateCultivar(updateCultivarDto);
    const result = await this.settingService.updateCultivar(updateCultivarDto);
    return res.status(result.statusCode).json(result);
  }

  @Delete('cultivar/:cultivar_id')
  async deleteCultivar(
    @Param('cultivar_id') cultivar_id: string,
    @Res() res: Response,
  ) {
    // return this.settingService.deleteCultivar(cultivar_id);
    const result = await this.settingService.deleteCultivar(cultivar_id);
    return res.status(result.statusCode).json(result);
  }
}
