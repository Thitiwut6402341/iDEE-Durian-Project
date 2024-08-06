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
import { Container } from 'src/container/schema/container.schema';
import {
  ChemicalProcess1,
  ChemicalProcess1Document,
} from 'src/schema/packing-schemas';
import { QAProcess } from 'src/schema/qa-process.schema';
@Injectable()
export class TransportationService {
  constructor(
    @InjectModel(Transportation.name)
    private transportationModel: Model<Transportation>,
    @InjectModel(Departure.name) private departureModel: Model<Departure>,
    @InjectModel(PackingHouseRegister.name)
    private packingHouseRegisterModel: Model<PackingHouseRegister>,
    @InjectModel(Destination.name) private destinationModel: Model<Destination>,
    @InjectModel(DurianRegistration.name)
    private durianRegistrationModel: Model<DurianRegistration>,
    @InjectModel(ReserveTransportation.name)
    private reserveTransportationModel: Model<ReserveTransportation>,
    @InjectModel(Container.name) private containerModel: Model<Container>,
    @InjectModel(ChemicalProcess1.name)
    private ChemicalProcess1Model: Model<ChemicalProcess1Document>,
    @InjectModel(QAProcess.name) private qaProcessModel: Model<QAProcess>,
  ) {}

  // [POST] transportation station
  async TransportationStation(validator: TransportationDto): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      let transportation: any;

      const transportBooking = await this.reserveTransportationModel.findOne({
        booking_ref: validator.booking_ref,
      });

      // const yy = now.getFullYear().toString().slice(2);
      // const mm = (now.getMonth() + 1).toString().padStart(2, '0');
      // const dd = now.getDate().toString().padStart(2, '0');
      // const pp = transportBooking.packing_house_code.slice(0, 2).toUpperCase();

      // // generate lot id
      // const lots = await this.transportationModel.find({
      //   container_no: { $regex: `${yy}${mm}${dd}${pp}`, $options: 'i' },
      // });
      // const lotLength = lots.length;
      // const lotCurrent = lotLength + 1;
      // const lotId = `${yy}${mm}${dd}${pp}${lotCurrent.toString().padStart(2, '0')}`;

      // prevent duplicate rfid code
      const fruit = await this.transportationModel.find({
        rfid_code: { $in: validator.rfid_code },
      });
      if (fruit.length > 0) {
        transportation = await this.transportationModel.updateOne(
          { rfid_code: validator.rfid_code },
          { updated_at: now },
        );
      } else {
        // add lot id to rfid code
        for (const i of validator.rfid_code) {
          await this.durianRegistrationModel.updateOne(
            { rfid_code: i },
            {
              container_no: validator.container_no,
              booking_ref: validator.booking_ref,
            },
          );
        }

        const lastContainerNumber = await this.containerModel
          .findOne({ container_no: validator.container_no })
          .sort({ created_at: -1 })
          .select('-_id container_no');
        const newContainerAfterClose =
          lastContainerNumber.container_no +
          `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}`;

        const updateContainerNumber = await this.containerModel.updateOne(
          { container_no: validator.container_no },
          {
            container_no: newContainerAfterClose,
            updated_at: now,
          },
        );

        const updateContainerNumberQAProcess =
          await this.qaProcessModel.updateOne(
            { container_no: validator.container_no },
            {
              container_no: newContainerAfterClose,
              updated_at: now,
            },
          );

        const queryReserveTransportation = await this.reserveTransportationModel
          .findOne({ container_no: validator.container_no })
          .select('-_id container_no');

        // const newContainerNumbers = queryReserveTransportation.container_no.map((no, index) => {
        //   if (validator.container_no.includes(no)) {
        //     return no + `${now.getFullYear()}${now.getMonth()}${now.getDate()}${now.getHours()}${now.getMinutes()}`;
        //     // return no + `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
        //   }
        //   return no;
        // });

        // const updateContainerNumberReserveTransportation = await this.reserveTransportationModel.updateOne({ container_no: validator.container_no }, {
        //   container_no: newContainerNumbers,
        //   updated_at: now
        // })

        // add data to DB
        transportation = await this.transportationModel.create({
          container_no: validator.container_no,
          rfid_code: validator.rfid_code,
          timestamp: validator.timestamp,
          booking_ref: validator.booking_ref,
          created_at: now,
          updated_at: now,
        });
      }

      return {
        status: 'success',
        message: 'Your durian has been successfully transported to the station',
        data: transportation,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // // [GET] get all lot id
  // async GetAllLotId(): Promise<any> {
  //   try {
  //     const lotId = await this.transportationModel.find().select('-_id container_no');
  //     const lotIdList = [];
  //     for (const i of lotId) lotIdList.push(i.container_no);

  //     return {
  //       status: 'success',
  //       message: 'Successfully get all lot id',
  //       data: lotIdList,
  //     };
  //   } catch (error) {
  //     return {
  //       status: 'error',
  //       message: error.message,
  //       data: [],
  //     };
  //   }
  // }
}
