import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateDashboardMonthlyDto } from './dto/dashboard-monthly.dto';
import { Model } from 'mongoose';
// import { Dashboard } from 'src/schema/dashboard/monthly.schema';
import { WeightingsProcess } from 'src/schema/weightings-process/weightings-process.schema';
import { Departure } from 'src/schema/departure/departure.schema';
import { DurianRegistration } from 'src/schema/durian-register/durian-registration.schema';

@Injectable()
export class DashboardService {
  constructor(
    // @InjectModel(Dashboard.name) private dashboardModel: Model<Dashboard>,
    @InjectModel(WeightingsProcess.name)
    private weightingsProcessModel: Model<WeightingsProcess>,
    @InjectModel(Departure.name) private departureModel: Model<Departure>,
    @InjectModel(DurianRegistration.name)
    private durianRegistrationModel: Model<DurianRegistration>,
  ) { }

  //* [GET] /dashboard/mode
  async dbMonthly(mode: string, year: string): Promise<any> {
    try {
      const now = new Date();

      if (mode === 'monthly') {
        const yearNumber = +year;

        const pipeline = [
          {
            $lookup: {
              from: 'WeightingsProcess',
              localField: 'fruit_code',
              foreignField: 'fruit_code',
              as: 'result_WeightingsProcess',
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
                    $arrayElemAt: ['$result_WeightingsProcess', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'DurianRegistration',
              localField: 'fruit_code',
              foreignField: 'fruit_code',
              as: 'result_DurianRegistration',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    tree_code: 1,
                    orchard_code: 1,
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
                    $arrayElemAt: ['$result_DurianRegistration', 0],
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
              as: 'result_house',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    packing_name: 1,
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
                    $arrayElemAt: ['$result_house', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              tree_code: 1,
              orchard_code: 1,
              packing_house_code: 1,
              weight: 1,
              fruit_code: 1,
              packing_name: 1,
              province: 1,
              updated_at: {
                $dateToString: {
                  date: '$updated_at',
                  format: '%Y-%m-%d %H:%M:%S',
                },
              },
              created_at: {
                $dateToString: {
                  date: '$created_at',
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
            $match: {
              year: yearNumber,
            },
          },
          {
            $group: {
              _id: {
                packing_house_code: '$packing_house_code',
                year: '$year',
                month: '$month',
                province: '$province',
                packing_name: '$packing_name',
              },
              weight: {
                $sum: '$weight',
              },
            },
          },
          {
            $project: {
              _id: 0,
              weight: 1,
              packing_house_code: '$_id.packing_house_code',
              packing_name: '$_id.packing_name',
              province: '$_id.province',
              year: '$_id.year',
              month: '$_id.month',
            },
          },
        ];

        const aggregationResult = await this.departureModel
          .aggregate(pipeline)
          .exec();
        return {
          status: 'success',
          message: 'Show Dashboard in monthly mode successfully!',
          data: aggregationResult,
        };
      } else if (mode === 'yearly') {
        const pipeline = [
          {
            $lookup: {
              from: 'WeightingsProcess',
              localField: 'fruit_code',
              foreignField: 'fruit_code',
              as: 'result_WeightingsProcess',
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
                    $arrayElemAt: ['$result_WeightingsProcess', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $lookup: {
              from: 'DurianRegistration',
              localField: 'fruit_code',
              foreignField: 'fruit_code',
              as: 'result_DurianRegistration',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    tree_code: 1,
                    orchard_code: 1,
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
                    $arrayElemAt: ['$result_DurianRegistration', 0],
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
              as: 'result_house',
              pipeline: [
                {
                  $project: {
                    _id: 0,
                    packing_name: 1,
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
                    $arrayElemAt: ['$result_house', 0],
                  },
                  '$$ROOT',
                ],
              },
            },
          },
          {
            $project: {
              _id: 1,
              tree_code: 1,
              orchard_code: 1,
              packing_house_code: 1,
              weight: 1,
              fruit_code: 1,
              packing_name: 1,
              province: 1,
              updated_at: {
                $dateToString: {
                  date: '$updated_at',
                  format: '%Y-%m-%d %H:%M:%S',
                },
              },
              created_at: {
                $dateToString: {
                  date: '$created_at',
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
                province: '$province',
                packing_name: '$packing_name',
              },
              weight: {
                $sum: '$weight',
              },
            },
          },
          {
            $project: {
              _id: 0,
              weight: 1,
              packing_house_code: '$_id.packing_house_code',
              packing_name: '$_id.packing_name',
              province: '$_id.province',
              year: '$_id.year',
              month: '$_id.month',
            },
          },
        ];

        const aggregationResult = await this.departureModel
          .aggregate(pipeline)
          .exec();
        const yearlyAggregation = aggregationResult.reduce((acc, curr) => {
          const key = `${curr.packing_house_code}-${curr.packing_name}-${curr.province}-${curr.year}`;
          if (!acc[key]) {
            acc[key] = {
              weight: curr.weight,
              packing_house_code: curr.packing_house_code,
              packing_name: curr.packing_name,
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
            from: 'OrchardRegisteration',
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
                  sum_area: 1,
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
            localField: 'fruit_code',
            foreignField: 'fruit_code',
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
}
