import { Module } from '@nestjs/common';
import { PackingService } from './packing.service';
import { PackingController } from './packing.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChemicalProcess1,
  ChemicalProcess1Schema,
  ChemicalProcess2,
  ChemicalProcess2Schema,
  ChemicalProcess3,
  ChemicalProcess3Schema,
  CountSegmentsProcess,
  CountSegmentsProcessSchema,
  WeightingsProcess,
  WeightingsProcessSchema,
  FreezerProcess,
  FreezerProcessSchema,
  PackingProcess,
  PackingProcessSchema,
  Transportation,
  TransportationSchema,

} from 'src/schema/packing-schemas';
import {
  DurianRegistration,
  DurianRegistrationSchema,
} from 'src/schema/durian-register';

import { GradeSettingModule } from 'src/grade-setting/grade-setting.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChemicalProcess1.name,
        schema: ChemicalProcess1Schema,
      },
      {
        name: ChemicalProcess2.name,
        schema: ChemicalProcess2Schema,
      },
      {
        name: ChemicalProcess3.name,
        schema: ChemicalProcess3Schema,
      },
      {
        name: CountSegmentsProcess.name,
        schema: CountSegmentsProcessSchema,
      },
      {
        name: WeightingsProcess.name,
        schema: WeightingsProcessSchema,
      },
      {
        name: PackingProcess.name,
        schema: PackingProcessSchema,
      },
      {
        name: FreezerProcess.name,
        schema: FreezerProcessSchema,
      },
      {
        name: DurianRegistration.name,
        schema: DurianRegistrationSchema,
      },
      {
        name: Transportation.name,
        schema: TransportationSchema,
      },

    ]),
    GradeSettingModule,
  ],
  controllers: [PackingController],
  providers: [PackingService],
})
export class PackingModule { }
