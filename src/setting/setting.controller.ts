import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { SettingService } from './setting.service';
import {
  CreateNgCaseDto,
  UpdateNgCaseDto,
  CreateCultivarDto,
  UpdateCultivarDto,
} from './dto';

@Controller('setting')
export class SettingController {
  constructor(private readonly settingService: SettingService) { }

  //! NG Case -------------------------------------------------------------------------
  @Post('ng-case')
  createNgCase(@Body() createNgCaseDto: CreateNgCaseDto) {
    return this.settingService.createNgCase(createNgCaseDto);
  }

  @Get('ng-case')
  getNgCases() {
    return this.settingService.getNgCases();
  }

  @Put('ng-case')
  updateNgCase(@Body() updateNgCaseDto: UpdateNgCaseDto) {
    return this.settingService.updateNgCase(updateNgCaseDto);
  }

  // @Delete('ng-case/:case_id')
  // deleteNgCase(@Param('case_id') case_id: string) {
  //   return this.settingService.deleteNgCase(case_id);
  // }

  //! Soil Types -------------------------------------------------------------------------
  @Get('soil-types')
  getSoilTypes() {
    return this.settingService.getSoilTypes();
  }

  //! Cultivar -------------------------------------------------------------------------
  @Post('cultivar')
  createCultivar(@Body() createCultivarDto: CreateCultivarDto) {
    return this.settingService.createCultivar(createCultivarDto);
  }

  @Get('cultivar')
  getCultivars() {
    return this.settingService.getCultivars();
  }

  @Put('cultivar')
  updateCultivar(@Body() updateCultivarDto: UpdateCultivarDto) {
    return this.settingService.updateCultivar(updateCultivarDto);
  }

  @Delete('cultivar/:cultivar_id')
  deleteCultivar(@Param('cultivar_id') cultivar_id: string) {
    return this.settingService.deleteCultivar(cultivar_id);
  }
}