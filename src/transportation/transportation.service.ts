import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Departure } from 'src/schema/departure.schema';
import { Transportation } from 'src/schema/transportation.schema';
import { TransportationDto } from './dto/transportation.dto';
import { PackingHouseRegister } from 'src/schema/packing-house-registration.schema';
import { Destination } from 'src/schema/destination.schema';
import { DurianRegistration } from 'src/schema/durian-registration.schema';
import { ReserveTransportation } from 'src/schema/reserve-transportation/register-reserve.schema';

@Injectable()
export class TransportationService {
  constructor(
    @InjectModel(Transportation.name) private transportationModel: Model<Transportation>,
    @InjectModel(Departure.name) private departureModel: Model<Departure>,
    @InjectModel(PackingHouseRegister.name) private packingHouseRegisterModel: Model<PackingHouseRegister>,
    @InjectModel(Destination.name) private destinationModel: Model<Destination>,
    @InjectModel(DurianRegistration.name) private durianRegistrationModel: Model<DurianRegistration>,
    @InjectModel(ReserveTransportation.name) private reserveTransportationModel: Model<ReserveTransportation>,
  ) { }

  // [POST] transportation station
  async TransportationStation(validator: TransportationDto): Promise<any> {
    try {
      const now = new Date();
      let transportation: any

      const transportBooking = await this.reserveTransportationModel.findOne({ booking_ref: validator.booking_ref })

      const yy = now.getFullYear().toString().slice(2)
      const mm = (now.getMonth() + 1).toString().padStart(2, '0')
      const dd = now.getDate().toString().padStart(2, '0')
      const pp = transportBooking.packing_house_code.slice(0, 2).toUpperCase()

      // generate lot id
      const lots = await this.transportationModel.find({ lot_id: { $regex: `${yy}${mm}${dd}${pp}`, $options: 'i' } })
      const lotLength = lots.length
      const lotCurrent = lotLength + 1
      const lotId = `${yy}${mm}${dd}${pp}${lotCurrent.toString().padStart(2, '0')}`

      // prevent duplicate rfid code
      const fruit = await this.transportationModel.find({ rfid_code: { $in: validator.rfid_code } })
      if (fruit.length > 0) {
        await this.transportationModel.updateOne({ rfid_code: validator.rfid_code }, { updated_at: now })
      } else {
        // add lot id to rfid code
        for (const i of validator.rfid_code) {
          await this.durianRegistrationModel.updateOne({ rfid_code: i }, { lot_id: lotId });
        }

        // add data to DB
        transportation = await this.transportationModel.create({
          lot_id: lotId,
          rfid_code: validator.rfid_code,
          booking_ref: validator.booking_ref,
          created_at: now,
          updated_at: now
        })
      }

      return {
        status: 'success',
        message: 'Your durian has been successfully transported to the station',
        data: transportation
      }

    } catch (error) {
      return {
        status: 'error',
        message: error.message
      }
    }
  }


}
