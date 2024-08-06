import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, mongo, PipelineStage } from 'mongoose';
import {
  ReserveTransportation,
  ReserveTransportationDocument,
} from 'src/schema/reserve-transportation/register-reserve.schema';
import { TJwtPayload } from 'src/types/jwt-payload';
import { TServiceResponse } from 'src/types/service-response';
// const Ftp = require('ftp');
import { TradeMarkSetting } from 'src/schema/trade-mark-setting/create-trademark.schema';
import {
  OrchardRegister,
  OrchardRegisterDocument,
} from 'src/schema/orchard/orchard-register.schema';
import { CreateReserveDto, EditReserveDto } from './dto';

@Injectable()
export class ReserveTransportationService {
  constructor(
    @InjectModel(ReserveTransportation.name)
    private ReserveTransportationModel: Model<ReserveTransportationDocument>,
    @InjectModel(TradeMarkSetting.name)
    private TradeMarkSettingModel: Model<TradeMarkSetting>,
    @InjectModel(OrchardRegister.name)
    private OrchardModel: Model<OrchardRegisterDocument>,
  ) {}

  //TODO [POST] /reserve/transportation
  async newBooking(
    input: CreateReserveDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkTradeMark = await this.TradeMarkSettingModel.findOne({
        product_name: input.product_name,
      }).select('-_id trademark_img');

      // // return {
      // //   status: 'success',
      // //   statusCode: 200,
      // //   message: 'Demo1',
      // //   data: [checkTradeMark],
      // // };

      // if (checkTradeMark)
      //   return {
      //     status: 'error',
      //     statusCode: 404,
      //     message: 'Product name not found!',
      //     data: [],
      //   };

      const document = {
        product_name: input.product_name,
        email_freight: input.email_freight,
        orchard_codes: input.orchard_codes,
        packing_house_code: input.packing_house_code,
        destination: input.destination,
        container_type: input.container_type,
        number_of_container: input.number_of_container,
        weight: input.weight,
        date_time: input.date_time,

        trademark_img: checkTradeMark?.trademark_img ?? null,
        packaging_no: null,
        export_type: null,
        product_list: null,
        packaging_shape: null,
        volume: null,
        booking_ref: null,
        freight_forwarder: null,
        air_line: null,
        flight: null,
        flight_depart_date: null,
        flight_arrive_date: null,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      };

      const saved = await this.ReserveTransportationModel.create(document);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Created reserve transportation successfully',
        data: [saved],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  //? [PUT] /reserve/edit-transportation
  async editReserveTransportation(
    validator: EditReserveDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkData = await this.ReserveTransportationModel.findOne({
        _id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          validator.reserve_id,
        ),
      }).exec();

      if (!checkData)
        return {
          status: 'error',
          statusCode: 404,
          message: 'booking not found!',
          data: [],
        };

      // const checkBookingRefExists =
      //   await this.ReserveTransportationModel.findOne({
      //     booking_ref: validator.booking_ref,
      //     _id: {
      //       $ne: mongoose.mongo.BSON.ObjectId.createFromHexString(
      //         validator.reserve_id,
      //       ),
      //     },
      //   }).exec();

      // if (Boolean(checkBookingRefExists))
      //   return {
      //     status: 'error',
      //     statusCode: 400,
      //     message: 'Booking ref is already exists!',
      //     data: [],
      //   };

      const updateFields =
        validator.export_type === 'plane'
          ? {
              container_no: validator.container_no,
              email_freight: validator.email_freight,
              product_list: validator.product_list,
              packaging_shape: validator.packaging_shape,
              volume: validator.volume,
              booking_ref: validator.booking_ref,
              freight_forwarder: validator.freight_forwarder,
              export_type: validator.export_type,
              air_line: validator.air_line,
              flight: validator.flight,
              flight_depart_date: validator.flight_depart_date,
              flight_arrive_date: validator.flight_arrive_date,
              created_at: now,
              updated_at: now,
              creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
                decoded.user_id,
              ),
            }
          : {
              email_freight: validator.email_freight,
              product_list: validator.product_list,
              packaging_shape: validator.packaging_shape,
              volume: validator.volume,
              booking_ref: validator.booking_ref,
              freight_forwarder: validator.freight_forwarder,
              export_type: validator.export_type,
              air_line: null,
              flight: null,
              flight_depart_date: null,
              flight_arrive_date: null,
              created_at: now,
              updated_at: now,
              creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
                decoded.user_id,
              ),
            };

      const updated = await this.ReserveTransportationModel.updateOne(
        {
          _id: mongoose.mongo.BSON.ObjectId.createFromHexString(
            validator.reserve_id,
          ),
        },
        {
          $set: updateFields,
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Update booking for train success',
        data: [updated],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  //* [GET] /reserve/transportation-id
  async getReserveTransportation(
    reserve_id: string,
  ): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            _id: mongo.BSON.ObjectId.createFromHexString(reserve_id),
          },
        },
        {
          $lookup: {
            from: 'PackingHouseRegistration',
            localField: 'packing_house_code',
            foreignField: 'packing_house_code',
            as: 'PackingHouseRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  packing_house_name: 1,
                  doa_no: 1,
                  doa_img: 1,
                  gmp_no: 1,
                  gmp_img: 1,
                  du_no: 1,
                  du_img: 1,
                  cn_no: 1,
                  cn_img: 1,
                  doa_exp: 1,
                  gmp_exp: 1,
                  du_exp: 1,
                  cn_exp: 1,
                },
              },
            ],
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$PackingHouseRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $unwind: '$orchard_codes',
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_codes',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_code: 1,
                  orchard_name: 1,
                  gap_no: 1,
                  gap_img: 1,
                  gap_exp: 1,
                  tax_id: 1,
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: '$_id',
            obj: {
              $first: '$$ROOT',
            },
            orchard_codes_array: {
              $push: {
                $arrayElemAt: ['$OrchardRegistration', 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            doa_no: {
              $cond: [
                {
                  $gte: ['$obj.doa_no', null],
                },
                '$obj.doa_no',
                null,
              ],
            },
            doa_img: {
              $cond: [
                {
                  $gte: ['$obj.doa_img', null],
                },
                '$obj.doa_img',
                null,
              ],
            },
            gmp_no: {
              $cond: [
                {
                  $gte: ['$obj.gmp_no', null],
                },
                '$obj.gmp_no',
                null,
              ],
            },
            gmp_img: {
              $cond: [
                {
                  $gte: ['$obj.gmp_img', null],
                },
                '$obj.gmp_img',
                null,
              ],
            },
            du_no: {
              $cond: [
                {
                  $gte: ['$obj.du_no', null],
                },
                '$obj.du_no',
                null,
              ],
            },
            du_img: {
              $cond: [
                {
                  $gte: ['$obj.du_img', null],
                },
                '$obj.du_img',
                null,
              ],
            },
            cn_no: {
              $cond: [
                {
                  $gte: ['$obj.cn_no', null],
                },
                '$obj.cn_no',
                null,
              ],
            },
            cn_img: {
              $cond: [
                {
                  $gte: ['$obj.cn_img', null],
                },
                '$obj.cn_img',
                null,
              ],
            },
            doa_exp: {
              $cond: [
                {
                  $gte: ['$obj.doa_exp', null],
                },
                '$obj.doa_exp',
                null,
              ],
            },
            gmp_exp: {
              $cond: [
                {
                  $gte: ['$obj.gmp_exp', null],
                },
                '$obj.gmp_exp',
                null,
              ],
            },
            du_exp: {
              $cond: [
                {
                  $gte: ['$obj.du_exp', null],
                },
                '$obj.du_exp',
                null,
              ],
            },
            cn_exp: {
              $cond: [
                {
                  $gte: ['$obj.cn_exp', null],
                },
                '$obj.cn_exp',
                null,
              ],
            },
            packing_house_name: {
              $cond: [
                {
                  $gte: ['$obj.packing_house_name', null],
                },
                '$obj.packing_house_name',
                null,
              ],
            },
            product_name: {
              $cond: [
                {
                  $gte: ['$obj.product_name', null],
                },
                '$obj.product_name',
                null,
              ],
            },
            email_freight: {
              $cond: [
                {
                  $gte: ['$obj.email_freight', null],
                },
                '$obj.email_freight',
                null,
              ],
            },
            packing_house_code: {
              $cond: [
                {
                  $gte: ['$obj.packing_house_code', null],
                },
                '$obj.packing_house_code',
                null,
              ],
            },
            orchards: '$orchard_codes_array',
            destination: {
              $cond: [
                {
                  $gte: ['$obj.destination', null],
                },
                '$obj.destination',
                null,
              ],
            },
            container_type: {
              $cond: [
                {
                  $gte: ['$obj.container_type', null],
                },
                '$obj.container_type',
                null,
              ],
            },
            number_of_container: {
              $cond: [
                {
                  $gte: ['$obj.number_of_container', null],
                },
                '$obj.number_of_container',
                null,
              ],
            },
            weight: {
              $cond: [
                {
                  $gte: ['$obj.weight', null],
                },
                '$obj.weight',
                null,
              ],
            },
            date_time: {
              $cond: [
                {
                  $gte: ['$obj.date_time', null],
                },
                '$obj.date_time',
                null,
              ],
            },
            trademark_img: {
              $cond: [
                {
                  $gte: ['$obj.trademark_img', null],
                },
                '$obj.trademark_img',
                null,
              ],
            },
            product_list: {
              $cond: [
                {
                  $gte: ['$obj.product_list', null],
                },
                '$obj.product_list',
                null,
              ],
            },
            volume: {
              $cond: [
                {
                  $gte: ['$obj.volume', null],
                },
                '$obj.volume',
                null,
              ],
            },
            booking_ref: {
              $cond: [
                {
                  $gte: ['$obj.booking_ref', null],
                },
                '$obj.booking_ref',
                null,
              ],
            },
            freight_forwarder: {
              $cond: [
                {
                  $gte: ['$obj.freight_forwarder', null],
                },
                '$obj.freight_forwarder',
                null,
              ],
            },
            export_type: {
              $cond: [
                {
                  $gte: ['$obj.export_type', null],
                },
                '$obj.export_type',
                null,
              ],
            },
            air_line: {
              $cond: [
                {
                  $gte: ['$obj.air_line', null],
                },
                '$obj.air_line',
                null,
              ],
            },
            flight: {
              $cond: [
                {
                  $gte: ['$obj.flight', null],
                },
                '$obj.flight',
                null,
              ],
            },
            flight_depart_date: {
              $cond: [
                {
                  $gte: ['$obj.flight_depart_date', null],
                },
                '$obj.flight_depart_date',
                null,
              ],
            },
            flight_arrive_date: {
              $cond: [
                {
                  $gte: ['$obj.flight_arrive_date', null],
                },
                '$obj.flight_arrive_date',
                null,
              ],
            },
            packaging_no: {
              $cond: [
                {
                  $gte: ['$obj.packaging_no', null],
                },
                '$obj.packaging_no',
                null,
              ],
            },
            reserve_id: {
              $cond: [
                {
                  $gte: ['$obj._id', null],
                },
                '$obj._id',
                null,
              ],
            },
            created_at: {
              $cond: [
                {
                  $gte: ['$obj.created_at', null],
                },
                {
                  $dateToString: {
                    date: '$obj.created_at',
                    timezone: 'Asia/Bangkok',
                    format: '%Y-%m-%d %H:%M:%S',
                  },
                },
                null,
              ],
            },
            updated_at: {
              $cond: [
                {
                  $gte: ['$obj.updated_at', null],
                },
                {
                  $dateToString: {
                    date: '$obj.updated_at',
                    timezone: 'Asia/Bangkok',
                    format: '%Y-%m-%d %H:%M:%S',
                  },
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'Container',
            localField: 'reserve_id',
            foreignField: 'reserve_id',
            as: 'Container',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  container_no: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  container_no: {
                    $push: '$container_no',
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$Container', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            doa_no: 1,
            doa_img: 1,
            gmp_no: 1,
            gmp_img: 1,
            du_no: 1,
            du_img: 1,
            cn_no: 1,
            cn_img: 1,
            doa_exp: 1,
            gmp_exp: 1,
            du_exp: 1,
            cn_exp: 1,
            packing_house_name: 1,
            product_name: 1,
            email_freight: 1,
            packing_house_code: 1,
            orchards: 1,
            destination: 1,
            container_type: 1,
            number_of_container: 1,
            container_no: {
              $cond: [
                {
                  $gt: ['$container_no', null],
                },
                '$container_no',
                null,
              ],
            },
            weight: 1,
            date_time: 1,
            trademark_img: 1,
            product_list: 1,
            volume: 1,
            booking_ref: 1,
            freight_forwarder: 1,
            export_type: 1,
            air_line: 1,
            flight: 1,
            flight_depart_date: 1,
            flight_arrive_date: 1,
            packaging_no: 1,
            reserve_id: {
              $toString: '$reserve_id',
            },
            created_at: 1,
            updated_at: 1,
          },
        },
      ];

      const results = await this.ReserveTransportationModel.aggregate(pipeline);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get reserve by id successfully',
        data: results,
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  //* [GET] /reserve/all-transportation
  async getAllReserveTransportation(): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'PackingHouseRegistration',
            localField: 'packing_house_code',
            foreignField: 'packing_house_code',
            as: 'PackingHouseRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  packing_house_name: 1,
                  doa_no: 1,
                  doa_img: 1,
                  gmp_no: 1,
                  gmp_img: 1,
                  du_no: 1,
                  du_img: 1,
                  cn_no: 1,
                  cn_img: 1,
                  doa_exp: 1,
                  gmp_exp: 1,
                  du_exp: 1,
                  cn_exp: 1,
                },
              },
            ],
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$PackingHouseRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $unwind: '$orchard_codes',
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_codes',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_code: 1,
                  orchard_name: 1,
                  gap_no: 1,
                  gap_img: 1,
                  gap_exp: 1,
                  tax_id: 1,
                },
              },
            ],
          },
        },
        {
          $group: {
            _id: '$_id',
            obj: {
              $first: '$$ROOT',
            },
            orchard_codes_array: {
              $push: {
                $arrayElemAt: ['$OrchardRegistration', 0],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            doa_no: {
              $cond: [
                {
                  $gte: ['$obj.doa_no', null],
                },
                '$obj.doa_no',
                null,
              ],
            },
            doa_img: {
              $cond: [
                {
                  $gte: ['$obj.doa_img', null],
                },
                '$obj.doa_img',
                null,
              ],
            },
            gmp_no: {
              $cond: [
                {
                  $gte: ['$obj.gmp_no', null],
                },
                '$obj.gmp_no',
                null,
              ],
            },
            gmp_img: {
              $cond: [
                {
                  $gte: ['$obj.gmp_img', null],
                },
                '$obj.gmp_img',
                null,
              ],
            },
            du_no: {
              $cond: [
                {
                  $gte: ['$obj.du_no', null],
                },
                '$obj.du_no',
                null,
              ],
            },
            du_img: {
              $cond: [
                {
                  $gte: ['$obj.du_img', null],
                },
                '$obj.du_img',
                null,
              ],
            },
            cn_no: {
              $cond: [
                {
                  $gte: ['$obj.cn_no', null],
                },
                '$obj.cn_no',
                null,
              ],
            },
            cn_img: {
              $cond: [
                {
                  $gte: ['$obj.cn_img', null],
                },
                '$obj.cn_img',
                null,
              ],
            },
            doa_exp: {
              $cond: [
                {
                  $gte: ['$obj.doa_exp', null],
                },
                '$obj.doa_exp',
                null,
              ],
            },
            gmp_exp: {
              $cond: [
                {
                  $gte: ['$obj.gmp_exp', null],
                },
                '$obj.gmp_exp',
                null,
              ],
            },
            du_exp: {
              $cond: [
                {
                  $gte: ['$obj.du_exp', null],
                },
                '$obj.du_exp',
                null,
              ],
            },
            cn_exp: {
              $cond: [
                {
                  $gte: ['$obj.cn_exp', null],
                },
                '$obj.cn_exp',
                null,
              ],
            },
            packing_house_name: {
              $cond: [
                {
                  $gte: ['$obj.packing_house_name', null],
                },
                '$obj.packing_house_name',
                null,
              ],
            },
            product_name: {
              $cond: [
                {
                  $gte: ['$obj.product_name', null],
                },
                '$obj.product_name',
                null,
              ],
            },
            email_freight: {
              $cond: [
                {
                  $gte: ['$obj.email_freight', null],
                },
                '$obj.email_freight',
                null,
              ],
            },
            packing_house_code: {
              $cond: [
                {
                  $gte: ['$obj.packing_house_code', null],
                },
                '$obj.packing_house_code',
                null,
              ],
            },
            orchards: '$orchard_codes_array',
            destination: {
              $cond: [
                {
                  $gte: ['$obj.destination', null],
                },
                '$obj.destination',
                null,
              ],
            },
            container_type: {
              $cond: [
                {
                  $gte: ['$obj.container_type', null],
                },
                '$obj.container_type',
                null,
              ],
            },
            number_of_container: {
              $cond: [
                {
                  $gte: ['$obj.number_of_container', null],
                },
                '$obj.number_of_container',
                null,
              ],
            },
            weight: {
              $cond: [
                {
                  $gte: ['$obj.weight', null],
                },
                '$obj.weight',
                null,
              ],
            },
            date_time: {
              $cond: [
                {
                  $gte: ['$obj.date_time', null],
                },
                '$obj.date_time',
                null,
              ],
            },
            trademark_img: {
              $cond: [
                {
                  $gte: ['$obj.trademark_img', null],
                },
                '$obj.trademark_img',
                null,
              ],
            },
            product_list: {
              $cond: [
                {
                  $gte: ['$obj.product_list', null],
                },
                '$obj.product_list',
                null,
              ],
            },
            volume: {
              $cond: [
                {
                  $gte: ['$obj.volume', null],
                },
                '$obj.volume',
                null,
              ],
            },
            booking_ref: {
              $cond: [
                {
                  $gte: ['$obj.booking_ref', null],
                },
                '$obj.booking_ref',
                null,
              ],
            },
            freight_forwarder: {
              $cond: [
                {
                  $gte: ['$obj.freight_forwarder', null],
                },
                '$obj.freight_forwarder',
                null,
              ],
            },
            export_type: {
              $cond: [
                {
                  $gte: ['$obj.export_type', null],
                },
                '$obj.export_type',
                null,
              ],
            },
            air_line: {
              $cond: [
                {
                  $gte: ['$obj.air_line', null],
                },
                '$obj.air_line',
                null,
              ],
            },
            flight: {
              $cond: [
                {
                  $gte: ['$obj.flight', null],
                },
                '$obj.flight',
                null,
              ],
            },
            flight_depart_date: {
              $cond: [
                {
                  $gte: ['$obj.flight_depart_date', null],
                },
                '$obj.flight_depart_date',
                null,
              ],
            },
            flight_arrive_date: {
              $cond: [
                {
                  $gte: ['$obj.flight_arrive_date', null],
                },
                '$obj.flight_arrive_date',
                null,
              ],
            },
            packaging_no: {
              $cond: [
                {
                  $gte: ['$obj.packaging_no', null],
                },
                '$obj.packaging_no',
                null,
              ],
            },
            reserve_id: {
              $cond: [
                {
                  $gte: ['$obj._id', null],
                },
                '$obj._id',
                null,
              ],
            },
            created_at: {
              $cond: [
                {
                  $gte: ['$obj.created_at', null],
                },
                {
                  $dateToString: {
                    date: '$obj.created_at',
                    timezone: 'Asia/Bangkok',
                    format: '%Y-%m-%d %H:%M:%S',
                  },
                },
                null,
              ],
            },
            updated_at: {
              $cond: [
                {
                  $gte: ['$obj.updated_at', null],
                },
                {
                  $dateToString: {
                    date: '$obj.updated_at',
                    timezone: 'Asia/Bangkok',
                    format: '%Y-%m-%d %H:%M:%S',
                  },
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'Container',
            localField: 'reserve_id',
            foreignField: 'reserve_id',
            as: 'Container',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  container_no: 1,
                },
              },
              {
                $group: {
                  _id: null,
                  container_no: {
                    $push: '$container_no',
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                },
              },
            ],
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$Container', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            doa_no: 1,
            doa_img: 1,
            gmp_no: 1,
            gmp_img: 1,
            du_no: 1,
            du_img: 1,
            cn_no: 1,
            cn_img: 1,
            doa_exp: 1,
            gmp_exp: 1,
            du_exp: 1,
            cn_exp: 1,
            packing_house_name: 1,
            product_name: 1,
            email_freight: 1,
            packing_house_code: 1,
            orchards: 1,
            destination: 1,
            container_type: 1,
            number_of_container: 1,
            container_no: {
              $cond: [
                {
                  $gt: ['$container_no', null],
                },
                '$container_no',
                null,
              ],
            },
            weight: 1,
            date_time: 1,
            trademark_img: 1,
            product_list: 1,
            volume: 1,
            booking_ref: 1,
            freight_forwarder: 1,
            export_type: 1,
            air_line: 1,
            flight: 1,
            flight_depart_date: 1,
            flight_arrive_date: 1,
            packaging_no: 1,
            reserve_id: {
              $toString: '$reserve_id',
            },
            created_at: 1,
            updated_at: 1,
          },
        },
      ];

      const results = await this.ReserveTransportationModel.aggregate(pipeline);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get all reserve successfully',
        data: results,
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  //! [DELETE] /reserve/delete
  async deleteReserve(reserve_id: string): Promise<TServiceResponse> {
    try {
      const deleted = await this.ReserveTransportationModel.deleteOne({
        _id: mongo.BSON.ObjectId.createFromHexString(reserve_id),
      }).exec();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Delete orchard successfully!',
        data: [deleted],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: 'Delete orchard successfully!',
        data: [],
      };
    }
  }
}
