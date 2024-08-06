import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  WeightingsProcess,
  WeightingsProcessSchema,
} from 'src/schema/weightings-process/weightings-process.schema';
// import { Dashboard, DashboardServiceSchema } from 'src/schema/dashboard/monthly.schema';
import {
  Departure,
  DepartureSchema,
} from 'src/schema/departure/departure.schema';
import {
  DurianRegistration,
  DurianRegistrationSchema,
} from 'src/schema/durian-register/durian-registration.schema';
import { Transportation, TransportationSchema } from 'src/schema/transportation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: WeightingsProcess.name, schema: WeightingsProcessSchema },
      { name: Departure.name, schema: DepartureSchema },
      { name: DurianRegistration.name, schema: DurianRegistrationSchema },
      { name: Transportation.name, schema: TransportationSchema }
    ]),

  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule { }
