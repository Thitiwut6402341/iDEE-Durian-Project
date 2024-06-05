import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Cultivar,
  CultivarSchema,
  NgCase,
  NgCaseSchema,
  SoilTypes,
  SoilTypesSchema,
} from 'src/schema/setting-schemas';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NgCase.name,
        schema: NgCaseSchema,
      },
      {
        name: SoilTypes.name,
        schema: SoilTypesSchema,
      },
      {
        name: Cultivar.name,
        schema: CultivarSchema,
      },

    ]),
  ],
  controllers: [SettingController],
  providers: [SettingService],
})
export class SettingModule { }
