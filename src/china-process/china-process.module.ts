import { Module } from '@nestjs/common';
import { ChinaProcessService } from './china-process.service';
import { ChinaProcessController } from './china-process.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ChinaLoadInProcess,
  ChinaLoadInProcessSchema,
} from 'src/schema/china-process/loadin-process.schema';
import {
  WeightingsProcess,
  WeightingsProcessSchema,
} from 'src/schema/packing-schemas';
import {
  ChinaStoreProcess,
  ChinaStoreProcessSchema,
} from 'src/schema/china-process/store-process.schema';
import {
  Transportation,
  TransportationSchema,
} from 'src/schema/transportation.schema';
import {
  ChinaRePackingProcess,
  ChinaRePackingProcessSchema,
} from 'src/schema/china-process/re-packing-process.schema';
import {
  ChinaDeliveryProcess,
  ChinaDeliveryProcessSchema,
} from 'src/schema/china-process/delivery-process.schema';
import {
  ChinaLoadOutStoreProcess,
  ChinaLoadOutStoreProcessSchema,
} from 'src/schema/china-process/load-out-store-process.schema';

import {
  DurianRegistration,
  DurianRegistrationSchema,
} from 'src/schema/durian-register';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChinaLoadInProcess.name,
        schema: ChinaLoadInProcessSchema,
      },
      {
        name: WeightingsProcess.name,
        schema: WeightingsProcessSchema,
      },
      {
        name: ChinaStoreProcess.name,
        schema: ChinaStoreProcessSchema,
      },
      {
        name: ChinaLoadOutStoreProcess.name,
        schema: ChinaLoadOutStoreProcessSchema,
      },
      {
        name: ChinaRePackingProcess.name,
        schema: ChinaRePackingProcessSchema,
      },
      {
        name: Transportation.name,
        schema: TransportationSchema,
      },
      {
        name: ChinaDeliveryProcess.name,
        schema: ChinaDeliveryProcessSchema,
      },
      {
        name: DurianRegistration.name,
        schema: DurianRegistrationSchema,
      },
    ]),
  ],

  controllers: [ChinaProcessController],
  providers: [ChinaProcessService],
})
export class ChinaProcessModule {}
