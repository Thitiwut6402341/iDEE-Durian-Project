import { Module } from '@nestjs/common';
import { ReserveTransportationService } from './reserve-transportation.service';
import { ReserveTransportationController } from './reserve-transportation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReserveTransportation, ReserveTransportationSchema } from 'src/schema/reserve-transportation/register-reserve.schema';
import { TradeMarkSetting, TradeMarkSettingSchema } from 'src/schema/trade-mark-setting/create-trademark.schema';
import {
  OrchardRegister,
  OrchardRegisterSchema,
} from 'src/schema/orchard/orchard-register.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ReserveTransportation.name,
        schema: ReserveTransportationSchema,
      },
      {
        name: TradeMarkSetting.name,
        schema: TradeMarkSettingSchema,
      },
      {
        name: OrchardRegister.name,
        schema: OrchardRegisterSchema
      },

    ])
  ],
  controllers: [ReserveTransportationController],
  providers: [ReserveTransportationService],
})
export class ReserveTransformationModule { }
