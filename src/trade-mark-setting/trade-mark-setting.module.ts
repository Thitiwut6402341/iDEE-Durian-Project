import { Module } from '@nestjs/common';
import { TradeMarkSettingService } from './trade-mark-setting.service';
import { TradeMarkSettingController } from './trade-mark-setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TradeMarkSetting, TradeMarkSettingSchema } from 'src/schema/trade-mark-setting/create-trademark.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: TradeMarkSetting.name, schema: TradeMarkSettingSchema },
    ]),
  ],
  controllers: [TradeMarkSettingController],
  providers: [TradeMarkSettingService],
})
export class TradeMarkSettingModule { }
