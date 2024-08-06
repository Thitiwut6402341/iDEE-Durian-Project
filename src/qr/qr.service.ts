import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
// import { CreateQrDto } from './dto/create-qr.dto';
// import { Qr, QrDocument, } from 'src/qr/schemas/qr.schema';
import {
  DurianRegister,
  DurainRegisterDocument,
} from './schema/durian-register.schema';
import { InjectModel } from '@nestjs/mongoose';
import { QrMokup, QrMokupDocument } from 'src/qr/schema/qrmokup.schema';
import {
  ChinaRePackingProcess,
  ChinaRePackingProcessDocument,
} from 'src/schema/china-process/re-packing-process.schema';

@Injectable()
export class QrService {
  constructor(
    @InjectModel(DurianRegister.name)
    private readonly durianRegisterModel: Model<DurainRegisterDocument>,
    @InjectModel(QrMokup.name)
    private readonly qrMokupModel: Model<QrMokupDocument>,
    @InjectModel(ChinaRePackingProcess.name)
    private readonly ChinaRePackingProcessModel: Model<ChinaRePackingProcessDocument>,
  ) {}

  // //* [GET] /qr/productqr
  async findAll(rfid_code: string): Promise<any> {
    try {
      // let rfid: any = await this.durianRegisterModel
      //   .findOne({ fruit_code: rfid_code })
      //   .exec();
      // if (!rfid) {
      //   rfid = await this.durianRegisterModel.findOne({ rfid_code: rfid_code });
      // }
      const checkMatched = await this.ChinaRePackingProcessModel.find({
        packaging_id: rfid_code,
      })
        .select('rfid_codes packaging_id')
        .exec();

      const rfidCodes = checkMatched?.[0]?.rfid_code ?? rfid_code;
      // const packagingId = checkMatched?.[0]?.packaging_id ?? rfid_code;
      const matches = [rfid_code, rfidCodes];

      // console.log(checkMatched);
      // console.log(rfid_code);

      const aggregationResult = await this.durianRegisterModel.aggregate([
        {
          $match: {
            // rfid_code: rfid.rfid_code,
            // rfid_code: rfid_code,
            rfid_code: { $in: matches },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar: 1,
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
                  $arrayElemAt: ['$TreesRegistration_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  province_name_en: '$province',
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
                  $arrayElemAt: ['$OrchardRegistration_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },

        {
          $lookup: {
            from: 'CountSegmentsProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'CountSegmentsProcess_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  maturity: 1,
                  number_of_segments: 1,
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
                  $arrayElemAt: ['$CountSegmentsProcess_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },

        {
          $addFields: {
            registered_at: {
              $cond: {
                if: { $eq: ['$is_reject', true] },
                then: { $toDate: '$registered_at' },
                else: null,
              },
            },
            duration_ripeness: {
              $cond: {
                if: { $eq: ['$is_reject', true] },
                then: {
                  $round: [
                    {
                      $divide: [
                        {
                          $subtract: [new Date(), '$registered_at'],
                        },
                        1000 * 60 * 60 * 24,
                      ],
                    },
                    0,
                  ],
                },
                else: null,
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            fruit_code: 1,
            province_name_en: 1,
            cultivar: {
              $cond: [{ $gt: ['$cultivar', null] }, '$cultivar', null],
            },
            is_passed: 1,
            registered_at: 1,
            duration_ripeness: 1,
            maturity: 1,
          },
        },
      ]);

      if (aggregationResult.length === 0) {
        return {
          status: 'error',
          message: 'No entries found with the provided fruit code.',
          data: [],
        };
      }
      return {
        status: 'success',
        message: 'Get Product-qr successfully!',
        data: aggregationResult,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  // //TODO [GET] /qr/fruitstatus
  async getfruitstatus(rfid_code: string): Promise<any> {
    try {
      const rfid1: any = await this.durianRegisterModel
        .find({
          fruit_code: rfid_code,
        })
        .exec();
      const rfid2 = await this.ChinaRePackingProcessModel.find(
        { packaging_id: rfid_code },
        {},
        {
          projection: {
            _id: 0,
            rfid_codes: 1,
          },
        },
      ).exec();
      // console.log(rfid_code, rfid);
      // console.log(typeof rfid2);
      // console.log(rfid);
      // console.log(rfid2?.[0]?.rfid_codes);
      // console.log(Object.keys(rfid?.[0]));
      // console.log(Object.keys(rfid));

      const pipeline = [
        {
          $match: {
            rfid_code: { $in: [rfid1?.[0]?.rfid_code, rfid2?.[0]?.rfid_code] },
          },
        },
        {
          $project: {
            _id: 0,
            tree_code: 1,
            orchard_code: 1,
            packing_house_code: 1,
            rfid_code: 1,
            container_no: 1,
            inspected_grade: 1,
            inspected_by: 1,
            remarks: 1,
            status: 1,
            created_at: 1,
            updated_at: 1,
            registered_at: 1,
            fruit_code: 1,
            is_reject: 1,
          },
        },
        {
          $lookup: {
            from: 'ChemicalProcess3',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'ChemicalProcess3_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  timestamp_quality: '$created_at',
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
                  $arrayElemAt: ['$ChemicalProcess3_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'PackingProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'PackingProcess_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  timestamp_packing: '$created_at',
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
                  $arrayElemAt: ['$PackingProcess_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'ArrivedProcess',
            localField: 'container_no',
            foreignField: 'container_no',
            as: 'ArrivedProcess_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  timestamp_arrived: '$created_at',
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
                  $arrayElemAt: ['$ArrivedProcess_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'Transportation',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'Transportation_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  timestamp_departure: '$created_at',
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
                  $arrayElemAt: ['$Transportation_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            status_quality: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$timestamp_quality', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$ChemicalProcess3_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: true,
              },
            },
            timestamp_quality: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$status_quality', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$ChemicalProcess3_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: '$timestamp_quality',
              },
            },
          },
        },
        {
          $addFields: {
            status_packing: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$timestamp_packing', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$PackingProcess_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: true,
              },
            },
            timestamp_packing: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$status_packing', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$PackingProcess_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: '$timestamp_packing',
              },
            },
          },
        },
        {
          $addFields: {
            status_arrived: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$timestamp_arrived', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$ArrivedProcess_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: true,
              },
            },
            timestamp_arrived: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$status_arrived', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$ArrivedProcess_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: '$timestamp_arrived',
              },
            },
          },
        },
        {
          $addFields: {
            status_departure: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$timestamp_departure', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$Transportation_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: true,
              },
            },
            timestamp_departure: {
              $cond: {
                if: {
                  $or: [
                    {
                      $eq: ['$status_departure', null],
                    },
                    {
                      $eq: [
                        {
                          $size: '$Transportation_result',
                        },
                        0,
                      ],
                    },
                  ],
                },
                then: null,
                else: '$timestamp_departure',
              },
            },
          },
        },
        {
          $addFields: {
            best_before: {
              $add: [
                '$registered_at',
                {
                  // $multiply: [15, 24, 60, 60, 1000],
                  $multiply: [
                    {
                      $cond: [
                        {
                          $gte: [
                            '$registered_at',
                            new Date('2024-07-03 00:00:00'),
                          ],
                        },
                        13,
                        15,
                      ],
                    },
                    24,
                    60,
                    60,
                    1000,
                  ],
                },
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            timestamp_picking: '$registered_at',
            status_picking: '$is_reject',
            status_packing: 1,
            timestamp_packing: 1,
            status_arrived: 1,
            timestamp_arrived: 1,
            status_departure: 1,
            timestamp_departure: 1,
            best_before: 1,
            status_quality: 1,
            timestamp_quality: 1,
          },
        },
      ];

      const data = await this.durianRegisterModel.aggregate(pipeline);

      return {
        status: 'success',
        message: 'Get Status of durian successfully!',
        data: data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  // //* [GET] /qr/fruitcode
  async getfruitlevel(rfid_code: string): Promise<any> {
    try {
      const matchRfid = await this.ChinaRePackingProcessModel.find({
        packaging_id: rfid_code,
      })
        .select('rfid_codes packaging_id')
        .exec();
      let packagingId = '';
      if (matchRfid.length > 0) {
        packagingId = matchRfid?.[0]?.rfid_code ?? '';
      }
      let rfid: any = await this.durianRegisterModel
        .findOne({ fruit_code: { $in: [rfid_code, packagingId] } })
        .exec();
      if (!rfid) {
        rfid = await this.durianRegisterModel.findOne({
          rfid_code: { $in: [rfid_code, packagingId] },
        });
      }

      const currentDate: Date = new Date();
      if (process.platform !== 'win32')
        currentDate.setHours(currentDate.getHours() - 7);

      const pipeline: any[] = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $project: {
            registered_at: 1,
          },
        },
      ];
      const data: any[] = await this.durianRegisterModel
        .aggregate(pipeline)
        .exec();

      if (data.length === 0) {
        throw new Error('Fruit-code not found');
      }

      const registeredDate: Date = new Date(data[0].registered_at);
      // if(process.platform !== 'win32') {
      //   registeredDate.setHours(registeredDate.getHours() - 7);
      // }
      const diffTime: number = Math.abs(
        currentDate.getTime() - registeredDate.getTime(),
      );
      const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const levelsData: any[] = [];

      // Calculate end dates for each level
      // const start = new Date(registeredDate.getTime());
      // if (process.platform !== 'win32') {
      //   start.setHours(start.getHours() - 7);
      // }
      // const lvl1 = new Date(start);
      // const lvl2 = new Date(start);
      // const lvl3 = new Date(start);
      // const lvl4 = new Date(start);
      // lvl1.setDate(lvl1.getDate() + 5);
      // lvl2.setDate(lvl2.getDate() + 9);
      // lvl3.setDate(lvl3.getDate() + 12);
      // lvl4.setDate(lvl4.getDate() + 12);
      // const endDates: Date[] = [lvl1, lvl2, lvl3, lvl4];
      const endDates: Date[] = [
        new Date(registeredDate.getTime() + 5 * 24 * 60 * 60 * 1000),
        new Date(registeredDate.getTime() + 9 * 24 * 60 * 60 * 1000),
        new Date(registeredDate.getTime() + 12 * 24 * 60 * 60 * 1000),
        new Date(registeredDate.getTime() + 12 * 24 * 60 * 60 * 1000), // Level 4
      ];

      // console.log(endDates)

      // let current_level = null;

      for (let i = 0; i < endDates.length; i++) {
        if (i === endDates.length - 1) {
          levelsData.push({
            level: i + 1,
            start_date: endDates[i].toISOString(),
          });
        } else {
          const startDate =
            i === 0 ? registeredDate : new Date(endDates[i - 1].getTime() + 1);
          levelsData.push({
            level: i + 1,
            start_date: startDate.toISOString(),
            end_date: new Date(endDates[i].getTime() - 1).toISOString(),
          });
        }
      }

      let level_present = 0;
      if (diffDays > 2) {
        for (let i = 0; i < levelsData.length; i++) {
          if (diffDays > 0 && diffDays <= 2) {
            level_present = 0;
          } else if (diffDays > 2 && diffDays <= 5) {
            level_present = 1;
          } else if (diffDays > 5 && diffDays <= 9) {
            level_present = 2;
          } else if (diffDays > 9 && diffDays <= 12) {
            level_present = 3;
          } else if (diffDays > 12) {
            level_present = 4;
          }
        }
      }
      return {
        status: 'success',
        message: 'Get Fruit-level successfully!',
        data: [
          {
            current_level: level_present,
            levels: levelsData.length > 0 ? levelsData : [],
          },
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  // //* [GET] /qr/chinafruitlevel
  async getchinafruitlevel(rfid_code: string): Promise<any> {
    try {
      let rfid: any = await this.durianRegisterModel
        .findOne({ fruit_code: rfid_code })
        .exec();
      if (!rfid) {
        rfid = await this.durianRegisterModel.findOne({ rfid_code: rfid_code });
      }
      const currentDate: Date = new Date();
      if (process.platform !== 'win32')
        currentDate.setHours(currentDate.getHours() - 7);

      const pipeline: any[] = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $project: {
            registered_at: 1,
          },
        },
      ];
      const data: any[] = await this.durianRegisterModel
        .aggregate(pipeline)
        .exec();

      if (data.length === 0) {
        throw new Error('Fruit-code not found');
      }

      const registeredDate: Date = new Date(data[0].registered_at);
      const diffTime: number = Math.abs(
        currentDate.getTime() - registeredDate.getTime(),
      );
      const diffDays: number = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const levelsData: any[] = [];

      // Calculate end dates for each level
      const endDates: Date[] = [
        new Date(registeredDate.getTime() + 2 * 24 * 60 * 60 * 1000),
        new Date(registeredDate.getTime() + 4 * 24 * 60 * 60 * 1000),
        new Date(registeredDate.getTime() + 6 * 24 * 60 * 60 * 1000),
        new Date(registeredDate.getTime() + 8 * 24 * 60 * 60 * 1000),
      ];
      // let current_level = null;

      for (let i = 0; i < endDates.length; i++) {
        if (i === endDates.length - 1) {
          levelsData.push({
            level: i + 1,
            start_date: endDates[i].toISOString(),
          });
        } else {
          const startDate =
            i === 0 ? registeredDate : new Date(endDates[i - 1].getTime() + 1);
          levelsData.push({
            level: i + 1,
            start_date: startDate.toISOString(),
            end_date: new Date(endDates[i].getTime() - 1).toISOString(),
          });
        }
      }
      let level_present = 1;
      if (diffDays >= 0 && diffDays <= 2) {
        level_present = 1;
      } else if (diffDays > 3 && diffDays <= 4) {
        level_present = 2;
      } else if (diffDays > 5 && diffDays <= 6) {
        level_present = 3;
      } else if (diffDays > 7) {
        level_present = 4;
      }
      return {
        status: 'success',
        message: 'Get Fruit-level successfully!',
        data: [
          {
            current_level: level_present ?? null,
            levels: levelsData.length > 0 ? levelsData : [],
          },
        ],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  //? [GET] /qr/contact
  async getContact(rfid_code: string): Promise<any> {
    try {
      let rfid: any = await this.durianRegisterModel
        .findOne({ fruit_code: rfid_code })
        .exec();
      if (!rfid) {
        rfid = await this.durianRegisterModel.findOne({ rfid_code: rfid_code });
      }

      const pipeline = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  province: 1,
                  orchard_name: 1,
                  gap_img: 1,
                  gap_no: 1,
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
                  $arrayElemAt: ['$OrchardRegistration_result', 0],
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
            as: 'PackingHouseRegisteration_result',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  packing_house_name: 1,
                  du_no: 1,
                  du_img: 1,
                  cn_no: 1,
                  cn_img: 1,
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
                  $arrayElemAt: ['$PackingHouseRegisteration_result', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            // 'test': "Hello",
            province: 1,
            orchard_name: 1,
            gap_img: 1,
            gap_no: 1,
            packing_house_name: 1,
            du_no: 1,
            du_img: 1,
            cn_no: 1,
            cn_img: 1,
          },
        },
      ];

      const aggregationResult = await this.durianRegisterModel
        .aggregate(pipeline)
        .exec();

      return {
        status: 'success',
        message: 'Get contact information successfully!',
        data: aggregationResult.length > 0 ? aggregationResult : null,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  // //TODO [GET] /qr/mokup-fruitlevel
  async mokupfindAll(fruitcode: string): Promise<any> {
    try {
      const pipeline = [
        {
          $match: {
            fruit_code: fruitcode,
          },
        },
        {
          $project: {
            _id: 0,
            province_name_en: 1,
            fruit_code: 1,
            repiness: 1,
            is_passed: 1,
            registered_at: 1,
            duration_ripeness: 1,
            cultivar: 1,
          },
        },
      ];
      const aggregationResult = await this.qrMokupModel.aggregate(pipeline);

      if (aggregationResult.length === 0) {
        return {
          status: 'error',
          message: 'No entries found with the provided fruit code.',
          data: [],
        };
      }
      return {
        status: 'success',
        message: 'Get Product-qr successfully!',
        data: aggregationResult,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  // //TODO [GET] /qr/mokup-fruitcode
  async mokupgetfruitstatus(fruitcode: string): Promise<any> {
    try {
      const pipeline = [
        {
          $match: {
            fruit_code: fruitcode,
          },
        },
        {
          $project: {
            _id: 0,
            timestamp_departure: 1,
            timestamp_arrived: 1,
            timestamp_packing: 1,
            timestamp_quality: 1,
            status_quality: 1,
            status_packing: 1,
            status_arrived: 1,
            status_departure: 1,
            best_before: 1,
            status_picking: 1,
            timestamp_picking: 1,
          },
        },
      ];

      const data = await this.qrMokupModel.aggregate(pipeline).exec();

      return {
        status: 'success',
        message: 'Get Fruit-code successfully!',
        data: data.length > 0 ? data : null,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }

  // //TODO [GET] /qr/mokup-chinafruitlevel
  async mokupchinafruitlevel(fruitcode: string): Promise<any> {
    try {
      const pipeline = [
        {
          $match: {
            fruit_code: fruitcode,
          },
        },
        {
          $project: {
            _id: 0,
            current_level: 1,
            levels: 1,
          },
        },
      ];

      const data = await this.qrMokupModel.aggregate(pipeline).exec();

      return {
        status: 'success',
        message: 'Get Fruit-code successfully!',
        data: data.length > 0 ? data : null,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: null,
      };
    }
  }
}

//   level: level.level,
//   start_date: level.start_date,
//   end_date: level.end_date ? level.end_date : undefined
// }));

// const levelsData = formattedLevels.map(level => ({
//   'start_date': level.start_date,
//   'end_date': level.end_date,
//   'level': level.level
// }));

// {
//   '$addFields': {
//     'status_departure': {
//       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
//     },
//     'timestamp_departure': {
//       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
//     },
//     'best_before': {
//       '$dateAdd': {
//         'startDate': '$registered_at',
//         'unit': 'day',
//         'amount': 10
//       }
//     }
//   }
// },

// {
//   '$addFields': {
//     'status_arrived': {
//       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
//     },
//     'timestamp_arrived': {
//       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
//     }
//   }
// },

// {
//   '$addFields': {
//     'status_quality': {
//       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
//     },
//     'timestamp_quality': {
//       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
//     }
//   }
// },
// {
//   '$addFields': {
//     'status_packing': {
//       '$ifNull': ['$vwQualityControlsProcess_result.is_passed', null]
//     },
//     'timestamp_packing': {
//       '$ifNull': ['$vwQualityControlsProcess_result.created_at', null]
//     }
//   }
// },
