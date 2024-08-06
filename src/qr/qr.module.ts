import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { Qr, QrSchema } from './schemas/qr.schema';
import {
  DurianRegister,
  DurianRegisterSchema,
} from './schema/durian-register.schema';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';

import { QrMokup, QrMokupSchema } from 'src/qr/schema/qrmokup.schema';
import {
  ChinaRePackingProcess,
  ChinaRePackingProcessSchema,
} from 'src/schema/china-process/re-packing-process.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: DurianRegister.name,
        schema: DurianRegisterSchema,
      },
      {
        name: QrMokup.name,
        schema: QrMokupSchema,
      },
      {
        name: ChinaRePackingProcess.name,
        schema: ChinaRePackingProcessSchema,
      },
    ]),
  ],
  controllers: [QrController],
  providers: [QrService],
})
export class QrModule {}
