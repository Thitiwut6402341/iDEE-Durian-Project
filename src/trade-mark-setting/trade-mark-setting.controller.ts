import { Body, Controller, Delete, Get, Post, Put, Query, Req } from '@nestjs/common';
import { TradeMarkSettingService } from './trade-mark-setting.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { CreateTradeMarkDto } from './dto/create-trademark.dto';
import { UpdateTradeMarkDto } from './dto/update-trademark.dto';

@Controller('trademark-setting')
export class TradeMarkSettingController {
  constructor(private readonly tradeMarkSettingService: TradeMarkSettingService) { }

  @Post('upload')
  async uploadTradeMark(
    @Body() createTradeMarkDto: CreateTradeMarkDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.tradeMarkSettingService.uploadTradeMark(createTradeMarkDto, req.decoded);
  }

  @Get('all-trademark')
  async getTradeMark() {
    return this.tradeMarkSettingService.getTradeMark();
  }

  @Delete('delete')
  async deleteTradeMark(@Query('trademark_id') trademark_id: string) {
    return this.tradeMarkSettingService.deleteTradeMark(trademark_id);
  }

  @Put('update')
  async updateTradeMark(@Body() updateTradeMarkDto: UpdateTradeMarkDto) {
    return this.tradeMarkSettingService.updateTradeMark(updateTradeMarkDto);
  }


}
