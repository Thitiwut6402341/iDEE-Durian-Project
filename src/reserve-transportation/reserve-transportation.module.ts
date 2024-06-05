import { Module } from '@nestjs/common';
import { ReserveTransportationService } from './reserve-transportation.service';
import { ReserveTransportationController } from './reserve-transportation.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { ReserveTransportation, ReserveTransportationSchema } from 'src/schema/reserve-transportation/register-reserve.schema';


@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ReserveTransportation.name,
        schema: ReserveTransportationSchema,
      },])],
  controllers: [ReserveTransportationController],
  providers: [ReserveTransportationService],
})
export class ReserveTransformationModule { }
