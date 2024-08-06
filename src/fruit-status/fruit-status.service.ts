import { Injectable } from '@nestjs/common';
import { DurianRegistration } from 'src/schema/durian-registration.schema';
import { Model, PipelineStage, mongo } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { HardwareDataCollection } from 'src/schema/hardware-data.schema';
import { ChemicalProcess1 } from 'src/schema/packing-schemas/chemical-process1.schema';
import { ChemicalProcess2 } from 'src/schema/packing-schemas/chemical-process2.schema';
import { ChemicalProcess3 } from 'src/schema/packing-schemas/chemical-process3.schema';
import { Packing } from 'src/schema/packing.schema';
import { Transportation } from 'src/schema/transportation.schema';
import { Departure } from 'src/schema/departure.schema';
import { Arrived, ArrivedDocument } from 'src/schema/arrived';
import { NgCases } from 'src/schema/ng-cases.schema';
import { Weightings } from 'src/schema/weightings.schema';
import { FreezerProcess } from 'src/schema/packing-schemas/freezer-process.schema';
import {
  RejectProcess,
  RejectProcessDocument,
} from 'src/schema/durian-process/reject-process.schema';
import {
  CountSegmentsProcess,
  CountSegmentsProcessDocument,
} from 'src/schema/packing-schemas/count-segments-process.schema';
import { TServiceResponse } from 'src/types/service-response';

import { FruitStatusDto, FruitStatusByCodeDto, FruitByReserveDto } from './dto';

@Injectable()
export class FruitStatusService {
  constructor(
    @InjectModel(DurianRegistration.name)
    private DurianRegisterModel: Model<DurianRegistration>,
    @InjectModel(HardwareDataCollection.name)
    private HardwareDataCollectionModel: Model<HardwareDataCollection>,
    @InjectModel(ChemicalProcess1.name)
    private ChemicalProcess1Model: Model<ChemicalProcess1>,
    @InjectModel(ChemicalProcess2.name)
    private ChemicalProcess2Model: Model<ChemicalProcess2>,
    @InjectModel(ChemicalProcess3.name)
    private ChemicalProcess3Model: Model<ChemicalProcess3>,
    @InjectModel(Weightings.name) private WeightingsModel: Model<Weightings>,
    @InjectModel(Packing.name) private PackingProcessModel: Model<Packing>,
    @InjectModel(FreezerProcess.name)
    private FreezerProcessModel: Model<FreezerProcess>,
    @InjectModel(Transportation.name)
    private TransportationModel: Model<Transportation>,
    @InjectModel(Departure.name) private departureModel: Model<Departure>,
    @InjectModel(Arrived.name) private ArrivedProcessModel: Model<Arrived>,
    @InjectModel(CountSegmentsProcess.name)
    private CountSegmentsProcessModel: Model<CountSegmentsProcessDocument>,
    @InjectModel(NgCases.name) private ngCasesModel: Model<NgCases>,
    @InjectModel(RejectProcess.name)
    private readonly RejectProcessModel: Model<RejectProcessDocument>,
    @InjectModel(Arrived.name) private ArrivedModel: Model<ArrivedDocument>,
  ) {}

  // [POST] harvest
  async HarvestProcess(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      // const chemi1 = await this.ChemicalProcess1Model.find();
      // const rfids = chemi1.map((item) => item.rfid_code);

      // pagination
      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $match: {
            created_at: {
              $gte: from,
              $lte: to,
            },
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            created_at: 1,
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            total: 1,
            date: {
              $dateToString: {
                date: '$created_at',
                timezone: 'Asia/Bangkok',
                format: '%Y-%m-%d',
              },
            },

            air_co2: null,
            air_humidity: null,
            air_noise: null,
            air_pressure: null,
            air_temperature: null,
            rain_counter: null,
            rain_volumn: null,
            soil_conductivity: null,
            soil_moisture: null,
            soil_nitrogen: null,
            soil_phosphorus: null,
            soil_potassium: null,
            soil_salinity: null,
            soil_temp: null,
            soil_pH: null,
          },
        },
      ];
      const harvestData = await this.DurianRegisterModel.aggregate(pipeline);

      // const hardwareData = await this.HardwareDataCollectionModel.find({
      //   created_at
      // });
      /*

      if (harvestData.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      // query hardware data separately
      for (const i of harvestData?.[0]?.data) {
        const start = new Date(`${i.date} 00:00:00`);
        const end = new Date(`${i.date} 23:59:59`);
        if (process.platform !== 'win32') {
          start.setHours(start.getHours() - 7);
          end.setHours(end.getHours() - 7);
        }
        const hw = await this.HardwareDataCollectionModel.aggregate([
          {
            $match: {
              created_at: {
                $gte: start,
                $lte: end,
              },
            },
          },
          {
            $sort: {
              created_at: -1,
            },
          },
          {
            $limit: 1,
          },
        ]);

        if (hw.length === 0) {
          i.air_co2 = null;
          i.air_humidity = null;
          i.air_noise = null;
          i.air_pressure = null;
          i.air_temperature = null;
          i.rain_counter = null;
          i.rain_volumn = null;
          i.soil_conductivity = null;
          i.soil_moisture = null;
          i.soil_nitrogen = null;
          i.soil_phosphorus = null;
          i.soil_potassium = null;
          i.soil_salinity = null;
          i.soil_temp = null;
          i.soil_pH = null;
        } else {
          i.air_co2 = hw[0].data['Air_CO2'];
          i.air_humidity = hw[0].data['Air_Humidity'];
          i.air_noise = hw[0].data['Air_Noise'];
          i.air_pressure = hw[0].data['Air_Pressure'];
          i.air_temperature = hw[0].data['Air_Temperature'];
          i.rain_counter = hw[0].data['Rain_Counter'];
          i.rain_volumn = hw[0].data['Rain_Volumn'];
          i.soil_conductivity = hw[0].data['Soil_Conductivity'];
          i.soil_moisture = hw[0].data['Soil_Moisture'];
          i.soil_nitrogen = hw[0].data['Soil_Nitrogen'];
          i.soil_phosphorus = hw[0].data['Soil_Phosphorus'];
          i.soil_potassium = hw[0].data['Soil_Potassium'];
          i.soil_salinity = hw[0].data['Soil_Salinity'];
          i.soil_temp = hw[0].data['Soil_Temp'];
          i.soil_pH = hw[0].data['Soil_pH'];
        }
      }

      const tableData = {
        count: harvestData?.[0]?.count,
        table: harvestData?.[0]?.data,
      };
      */

      const tableData = {
        count: harvestData?.at(0)?.total ?? 0,
        table: harvestData,
      };

      // const vw = await this.HardwareDataCollectionModel.find();
      // console.log(vw);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get harvest data',
        data: [tableData],
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

  // [POST] chemical-process-1
  async ChemicalProcess1(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      // const chemi2 = await this.ChemicalProcess2Model.find();
      // const rfids = chemi2.map((item) => item.rfid_code);

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'ChemicalProcess1',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'ChemicalProcess1',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$ChemicalProcess1', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$ChemicalProcess1',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
            hormone_formula: 'DEMETER Formula 1',
          },
        },
      ];
      const chemical1Process =
        await this.DurianRegisterModel.aggregate(pipeline);

      if (chemical1Process.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: chemical1Process?.at(0)?.total ?? 0,
        table: chemical1Process,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get chemical process 1 data',
        data: [tableData],
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

  // [POST] chemical-process-2
  async ChemicalProcess2(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      // const chemi3 = await this.ChemicalProcess3Model.find();
      // const rfids = chemi3.map((item) => item.rfid_code);

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'ChemicalProcess2',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'ChemicalProcess2',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$ChemicalProcess2', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$ChemicalProcess2',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
            hormone_formula: 'DEMETER Formula 2',
          },
        },
      ];
      const chemical2Process =
        await this.DurianRegisterModel.aggregate(pipeline);

      if (chemical2Process.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: chemical2Process?.at(0)?.total ?? 0,
        table: chemical2Process,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get chemical process 2 data',
        data: [tableData],
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

  // [POST] chemical-process-3
  async ChemicalProcess3(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      // const weight = await this.WeightingsModel.find();
      // const rfids = weight.map((item) => item.rfid_code);

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'ChemicalProcess3',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'ChemicalProcess3',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$ChemicalProcess3', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$ChemicalProcess3',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
            hormone_formula: 'DEMETER Formula 2',
          },
        },
      ];
      const chemical3Process =
        await this.DurianRegisterModel.aggregate(pipeline);

      if (chemical3Process.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: chemical3Process?.at(0)?.total ?? 0,
        table: chemical3Process,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get chemical process 3 data',
        data: [tableData],
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

  // [POST] weighting
  async WeightingProcess(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }
      // const packing = await this.PackingProcessModel.find();
      // const rfids = packing.map((item) => item.rfid_code);

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'WeightingsProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'WeightingsProcess',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$ChemicalProcess1', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$WeightingsProcess',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            weight: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
          },
        },
      ];
      const weightingProcess =
        await this.DurianRegisterModel.aggregate(pipeline);

      if (weightingProcess.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: weightingProcess?.at(0)?.total ?? 0,
        table: weightingProcess,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get weighting process data',
        data: [tableData],
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

  // [POST] packing
  async PackingProcess(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      // const freezer = await this.FreezerProcessModel.find();
      // const rfidsF = freezer.map((item) => item.rfid_code);
      // const transport = await this.TransportationModel.find();
      // const rfidT: any[] = [];
      // for (const i of transport) {
      //   rfidT.concat(i.rfid_code);
      // }
      // const rfids = rfidsF.concat(rfidT);

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'PackingProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'PackingProcess',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$PackingProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$PackingProcess',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            weight: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
          },
        },
      ];
      const packingProcess = await this.DurianRegisterModel.aggregate(pipeline);

      if (packingProcess.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: packingProcess?.at(0)?.total ?? 0,
        table: packingProcess,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get packing process data',
        data: [tableData],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: 'Successfully get packing process data',
        data: [],
      };
    }
  }

  // [POST] freeze
  async FreezerProcess(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      // const transport = await this.TransportationModel.find();
      // const rfids = transport.map((item) => item.rfid_code);

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'FreezerProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'FreezerProcess',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$FreezerProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$FreezerProcess',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            weight: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
          },
        },
      ];
      const freezerProcess = await this.DurianRegisterModel.aggregate(pipeline);

      if (freezerProcess.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: freezerProcess?.at(0)?.total ?? 0,
        table: freezerProcess,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get freezer process data',
        data: [tableData],
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

  // [POST] transportation
  async TransportationProcess(
    request: FruitStatusDto,
  ): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      // const arrived = await this.arrivedModel.find();
      // const rfids = arrived.map((item) => item.rfid_code);

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'Transportation',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'Transportation',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$Transportation', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$Transportation',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $lookup: {
            from: 'ReserveTransportation',
            localField: 'reserve_id',
            foreignField: '_id',
            as: 'ReserveTransportation',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  transport_name: '$freight_forwarder',
                  transport_type: '$export_type',
                  departure_time: '$date_time',
                  air_line: 1,
                  flight: 1,
                  flight_departure_time: '$flight_depart_date',
                  flight_arrive_time: '$flight_arrive_date',
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
                  $arrayElemAt: ['$ReserveTransportation', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            // weight: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
            transport_name: {
              $ifNull: ['$transport_name', null],
            },
            transport_type: {
              $ifNull: ['$transport_type', null],
            },
            departure_time: {
              $ifNull: ['$departure_time', null],
            },
            air_line: {
              $ifNull: ['$air_line', null],
            },
            flight: {
              $ifNull: ['$flight', null],
            },
            flight_departure_time: {
              $ifNull: ['$flight_departure_time', null],
            },
            flight_arrive_time: {
              $ifNull: ['$flight_arrive_time', null],
            },
          },
        },
      ];
      const transportationProcess =
        await this.DurianRegisterModel.aggregate(pipeline);

      if (transportationProcess.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: transportationProcess?.at(0)?.total ?? 0,
        table: transportationProcess,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get transportation process data',
        data: [tableData],
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

  // [POST] arrival
  async ArrivalProcess(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'QAProcess',
            let: {
              reserve_id: '$reserve_id',
              container_no: '$container_no',
            },
            as: 'QAProcess',
            pipeline: [
              {
                $match: {
                  qa_process: 'QA container receiving',
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $match: {
                  $and: [
                    {
                      $expr: {
                        $eq: ['$reserve_id', '$$reserve_id'],
                      },
                    },
                    {
                      $expr: {
                        $eq: ['$container_no', '$$container_no'],
                      },
                    },
                  ],
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
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
                  $arrayElemAt: ['$QAProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$QAProcess',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            weight: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            export_grade: '$inspected_grade',
            importer_name: 'Herun Technology (Yunnan) Co., Ltd.',
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
          },
        },
      ];
      const arricedProcess = await this.DurianRegisterModel.aggregate(pipeline);

      if (arricedProcess.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: arricedProcess?.at(0)?.total ?? 0,
        table: arricedProcess,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get arrived process data',
        data: [tableData],
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

  // [POST] reject
  async RejectedProcess(request: FruitStatusDto): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (request.period.toLowerCase() === 'daily') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.from} 23:59:59`);
      } else if (request.period.toLowerCase() === 'period') {
        from = new Date(`${request.from} 00:00:00`);
        to = new Date(`${request.to} 23:59:59`);
      } else if (request.period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(request.from).getFullYear()}-${String(new Date(request.from).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(request.from).getFullYear(),
          new Date(request.from).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      // if not windows, convert to UTC+0
      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      const page = request.page;
      const pageSize = 1000;

      const pipeline: PipelineStage[] = [
        {
          $lookup: {
            from: 'RejectProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'RejectProcess',
            pipeline: [
              {
                $match: {
                  created_at: {
                    $gte: from,
                    $lte: to,
                  },
                },
              },
              {
                $project: {
                  _id: 0,
                  timestamp: '$created_at',
                  reject_reason: 1,
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
                  $arrayElemAt: ['$RejectProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $addFields: {
            matched: {
              $cond: [
                {
                  $gte: [
                    {
                      $size: '$RejectProcess',
                    },
                    1,
                  ],
                },
                true,
                false,
              ],
            },
          },
        },
        {
          $match: {
            matched: true,
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
        {
          $facet: {
            metadata: [
              {
                $count: 'total',
              },
            ],
            data: [
              {
                $skip: (page /* Page No */ - 1) * pageSize /* Page Size */,
              },
              {
                $limit: pageSize /* Page Size */,
              },
            ],
          },
        },
        {
          $unwind: '$data',
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                '$data',
                {
                  $arrayElemAt: ['$metadata', 0],
                },
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'TreesRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  cultivar_id: 1,
                },
              },
              {
                $lookup: {
                  from: 'Cultivar',
                  localField: 'cultivar_id',
                  foreignField: '_id',
                  as: 'Cultivar',
                  pipeline: [
                    {
                      $project: {
                        _id: 0,
                        cultivar: '$cultivar_en',
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
                        $arrayElemAt: ['$Cultivar', 0],
                      },
                      '$$ROOT',
                    ],
                  },
                },
              },
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
                  $arrayElemAt: ['$TreesRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $project: {
            _id: 0,
            total: 1,
            rfid_code: 1,
            tree_code: 1,
            orchard_code: 1,
            orchard_name: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            weight: 1,
            timestamp: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            container_no: 1,
            export_grade: '$inspected_grade',
            remarks: '$reject_reason',
            // date: {
            //   $dateToString: {
            //     date: "$created_at",
            //     timezone: "Asia/Bangkok",
            //     format: "%Y-%m-%d"
            //   }
            // },
          },
        },
      ];
      const rejectProcess = await this.DurianRegisterModel.aggregate(pipeline);

      if (rejectProcess.length === 0)
        return {
          status: 'success',
          statusCode: 200,
          message: 'No data found',
          data: [],
        };

      const tableData = {
        count: rejectProcess?.at(0)?.total ?? 0,
        table: rejectProcess,
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get reject process data',
        data: [tableData],
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

  // [GET] all pages
  async AllPages(
    period: string,
    fromDate: string,
    toDate: string,
  ): Promise<TServiceResponse> {
    try {
      let from: Date;
      let to: Date;
      if (period.toLowerCase() === 'daily') {
        from = new Date(`${fromDate} 00:00:00`);
        to = new Date(`${fromDate} 23:59:59`);
      } else if (period.toLowerCase() === 'period') {
        from = new Date(`${fromDate} 00:00:00`);
        to = new Date(`${toDate} 23:59:59`);
      } else if (period.toLowerCase() === 'monthly') {
        from = new Date(
          `${new Date(fromDate).getFullYear()}-${String(new Date(fromDate).getMonth() + 1).padStart(0, '2')}-01 00:00:00`,
        );
        const lastDay = new Date(
          new Date(fromDate).getFullYear(),
          new Date(fromDate).getMonth() + 1,
          0,
        );
        to = new Date(
          `${lastDay.getFullYear()}-${String(lastDay.getMonth() + 1).padStart(0, '2')}-${String(lastDay.getDate()).padStart(0, '2')} 23:59:59`,
        );
      }

      if (process.platform !== 'win32') {
        from.setHours(from.getHours() - 7);
        to.setHours(to.getHours() - 7);
      }

      const pageSize = 1000;

      // harvest
      const harvestDocs = await this.DurianRegisterModel.find({
        created_at: { $gte: from, $lte: to },
      }).select('-_id rfid_code');

      const rfidCodes = harvestDocs.map((item) => item.rfid_code);

      const chemical1Docs = await this.ChemicalProcess1Model.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const chemical2Docs = await this.ChemicalProcess2Model.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const chemical3Docs = await this.ChemicalProcess3Model.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const weightingDocs = await this.WeightingsModel.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const qcDocs = await this.CountSegmentsProcessModel.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const packingDocs = await this.PackingProcessModel.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const freezerDocs = await this.FreezerProcessModel.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const transportationDocs = await this.TransportationModel.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const arrivalDocs = await this.ArrivedProcessModel.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();
      const rejectDocs = await this.RejectProcessModel.find({
        rfid_code: { $in: rfidCodes },
      }).countDocuments();

      const pageCount = {
        harvest_page: Math.ceil(harvestDocs.length / pageSize),
        chemical1_page: Math.ceil(chemical1Docs / pageSize),
        chemical2_page: Math.ceil(chemical2Docs / pageSize),
        chemical3_page: Math.ceil(chemical3Docs / pageSize),
        weighting_page: Math.ceil(weightingDocs / pageSize),
        qc_page: Math.ceil(qcDocs / pageSize),
        packing_page: Math.ceil(packingDocs / pageSize),
        freezer_page: Math.ceil(freezerDocs / pageSize),
        transportation_page: Math.ceil(transportationDocs / pageSize),
        arrival_page: Math.ceil(arrivalDocs / pageSize),
        reject_page: Math.ceil(rejectDocs / pageSize),
      };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Successfully get all pages',
        // data: [{ harvests: harvestDocs.length, rfidCodes }],
        data: [pageCount],
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

  // [POST] all status for specidic fruit
  async FruitStatusByCode(
    validator: FruitStatusByCodeDto,
  ): Promise<TServiceResponse> {
    try {
      // get rfid code from fruit code
      let rfid: any = await this.DurianRegisterModel.findOne({
        rfid_code: validator.rfid_code,
      }).exec();
      if (!rfid) {
        rfid = await this.DurianRegisterModel.findOne({
          rfid_code: validator.rfid_code,
        });
      }

      // harvest
      const pipelineHarvest = [
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
            as: 'orchard_registeration',
          },
        },
        {
          $unwind: '$orchard_registeration',
        },
        {
          $lookup: {
            from: 'TreesRegistration',
            localField: 'tree_code',
            foreignField: 'tree_code',
            as: 'trees_registration',
          },
        },
        {
          $unwind: '$trees_registration',
        },
        {
          $project: {
            _id: 0,
            harvest: '$registered_at',
            orchard_name: '$orchard_registeration.orchard_name',
            orchard_code: 1,
            tree_code: 1,
            maturity: 1,
            number_of_segments: 1,
            cultivar: '$trees_registration.cultivar',
            province: '$orchard_registeration.province',
          },
        },
      ];

      // chemical 1
      const pipelineChemical1 = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $lookup: {
            from: 'PackingHouseRegisteration',
            localField: 'packing_house_code',
            foreignField: 'packing_house_code',
            as: 'packing_house_registeration',
          },
        },
        {
          $unwind: '$packing_house_registeration',
        },
        {
          $project: {
            _id: 0,
            chemical_process1: '$created_at',
            ph_name: '$packing_house_registeration.packing_house_name',
            ph_code: '$packing_house_registeration.packing_house_code',
            hormone: 'DEMETER Formula 1',
          },
        },
      ];

      // chemical 2
      const pipelineChemical2 = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $project: {
            _id: 0,
            chemical_process2: '$created_at',
            solution: 'DEMETER Formula 2',
          },
        },
      ];

      // chemical 3
      const pipelineChemical3 = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $project: {
            _id: 0,
            chemical_process3: '$created_at',
            hormone: 'DEMETER Formula 3',
          },
        },
      ];

      // weighting
      const pipelineWeighting = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $lookup: {
            from: 'DurianRegistration',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'durian_registration',
          },
        },
        {
          $unwind: '$durian_registration',
        },
        {
          $project: {
            _id: 0,
            weighting: '$created_at',
            weight: 1,
            export_grade: '$durian_registration.inspected_grade',
          },
        },
      ];

      // packing
      const pipelinePacking = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
          },
        },
        {
          $project: {
            _id: 0,
            packing: '$created_at',
            packaging_type: 1,
          },
        },
      ];

      // freezer
      const pipelineFreezer = [
        {
          $match: {
            rfid_code: rfid.rfid_code,
            // 'rfid_code': { $in: [rfid.rfid_code] }
          },
        },
        {
          $project: {
            _id: 0,
            freezer: '$created_at',
          },
        },
      ];

      // transportation
      const pipelineTransPortation = [
        {
          $match: {
            rfid_code: validator.rfid_code,
          },
        },
        {
          $lookup: {
            from: 'ReserveTransportation',
            localField: 'reserve_id',
            foreignField: '_id',
            as: 'reserve_transportation',
          },
        },
        {
          $unwind: '$reserve_transportation',
        },
        {
          $project: {
            _id: 0,
            transportation: '$created_at',
            delivery_name: {
              $ifNull: ['$reserve_transportation.freight_forwarder', null],
            },
            container_no: 1,
            depart_date: {
              $ifNull: ['$reserve_transportation.date_time', null],
            },
            departure_type: {
              $ifNull: ['$reserve_transportation.export_type', null],
            },
          },
        },
      ];

      // arrival
      const pipelineArrival = [
        {
          $match: {
            container_no: rfid.container_no,
          },
        },
        {
          $project: {
            _id: 0,
            arrived_to_chaina: '$created_at',
            arrive_date: '$created_at',
            importer: 'Herun Technology (Yunnan) Co., Ltd.',
          },
        },
      ];

      const harvest = await this.DurianRegisterModel.aggregate(pipelineHarvest);
      const chemical1 =
        await this.ChemicalProcess1Model.aggregate(pipelineChemical1);
      const chemical1Data = chemical1.length === 0 ? null : chemical1[0];
      const chemical2 =
        await this.ChemicalProcess2Model.aggregate(pipelineChemical2);
      const chemical2Data = chemical2.length === 0 ? null : chemical2[0];
      const chemical3 =
        await this.ChemicalProcess3Model.aggregate(pipelineChemical3);
      const chemical3Data = chemical3.length === 0 ? null : chemical3[0];
      const weightings =
        await this.WeightingsModel.aggregate(pipelineWeighting);
      const weightingsData = weightings.length === 0 ? null : weightings[0];
      const packing = await this.PackingProcessModel.aggregate(pipelinePacking);
      const packingData = packing.length === 0 ? null : packing[0];
      const freezer = await this.FreezerProcessModel.aggregate(pipelineFreezer);
      const freezerData = freezer.length === 0 ? null : freezer[0];
      const transportation = await this.TransportationModel.aggregate(
        pipelineTransPortation,
      );
      const transportationData =
        transportation.length === 0 ? null : transportation[0];
      const arrived = await this.ArrivedProcessModel.aggregate(pipelineArrival);
      const arrivedData = arrived.length === 0 ? null : arrived[0];

      // calculate progress
      const progressNo =
        arrived.length !== 0
          ? 9
          : harvest.length === 0
            ? 0
            : chemical1.length === 0
              ? 1
              : chemical2.length === 0
                ? 2
                : chemical3.length === 0
                  ? 3
                  : weightings.length === 0
                    ? 4
                    : packing.length === 0
                      ? 5
                      : freezer.length === 0 && transportation.length === 0
                        ? 6
                        : transportation.length === 0
                          ? 7
                          : arrived.length === 0
                            ? 8
                            : 9;

      return {
        status: 'success',
        statusCode: 200,
        message: 'Flow',
        data: [
          {
            progress_no: progressNo,
            harvest: harvest[0],
            chemical1: chemical1Data,
            chemical2: chemical2Data,
            chemical3: chemical3Data,
            weighting: weightingsData,
            packing: packingData,
            freezer: freezerData,
            transportation: transportationData,
            arrived: arrivedData,
          },
        ],
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

  async getDurianByReserve(
    validator: FruitByReserveDto,
  ): Promise<TServiceResponse> {
    try {
      const matchStage = Boolean(validator.container_no)
        ? {
            reserve_id: mongo.BSON.ObjectId.createFromHexString(
              validator.reserve_id,
            ),
            container_no: validator.container_no,
          }
        : { reserve_id: validator.reserve_id };

      const pipeline: PipelineStage[] = [
        {
          $match: matchStage,
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
                },
                '$$ROOT',
              ],
            },
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
          $lookup: {
            from: 'ReserveTransportation',
            localField: 'reserve_id',
            foreignField: '_id',
            as: 'ReserveTransportation',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  destination: 1,
                  container_type: 1,
                  booking_ref: 1,
                  export_type: 1,
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
                  $arrayElemAt: ['$ReserveTransportation', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            rfid_code: 1,
            orchard_code: 1,
            tree_code: 1,
            packing_house_code: 1,
            packing_house_name: {
              $cond: [
                {
                  $gt: ['$packing_house_name', null],
                },
                '$packing_house_name',
                null,
              ],
            },
            reserve_id: {
              $toString: '$reserve_id',
            },
            destination: {
              $cond: [
                {
                  $gt: ['$destination', null],
                },
                '$destination',
                null,
              ],
            },
            container_type: {
              $cond: [
                {
                  $gt: ['$container_type', null],
                },
                '$container_type',
                null,
              ],
            },
            booking_ref: {
              $cond: [
                {
                  $gt: ['$booking_ref', null],
                },
                '$booking_ref',
                null,
              ],
            },
            export_type: {
              $cond: [
                {
                  $gt: ['$export_type', null],
                },
                '$export_type',
                null,
              ],
            },
            container_no: 1,
            inspected_grade: 1,
            maturity: 1,
            weight: 1,
            number_of_segments: 1,
            registered_at: {
              $dateToString: {
                date: '$registered_at',
                timezone: 'Asia/Bangkok',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
          },
        },
        {
          $sort: {
            registered_at: -1,
          },
        },
      ];

      const results = await this.DurianRegisterModel.aggregate(pipeline);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Fruit by reserve',
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
}
