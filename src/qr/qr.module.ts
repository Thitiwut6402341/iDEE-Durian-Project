import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
// import { Qr, QrSchema } from './schemas/qr.schema';
import { DurianRegister, DurianRegisterSchema } from './schema/durian-register.schema';
import { QrService } from './qr.service';
import { QrController } from './qr.controller';

import { QrMokup, QrMokupSchema } from 'src/qr/schema/qrmokup.schema';

  @Module({
    imports: [
    MongooseModule.forFeature([
      { 
        name: DurianRegister.name, 
        schema: DurianRegisterSchema 
      },
      { 
        name: QrMokup.name, 
        schema: QrMokupSchema 
      },
    ])],
    controllers: [QrController],
    providers: [QrService],    
})

export class QrModule  {}


