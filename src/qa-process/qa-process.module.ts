import { Module } from '@nestjs/common';
import { QaProcessService } from './qa-process.service';
import { QaProcessController } from './qa-process.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrchardRegister, OrchardRegisterSchema } from 'src/schema/orchard-registration.schema';
import { PackingHouseRegister, PackingHouseRegisterSchema } from 'src/schema/packing-house-registration.schema';
import { ReserveTransportation, ReserveTransportationSchema } from 'src/schema/reserve-transportation/register-reserve.schema';
import { QAProcess, QAProcessSchema } from 'src/schema/qa-process.schema';
import { DurianRegistration, DurianRegistrationSchema } from 'src/schema/durian-registration.schema';
import { Transportation, TransportationSchema } from 'src/schema/transportation.schema';
import { Container, ContainerSchema } from 'src/container/schema/container.schema';
import { ChemicalProcess1, ChemicalProcess1Schema } from 'src/schema/packing-schemas';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: OrchardRegister.name, schema: OrchardRegisterSchema },
      { name: PackingHouseRegister.name, schema: PackingHouseRegisterSchema },
      { name: ReserveTransportation.name, schema: ReserveTransportationSchema },
      { name: QAProcess.name, schema: QAProcessSchema },
      { name: DurianRegistration.name, schema: DurianRegistrationSchema },
      { name: Transportation.name, schema: TransportationSchema },
      { name: Container.name, schema: ContainerSchema },
      { name: ChemicalProcess1.name, schema: ChemicalProcess1Schema },
    ])
  ],
  controllers: [QaProcessController],
  providers: [QaProcessService],
})
export class QaProcessModule { }
