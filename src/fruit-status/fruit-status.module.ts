import { Module } from '@nestjs/common';
import { FruitStatusService } from './fruit-status.service';
import { FruitStatusController } from './fruit-status.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DurianRegistration, DurianRegistrationSchema } from 'src/schema/durian-registration.schema';
import { HardwareDataCollection, HardwareDataCollectionSchema } from 'src/schema/hardware-data.schema';
import { Weightings, WeightingsSchema } from 'src/schema/weightings.schema';
import { Packing, PackingSchema } from 'src/schema/packing.schema';
import { Transportation, TransportationSchema } from 'src/schema/transportation.schema';
import { Departure, DepartureSchema } from 'src/schema/departure.schema';
import { Arrived, ArrivedSchema } from 'src/schema/arrived';
import { NgCases, NgCasesSchema } from 'src/schema/ng-cases.schema';
import { ChemicalProcess1, ChemicalProcess1Schema } from 'src/schema/packing-schemas/chemical-process1.schema';
import { ChemicalProcess2, ChemicalProcess2Schema } from 'src/schema/packing-schemas/chemical-process2.schema';
import { ChemicalProcess3, ChemicalProcess3Schema } from 'src/schema/packing-schemas/chemical-process3.schema';
import { FreezerProcess, FreezerProcessSchema } from 'src/schema/packing-schemas/freezer-process.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: DurianRegistration.name, schema: DurianRegistrationSchema }]),
    MongooseModule.forFeature([{ name: HardwareDataCollection.name, schema: HardwareDataCollectionSchema }]),
    MongooseModule.forFeature([{ name: ChemicalProcess1.name, schema: ChemicalProcess1Schema }]),
    MongooseModule.forFeature([{ name: ChemicalProcess2.name, schema: ChemicalProcess2Schema }]),
    MongooseModule.forFeature([{ name: ChemicalProcess3.name, schema: ChemicalProcess3Schema }]),
    MongooseModule.forFeature([{ name: Weightings.name, schema: WeightingsSchema }]),
    MongooseModule.forFeature([{ name: Packing.name, schema: PackingSchema }]),
    MongooseModule.forFeature([{ name: FreezerProcess.name, schema: FreezerProcessSchema }]),
    MongooseModule.forFeature([{ name: Transportation.name, schema: TransportationSchema }]),
    MongooseModule.forFeature([{ name: Departure.name, schema: DepartureSchema }]),
    MongooseModule.forFeature([{ name: Arrived.name, schema: ArrivedSchema }]),
    MongooseModule.forFeature([{ name: NgCases.name, schema: NgCasesSchema }]),
  ],
  controllers: [FruitStatusController],
  providers: [FruitStatusService],
})
export class FruitStatusModule { }
