import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDashboardMonthlyDto } from './dto/dashboard-monthly.dto';
import { Model } from 'mongoose';
// import { Dashboard } from 'src/schema/dashboard/monthly.schema';
import { WeightingsProcess } from 'src/schema/weightings-process/weightings-process.schema';
import { Departure } from 'src/schema/departure/departure.schema';
import { DurianRegistration } from 'src/schema/durian-register/durian-registration.schema';
import { Transportation } from 'src/schema/transportation.schema';
@Injectable()
export class DashboardService {
  constructor(
    // @InjectModel(Dashboard.name) private dashboardModel: Model<Dashboard>,
    @InjectModel(WeightingsProcess.name)
    private weightingsProcessModel: Model<WeightingsProcess>,
    // @InjectModel(Departure.name) private departureModel: Model<Departure>,
    @InjectModel(Transportation.name)
    private transportationModel: Model<Transportation>,
    @InjectModel(DurianRegistration.name)
    private durianRegistrationModel: Model<DurianRegistration>,
  ) {}

  //* [GET] /dashboard/mode
  async dbMonthly(mode: string, year: string): Promise<any> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      if (mode === 'monthly') {
        const yearNumber = +year;

        const pipeline = [
          {
            $lookup: {
              from: 'ReserveTransportation',
              localField: 'reserve_id',
              foreignField: '_id',
              as: 'result_Reserve',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    packing_house_code: 1,
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
                    $arrayElemAt: ['$result_Reserve', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'PackingHouseRegisteration',
              localField: 'packing_house_code',
              foreignField: 'packing_house_code',
              as: 'result_pk_name',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    packing_house_name: 1,
                    province: 1,
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
                    $arrayElemAt: ['$result_pk_name', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $unwind: '$rfid_code',
          },
          {
            $lookup: {
              from: 'WeightingsProcess',
              localField: 'rfid_code',
              foreignField: 'rfid_code',
              as: 'Weightings',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    weight: 1,
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
                    $arrayElemAt: ['$Weightings', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              packing_house_code: 1,
              province: 1,
              packing_house_name: 1,
              weight: 1,
              created_at: {
                $dateToString: {
                  date: '$created_at',
                  format: '%Y-%m-%d %H:%M:%S',
                },
              },
              updated_at: {
                $dateToString: {
                  date: '$updated_at',
                  format: '%Y-%m-%d %H:%M:%S',
                },
              },
              year: {
                $year: {
                  $toDate: '$updated_at',
                },
              },
              month: {
                $month: {
                  $toDate: '$updated_at',
                },
              },
            },
          },
          {
            $group: {
              _id: {
                packing_house_code: '$packing_house_code',
                year: '$year',
                month: '$month',
              },
              province: {
                $last: '$province',
              },
              packing_house_name: {
                $last: '$packing_house_name',
              },
              created_at: {
                $last: '$created_at',
              },
              updated_at: {
                $last: '$updated_at',
              },
              weight: {
                $sum: '$weight',
              },
            },
          },
          {
            $project: {
              _id: 0,
              packing_house_code: '$_id.packing_house_code',
              province: 1,
              packing_house_name: 1,
              weight: 1,
              year: '$_id.year',
              month: '$_id.month',
            },
          },
          {
            $match: {
              year: yearNumber,
            },
          },
        ];

        const aggregationResult = await this.transportationModel
          .aggregate(pipeline)
          .exec();
        return {
          status: 'success',
          message: 'Show Dashboard in monthly mode successfully! 555',
          data: aggregationResult,
        };
      } else if (mode === 'yearly') {
        const pipeline = [
          {
            $lookup: {
              from: 'ReserveTransportation',
              localField: 'booking_ref',
              foreignField: 'booking_ref',
              as: 'result_Reserve',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    packing_house_code: 1,
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
                    $arrayElemAt: ['$result_Reserve', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'PackingHouseRegisteration',
              localField: 'packing_house_code',
              foreignField: 'packing_house_code',
              as: 'result_pk_name',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    packing_house_name: 1,
                    province: 1,
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
                    $arrayElemAt: ['$result_pk_name', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $unwind: '$rfid_code',
          },
          {
            $lookup: {
              from: 'WeightingsProcess',
              localField: 'rfid_code',
              foreignField: 'rfid_code',
              as: 'Weightings',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    weight: 1,
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
                    $arrayElemAt: ['$Weightings', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $project: {
              _id: 0,
              packing_house_code: 1,
              province: 1,
              packing_house_name: 1,
              weight: 1,
              created_at: {
                $dateToString: {
                  date: '$created_at',
                  format: '%Y-%m-%d %H:%M:%S',
                },
              },
              updated_at: {
                $dateToString: {
                  date: '$updated_at',
                  format: '%Y-%m-%d %H:%M:%S',
                },
              },
              year: {
                $year: {
                  $toDate: '$updated_at',
                },
              },
              month: {
                $month: {
                  $toDate: '$updated_at',
                },
              },
              day: {
                $dayOfMonth: {
                  $toDate: '$updated_at',
                },
              },
            },
          },
          {
            $group: {
              _id: {
                packing_house_code: '$packing_house_code',
                year: '$year',
                month: '$month',
              },
              province: {
                $last: '$province',
              },
              packing_house_name: {
                $last: '$packing_house_name',
              },
              created_at: {
                $last: '$created_at',
              },
              updated_at: {
                $last: '$updated_at',
              },
              weight: {
                $sum: '$weight',
              },
            },
          },
          {
            $project: {
              _id: 0,
              packing_house_code: '$_id.packing_house_code',
              province: 1,
              packing_house_name: 1,
              weight: 1,
              year: '$_id.year',
              month: '$_id.month',
            },
          },
        ];

        const aggregationResult = await this.transportationModel
          .aggregate(pipeline)
          .exec();
        const yearlyAggregation = aggregationResult.reduce((acc, curr) => {
          const key = `${curr.packing_house_code}-${curr.packing_house_name}-${curr.province}-${curr.year}`;
          if (!acc[key]) {
            acc[key] = {
              weight: curr.weight,
              packing_house_code: curr.packing_house_code,
              packing_house_name: curr.packing_house_name,
              province: curr.province,
              year: curr.year,
            };
          } else {
            acc[key].weight += curr.weight;
          }
          return acc;
        }, {});

        return {
          status: 'success',
          message: 'Show Dashboard in yearly mode successfully!',
          data: Object.values(yearlyAggregation),
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  async exportData() {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'result_orchard',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
                  orchard_code: 1,
                  province: 1,
                  sum_area: {
                    $divide: [
                      {
                        $sum: [
                          {
                            $multiply: ['$area_rai', 1600],
                          },
                          {
                            $multiply: ['$area_ngan', 400],
                          },
                          {
                            $multiply: ['$area_wa', 4],
                          },
                        ],
                      },
                      1600,
                    ],
                  },
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
                  $arrayElemAt: ['$result_orchard', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'WeightingsProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'result_weight',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  weight: 1,
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
                  $arrayElemAt: ['$result_weight', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $group: {
            _id: '$orchard_code',
            count_durian: {
              $sum: 1,
            },
            sum_weight_kg: {
              $sum: '$weight',
            },
            sum_area: {
              $last: '$sum_area',
            },
            province: {
              $last: '$province',
            },
            orchard_name: {
              $last: '$orchard_name',
            },
          },
        },
        {
          $project: {
            _id: 0,
            orchard_code: '$_id',
            count_durian: 1,
            sum_area: 1,
            province: 1,
            orchard_name: 1,
            yield: {
              $divide: ['$sum_weight_kg', '$sum_area'],
            },
            sum_weight_kg: 1,
            sum_weight_ton: {
              $divide: ['$sum_weight_kg', 1000],
            },
          },
        },
      ];

      const aggregationResult = await this.durianRegistrationModel
        .aggregate(pipeline)
        .exec();

      const totalWeight = aggregationResult.reduce(
        (acc, curr) => acc + curr.sum_weight_kg,
        0,
      );

      const modifiedResult = aggregationResult.map((doc) => ({
        ...doc,
        total_weight: totalWeight,
        percent_export: (doc.sum_weight_kg / totalWeight) * 100,
      }));

      return {
        status: 'success',
        message: 'Show orchard export data successfully!',
        data: modifiedResult,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  //* [GET] /dashboard/db-premium
  async dbPremium(): Promise<any> {
    try {
      const data = await this.durianRegistrationModel.aggregate([
        {
          $project: {
            _id: 0,
            rfid_code: 1,
            inspected_grade: 1,
            container_no: 1,
            timestamp_harvest: '$created_at',
          },
        },
        {
          $lookup: {
            from: 'ChemicalProcess1',
            let: {
              rfid_code: '$rfid_code',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$rfid_code', '$$rfid_code'],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp_chemical1: '$created_at',
                },
              },
            ],
            as: 'ChemicalProcess1_result',
          },
        },
        {
          $set: {
            timestamp_chemical1: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$ChemicalProcess1_result.timestamp_chemical1',
                    0,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'ChemicalProcess2',
            let: {
              rfid_code: '$rfid_code',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$rfid_code', '$$rfid_code'],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp_chemical2: '$created_at',
                },
              },
            ],
            as: 'ChemicalProcess2_result',
          },
        },
        {
          $set: {
            timestamp_chemical2: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$ChemicalProcess2_result.timestamp_chemical2',
                    0,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'ChemicalProcess3',
            let: {
              rfid_code: '$rfid_code',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$rfid_code', '$$rfid_code'],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp_chemical3: '$created_at',
                },
              },
            ],
            as: 'ChemicalProcess3_result',
          },
        },
        {
          $set: {
            timestamp_chemical3: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$ChemicalProcess3_result.timestamp_chemical3',
                    0,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'PackingProcess',
            let: {
              rfid_code: '$rfid_code',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$rfid_code', '$$rfid_code'],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp_packing: '$created_at',
                },
              },
            ],
            as: 'PackingProcess_result',
          },
        },
        {
          $set: {
            timestamp_packing: {
              $ifNull: [
                {
                  $arrayElemAt: ['$PackingProcess_result.timestamp_packing', 0],
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'Transportation',
            let: {
              rfid_code: '$rfid_code',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$rfid_code', '$$rfid_code'],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp_transport: '$created_at',
                },
              },
            ],
            as: 'Transportation_result',
          },
        },
        {
          $set: {
            timestamp_transport: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$Transportation_result.timestamp_transport',
                    0,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'ArrivedProcess',
            let: {
              container_no: '$container_no',
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $eq: ['$lod_id', '$$container_no'],
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp_departure: '$created_at',
                },
              },
            ],
            as: 'ArrivedProcess_result',
          },
        },
        {
          $set: {
            timestamp_departure: {
              $ifNull: [
                {
                  $arrayElemAt: [
                    '$ArrivedProcess_result.timestamp_departure',
                    0,
                  ],
                },
                null,
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            rfid_code: 1,
            inspected_grade: 1,
            container_no: 1,
            timestamp_harvest: 1,
            timestamp_chemical1: 1,
            timestamp_chemical2: 1,
            timestamp_chemical3: 1,
            timestamp_packing: 1,
            timestamp_transport: 1,
            timestamp_departure: 1,
          },
        },
      ]);

      return {
        status: 'success',
        message: 'Show orchard export data successfully!',
        data: data,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
