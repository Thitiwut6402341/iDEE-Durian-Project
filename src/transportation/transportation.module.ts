import { Module } from '@nestjs/common';
import { TransportationService } from './transportation.service';
import { TransportationController } from './transportation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Transportation, TransportationSchema } from 'src/schema/transportation.schema';
import { Departure, DepartureSchema } from 'src/schema/departure.schema';
import { PackingHouseRegister, PackingHouseRegisterSchema } from 'src/schema/packing-house-registration.schema';
import { Destination, DestinationSchema } from 'src/schema/destination.schema';
import { DurianRegistration, DurianRegistrationSchema } from 'src/schema/durian-registration.schema';
import { ReserveTransportation, ReserveTransportationSchema } from 'src/schema/reserve-transportation/register-reserve.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transportation.name, schema: TransportationSchema },
    { name: Departure.name, schema: DepartureSchema },
    { name: PackingHouseRegister.name, schema: PackingHouseRegisterSchema },
    { name: Destination.name, schema: DestinationSchema },
    { name: DurianRegistration.name, schema: DurianRegistrationSchema },
    { name: ReserveTransportation.name, schema: ReserveTransportationSchema }
    ]),
  ],
  controllers: [TransportationController],
  providers: [TransportationService],
})
export class TransportationModule { }
