import { Injectable, BadRequestException, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { TJwtPayload } from 'src/types/jwt-payload';
import * as mongoose from 'mongoose';
import {
  CreateChemicalProcess1Dto,
  CreateChemicalProcess2Dto,
  CreateChemicalProcess3Dto,
  CreateCountSegmentsProcessDto,
  CreateWeightingsProcessDto,
  CreatePackingProcessDto,
  CreateFreezerProcessDto,
  CreateTransportationProcessDto,
} from './dto';
import {
  ChemicalProcess1,
  ChemicalProcess1Document,
  ChemicalProcess2,
  ChemicalProcess2Document,
  ChemicalProcess3,
  ChemicalProcess3Document,
  CountSegmentsProcess,
  CountSegmentsProcessDocument,
  WeightingsProcess,
  WeightingsProcessDocument,
  PackingProcess,
  PackingProcessDocument,
  FreezerProcess,
  FreezerProcessDocument,
  TransportationProcess,
  TransportationProcessDocument,
} from 'src/schema/packing-schemas';
import {
  DurianRegistration,
  DurianRegistrationDocument,
} from 'src/schema/durian-register';
import { GradeSettingService } from 'src/grade-setting/grade-setting.service';
import { EditWeightingsProcessDto } from './dto/edit-weightings-process.dto';

@Injectable()
export class PackingService {
  constructor(
    @InjectModel(ChemicalProcess1.name)
    private ChemicalProcess1Model: Model<ChemicalProcess1Document>,
    @InjectModel(ChemicalProcess2.name)
    private ChemicalProcess2Model: Model<ChemicalProcess2Document>,
    @InjectModel(ChemicalProcess3.name)
    private ChemicalProcess3Model: Model<ChemicalProcess3Document>,
    @InjectModel(CountSegmentsProcess.name)
    private CountSegmentsProcessModel: Model<CountSegmentsProcessDocument>,
    @InjectModel(WeightingsProcess.name)
    private WeightingsProcessModel: Model<WeightingsProcessDocument>,
    @InjectModel(PackingProcess.name)
    private PackingProcessModel: Model<PackingProcessDocument>,
    @InjectModel(FreezerProcess.name)
    private FreezerProcessModel: Model<FreezerProcessDocument>,
    @InjectModel(TransportationProcess.name)
    private TransportationProcessModel: Model<TransportationProcessDocument>,
    @InjectModel(DurianRegistration.name)
    private DurianRegistrationModel: Model<DurianRegistrationDocument>,
    @Inject(GradeSettingService) private readonly gradeSettingService: GradeSettingService

  ) { }

  async createChemicalProcess1(
    input: CreateChemicalProcess1Dto,
    decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');

      const documents = input.rfid_codes.map((rfid_code) => ({
        rfid_code,
        packing_house_code: input.packing_house_code,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      }));

      await this.ChemicalProcess1Model.insertMany(documents);

      return {
        status: 'success',
        message: 'Chemical process 1 created successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async createChemicalProcess2(
    input: CreateChemicalProcess2Dto,
    decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');

      const documents = input.rfid_codes.map((rfid_code) => ({
        rfid_code,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      }));

      await this.ChemicalProcess2Model.insertMany(documents);

      return {
        status: 'success',
        message: 'Chemical process 2 created successfully',
        data: [],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async createChemicalProcess3(
    input: CreateChemicalProcess3Dto,
    decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');

      const documents = input.rfid_codes.map((rfid_code) => ({
        rfid_code,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      }));

      await this.ChemicalProcess3Model.insertMany(documents);

      return {
        status: 'success',
        message: 'Chemical process 3 created successfully',
        data: [],
        // data: [{ inserted }],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async createCountSegmentsProcess(
    input: CreateCountSegmentsProcessDto,
    decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');

      // const documents = input.rfid_codes.map((rfid_code) => ({
      //   rfid_code,
      //   creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
      //     decoded.user_id,
      //   ),
      // }));

      // await this.ChemicalProcess3Model.insertMany(documents);
      const checkData = await this.DurianRegistrationModel.aggregate([
        {
          $match: {
            rfid_code: input.rfid_code,
            registered_at: {
              $ne: null,
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
          $project: {
            _id: 0,
            tree_code: 1,
            orchard_code: 1,
            maturity: 1,
            rfid_code: 1,
            fruit_code: 1,
            inspected_grade: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
          },
        },
      ]);

      if (checkData.length === 0) throw new BadRequestException('RFID code not found');

      const checkFruitCodeExists = await this.DurianRegistrationModel.find({ rfid_code: input.rfid_code })

      if (checkFruitCodeExists.length === 0) throw new BadRequestException('RFID code not found');

      const newDocument = new this.CountSegmentsProcessModel({
        rfid_code: input.rfid_code,
        fruit_code: checkData[0].fruit_code,
        tree_code: checkData[0].tree_code,
        inspected_grade: checkData[0].inspected_grade,
        maturity: input.maturity,
        number_of_segments: input.number_of_segments,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: new Date(),
      });

      await newDocument.save();

      return {
        status: 'success',
        message: 'Count segments created successfully',
        data: [],
        // data: [{ inserted }],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async createFreezerProcess(
    input: CreateFreezerProcessDto,
    // decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');

      const documents = input.rfid_codes.map((rfid_code) => ({
        rfid_code,
        // creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
        //   decoded.user_id,
        // ),
        creator_id: null,
      }));

      await this.FreezerProcessModel.insertMany(documents);

      return {
        status: 'success',
        message: 'Freezer created successfully',
        data: [],
        // data: [{ inserted }],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async createWeightingsProcess(
    input: CreateWeightingsProcessDto,
    decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');
      const checkData = await this.DurianRegistrationModel.aggregate([
        {
          $match: {
            rfid_code: input.rfid_code,
            registered_at: {
              $ne: null,
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
          $project: {
            _id: 0,
            tree_code: 1,
            orchard_code: 1,
            rfid_code: 1,
            fruit_code: 1,
            inspected_grade: 1,
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
          },
        },
      ]);

      if (checkData.length === 0) throw new BadRequestException('RFID code not found');

      const checkMaturity = await this.CountSegmentsProcessModel.aggregate([
        {
          $match: {
            rfid_code: input.rfid_code,
          },
        },
        {
          $project: {
            _id: 0,
            inspected_grade: 1,
            maturity: 1,
            number_of_segments: 1,
          },
        },

      ]);

      if (checkMaturity.length === 0) throw new BadRequestException('RFID code not found');

      const checkWeightingsExists = await this.WeightingsProcessModel.find({ rfid_code: input.rfid_code })

      const calGrade = await this.gradeSettingService.exportGrade(checkMaturity[0].inspected_grade, checkMaturity[0].number_of_segments, input.weight);
      if (checkWeightingsExists.length = 0) {

        const newDocument = new this.WeightingsProcessModel({
          rfid_code: input.rfid_code,
          fruit_code: checkData[0].fruit_code,
          tree_code: checkData[0].tree_code,
          inspected_grade: checkMaturity[0].inspected_grade,
          maturity: checkMaturity[0].maturity,
          number_of_segments: checkMaturity[0].number_of_segments,
          weight: input.weight,
          export_grade: calGrade.data[0].export_grade, //! Calculate export grade from system -----------------------------------------------
          creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
            decoded.user_id,
          ),
          created_at: new Date(),
        });

        await newDocument.save();


      } else {
        const updateData = await this.WeightingsProcessModel.updateOne({ rfid_code: input.rfid_code }, {
          $set: {
            fruit_code: checkData[0].fruit_code,
            tree_code: checkData[0].tree_code,
            inspected_grade: checkMaturity[0].inspected_grade,
            maturity: checkMaturity[0].maturity,
            number_of_segments: checkMaturity[0].number_of_segments,
            weight: input.weight,
            export_grade: calGrade.data[0].export_grade, //! Calculate export grade from system -----------------------------------------------
            creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
              decoded.user_id,
            ),
            updated_at: new Date(),

          }

        })
      }

      return {
        status: 'success',
        message: 'Weightings created successfully',
        data: [{ export_grade: calGrade.data[0].export_grade }],
      };


    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async createPackingProcess(
    input: CreatePackingProcessDto,
    decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');

      const documents = input.rfid_codes.map((rfid_code) => ({
        rfid_code,
        packaging_type: input.packaging_type,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      }));

      await this.PackingProcessModel.insertMany(documents);

      return {
        status: 'success',
        message: 'Packing created successfully',
        data: [],
        // data: [{ inserted }],
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

  async createTransportationProcess(
    input: CreateTransportationProcessDto,
    decoded: TJwtPayload,
  ) {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // if (checkRegisterExists.length === 0)
      //   throw new BadRequestException('Has not yet registered the fruit code');

      const documents = input.rfid_codes.map((rfid_code) => ({
        lot_id: '1234567890', //! ------- Generate lot_id from system
        rfid_code,
        booking_ref: input.booking_ref,
        origin: input.packing_house_code,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      }));

      await this.TransportationProcessModel.insertMany(documents);

      return {
        status: 'success',
        message: 'Transportation created successfully',
        data: [],
        // data: [{ inserted }],
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

  async getAllProcess(fruitCode: string) {
    try {
      const process = await this.DurianRegistrationModel.aggregate([
        {
          $match: {
            fruit_code: fruitCode,
            registered_at: {
              $ne: null,
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
                  cultivar: 1,
                  orchard_code: 1,
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
            from: 'OrchardRegisteration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegisteration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  orchard_name: 1,
                  sub_district: 1,
                  district: 1,
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
                  $arrayElemAt: ['$OrchardRegisteration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'vwQualityControlsProcess',
            localField: 'fruit_code',
            foreignField: 'fruit_code',
            as: 'vwQualityControlsProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  is_qc_passed: '$is_passed',
                  ng_cases: 1,
                  qc_created_at: {
                    $dateToString: {
                      date: '$created_at',
                      timezone: 'Asia/Bangkok',
                      format: '%Y-%m-%d %H:%M:%S',
                    },
                  },
                },
              },
              // {
              //   $unwind: '$ng_cases',
              // },
              // {
              //   $lookup: {
              //     from: 'NgCases',
              //     localField: 'ng_cases',
              //     foreignField: '_id',
              //     as: 'NgCases',
              //     pipeline: [
              //       {
              //         $project: {
              //           _id: 0,
              //           ng_case_name: '$case_name',
              //         },
              //       },
              //     ],
              //   },
              // },
              // {
              //   $replaceRoot: {
              //     newRoot: {
              //       $mergeObjects: [
              //         {
              //           $arrayElemAt: ['$NgCases', 0],
              //         },
              //         '$$ROOT',
              //       ],
              //     },
              //   },
              // },
              // {
              //   $group: {
              //     _id: {
              //       is_qc_passed: '$is_qc_passed',
              //       qc_created_at: '$qc_created_at',
              //     },
              //     ng_cases: {
              //       $push: {
              //         ng_case_id: {
              //           $toString: '$ng_cases',
              //         },
              //         ng_case_name: '$ng_case_name',
              //       },
              //     },
              //   },
              // },
              // {
              //   $project: {
              //     _id: 0,
              //     is_qc_passed: '$_id.is_qc_passed',
              //     qc_created_at: '$_id.qc_created_at',
              //     ng_cases: 1,
              //   },
              // },
            ],
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$vwQualityControlsProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'vwCoatingSolutionProcess',
            localField: 'fruit_code',
            foreignField: 'fruit_code',
            as: 'vwCoatingSolutionProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  coating_solution_created_at: {
                    $dateToString: {
                      date: '$created_at',
                      timezone: 'Asia/Bangkok',
                      format: '%Y-%m-%d %H:%M:%S',
                    },
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
                  $arrayElemAt: ['$vwCoatingSolutionProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'vwApplyHormonesProcess',
            localField: 'fruit_code',
            foreignField: 'fruit_code',
            as: 'vwApplyHormonesProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  apply_hormone_created_at: {
                    $dateToString: {
                      date: '$created_at',
                      timezone: 'Asia/Bangkok',
                      format: '%Y-%m-%d %H:%M:%S',
                    },
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
                  $arrayElemAt: ['$vwApplyHormonesProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'vwWeightingsProcess',
            localField: 'fruit_code',
            foreignField: 'fruit_code',
            as: 'vwWeightingsProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  weight: 1,
                  export_grade: 1,
                  number_of_segment: 1,
                  weightings_created_at: {
                    $dateToString: {
                      date: '$created_at',
                      timezone: 'Asia/Bangkok',
                      format: '%Y-%m-%d %H:%M:%S',
                    },
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
                  $arrayElemAt: ['$vwWeightingsProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'vwPackingProcess',
            localField: 'fruit_code',
            foreignField: 'fruit_code',
            as: 'vwPackingProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  packing_id: '$_id',
                  packing_created_at: {
                    $dateToString: {
                      date: '$created_at',
                      timezone: 'Asia/Bangkok',
                      format: '%Y-%m-%d %H:%M:%S',
                    },
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
                  $arrayElemAt: ['$vwPackingProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'vwArrivedProcess',
            localField: 'fruit_code',
            foreignField: 'fruit_code',
            as: 'vwArrivedProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  arrived_created_at: {
                    $dateToString: {
                      date: '$created_at',
                      timezone: 'Asia/Bangkok',
                      format: '%Y-%m-%d %H:%M:%S',
                    },
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
                  $arrayElemAt: ['$vwArrivedProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'PackingPictures',
            localField: 'packing_id',
            foreignField: 'packing_id',
            as: 'PackingPictures',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  picture: 1,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            rfid_code: 1,
            fruit_code: 1,
            tree_code: 1,
            lot_id: {
              $cond: [
                {
                  $gt: ['$lot_id', null],
                },
                '$lot_id',
                null,
              ],
            },
            cultivar: {
              $cond: [
                {
                  $gt: ['$cultivar', null],
                },
                '$cultivar',
                null,
              ],
            },
            orchard_name: {
              $cond: [
                {
                  $gt: ['$orchard_name', null],
                },
                '$orchard_name',
                null,
              ],
            },
            sub_district: {
              $cond: [
                {
                  $gt: ['$sub_district', null],
                },
                '$sub_district',
                null,
              ],
            },
            district: {
              $cond: [
                {
                  $gt: ['$district', null],
                },
                '$district',
                null,
              ],
            },
            province: {
              $cond: [
                {
                  $gt: ['$province', null],
                },
                '$province',
                null,
              ],
            },
            registered_at: {
              $dateToString: {
                date: '$registered_at',
                timezone: 'Asia/Bangkok',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
            weight: {
              $cond: [
                {
                  $gt: ['$weight', null],
                },
                '$weight',
                null,
              ],
            },
            inspected_grade: {
              $cond: [
                {
                  $gt: ['$inspected_grade', null],
                },
                '$inspected_grade',
                null,
              ],
            },
            export_grade: {
              $cond: [
                {
                  $gt: ['$export_grade', null],
                },
                '$export_grade',
                null,
              ],
            },
            maturity: 1,
            number_of_segment: {
              $cond: [
                {
                  $gt: ['$number_of_segment', null],
                },
                '$number_of_segment',
                null,
              ],
            },
            is_qc_passed: {
              $cond: [
                {
                  $gt: ['$is_qc_passed', null],
                },
                '$is_qc_passed',
                null,
              ],
            },
            ng_cases: {
              $cond: [
                {
                  $gt: ['$ng_cases', null],
                },
                '$ng_cases',
                [],
              ],
            },
            qc_created_at: {
              $cond: [
                {
                  $gt: ['$qc_created_at', null],
                },
                '$qc_created_at',
                null,
              ],
            },
            apply_hormone_created_at: {
              $cond: [
                {
                  $gt: ['$apply_hormone_created_at', null],
                },
                '$apply_hormone_created_at',
                null,
              ],
            },
            coating_solution_created_at: {
              $cond: [
                {
                  $gt: ['$coating_solution_created_at', null],
                },
                '$coating_solution_created_at',
                null,
              ],
            },
            weightings_created_at: {
              $cond: [
                {
                  $gt: ['$weightings_created_at', null],
                },
                '$weightings_created_at',
                null,
              ],
            },
            packing_created_at: {
              $cond: [
                {
                  $gt: ['$packing_created_at', null],
                },
                '$packing_created_at',
                null,
              ],
            },
            arrived_created_at: {
              $cond: [
                {
                  $gt: ['$arrived_created_at', null],
                },
                '$arrived_created_at',
                null,
              ],
            },
            packing_pictures: '$PackingPictures',
          },
        },
      ]);

      return {
        status: 'success',
        message: 'Process found',
        data: process,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async editWeightingsProcess(
    input: EditWeightingsProcessDto,
    decoded: TJwtPayload,
  ) {
    try {

      const checkWeightingsExists = await this.WeightingsProcessModel.find({ rfid_code: input.rfid_code })
      if (checkWeightingsExists.length === 0) throw new BadRequestException('RFID code not found');

      const updateData = await this.WeightingsProcessModel.updateOne({ rfid_code: input.rfid_code }, {
        $set: {
          inspected_grade: input.inspected_grade,
          number_of_segments: input.number_of_segments,
          weight: input.weight,
          export_grade: input.export_grade,
          updated_at: new Date(),
        }
      })


      return {
        status: 'success',
        message: 'Weightings edited successfully',
        data: [updateData],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }
}
