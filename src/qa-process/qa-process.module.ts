import { Module } from '@nestjs/common';
import { QaProcessService } from './qa-process.service';
import { QaProcessController } from './qa-process.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrchardRegister, OrchardRegisterSchema } from 'src/schema/orchard-registration.schema';
import { PackingHouseRegister, PackingHouseRegisterSchema } from 'src/schema/packing-house-registration.schema';
import { DMPercentage, DMPercentageSchema } from 'src/schema/dm-percentage.schema';
import { ReserveTransportation, ReserveTransportationSchema } from 'src/schema/reserve-transportation/register-reserve.schema';
import { Container, ContainerSchema } from 'src/schema/container.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {name: OrchardRegister.name, schema: OrchardRegisterSchema}, 
      {name: PackingHouseRegister.name, schema: PackingHouseRegisterSchema},
      {name: DMPercentage.name, schema: DMPercentageSchema},
      {name: ReserveTransportation.name, schema: ReserveTransportationSchema},
      {name: Container.name, schema: ContainerSchema}
    ])
  ],
  controllers: [QaProcessController],
  providers: [QaProcessService],
})
export class QaProcessModule {}
