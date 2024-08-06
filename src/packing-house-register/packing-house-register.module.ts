import { Module } from '@nestjs/common';
import { PackingHouseRegisterService } from './packing-house-register.service';
import { PackingHouseRegisterController } from './packing-house-register.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  OrchardRegister,
  OrchardRegisterSchema,
} from 'src/schema/orchard/orchard-register.schema';

import {
  PackingHouseRegister,
  PackingHouseRegisterSchema,
} from 'src/schema/packinghouse/packing-house-register.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrchardRegister.name, schema: OrchardRegisterSchema },
      { name: PackingHouseRegister.name, schema: PackingHouseRegisterSchema },
    ]),
  ],
  controllers: [PackingHouseRegisterController],
  providers: [PackingHouseRegisterService],
})
export class PackingHouseRegisterModule { }
