import { Injectable, Inject } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, mongo } from 'mongoose';
import { TJwtPayload } from 'src/types/jwt-payload';
import { TServiceResponse } from 'src/types/service-response';
import * as mongoose from 'mongoose';
import {
  CreateChemicalProcess1Dto,
  CreateChemicalProcess2Dto,
  CreateChemicalProcess3Dto,
  CreateCountSegmentsProcessDto,
  CreateWeightingsProcessDto,
  CreatePackingProcessDto,
  CreatePackingProcess2Dto,
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
  Transportation,
  TransportationDocument,
} from 'src/schema/packing-schemas';
import {
  DurianRegistration,
  DurianRegistrationDocument,
} from 'src/schema/durian-register';
import { GradeSettingService } from 'src/grade-setting/grade-setting.service';
import { EditWeightingsProcessDto } from './dto/edit-weightings-process.dto';
import axios from 'axios';

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
    @InjectModel(Transportation.name)
    private TransportationModel: Model<TransportationDocument>,
    @InjectModel(DurianRegistration.name)
    private DurianRegistrationModel: Model<DurianRegistrationDocument>,
    @Inject(GradeSettingService)
    private readonly gradeSettingService: GradeSettingService,
  ) {}

  async createChemicalProcess1(
    input: CreateChemicalProcess1Dto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Bypass check register exists
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkExistsIds = await this.ChemicalProcess1Model.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');
      const updateRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);
      const insertRfidCodes = input.rfid_codes.filter(
        (rfid) => !updateRfidCodes.includes(rfid),
      );

      const insertDocuments = insertRfidCodes.map((rfid_code) => ({
        packing_house_code: input.packing_house_code,
        rfid_code,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      }));

      if (insertRfidCodes.length > 0)
        await this.ChemicalProcess1Model.insertMany(insertDocuments);

      if (updateRfidCodes.length > 0)
        await this.ChemicalProcess1Model.updateMany(
          { rfid_code: { $in: updateRfidCodes } },
          {
            $set: {
              packing_house_code: input.packing_house_code,
              updated_at: now,
            },
          },
        );

      await this.DurianRegistrationModel.updateMany(
        { rfid_code: { $in: input.rfid_codes } },
        {
          $set: {
            packing_house_code: input.packing_house_code,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Chemical process 1 created successfully',
        data: [{ updated: updateRfidCodes, inserted: insertRfidCodes }],
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

  async createChemicalProcess2(
    input: CreateChemicalProcess2Dto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Bypass check register exists
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkExistsIds = await this.ChemicalProcess2Model.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');
      const updateRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);
      const insertRfidCodes = input.rfid_codes.filter(
        (rfid) => !updateRfidCodes.includes(rfid),
      );

      const insertDocuments = insertRfidCodes.map((rfid_code) => ({
        rfid_code,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      }));

      if (insertRfidCodes.length > 0)
        await this.ChemicalProcess2Model.insertMany(insertDocuments);

      if (updateRfidCodes.length > 0)
        await this.ChemicalProcess2Model.updateMany(
          { rfid_code: { $in: updateRfidCodes } },
          {
            $set: {
              updated_at: now,
            },
          },
        );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Chemical process 2 created successfully',
        data: [{ updated: updateRfidCodes, inserted: insertRfidCodes }],
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

  async createChemicalProcess3(
    input: CreateChemicalProcess3Dto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Bypass check register exists
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkExistsIds = await this.ChemicalProcess3Model.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');
      const updateRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);
      const insertRfidCodes = input.rfid_codes.filter(
        (rfid) => !updateRfidCodes.includes(rfid),
      );

      const insertDocuments = insertRfidCodes.map((rfid_code) => ({
        rfid_code,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      }));

      if (insertRfidCodes.length > 0)
        await this.ChemicalProcess3Model.insertMany(insertDocuments);

      if (updateRfidCodes.length > 0)
        await this.ChemicalProcess3Model.updateMany(
          { rfid_code: { $in: updateRfidCodes } },
          {
            $set: {
              updated_at: now,
            },
          },
        );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Chemical process 3 created successfully',
        data: [{ updated: updateRfidCodes, inserted: insertRfidCodes }],
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

  async createCountSegmentsProcess(
    input: CreateCountSegmentsProcessDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Bypass check register exists
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      // prevent duplicate rfid
      const checkExistsIds = await this.CountSegmentsProcessModel.findOne({
        rfid_code: input.rfid_code,
      });

      const saved = Boolean(checkExistsIds)
        ? await this.CountSegmentsProcessModel.updateMany(
            { rfid_code: input.rfid_code },
            {
              maturity: input.maturity,
              number_of_segments: input.number_of_segments,
              updated_at: now,
            },
          )
        : await this.CountSegmentsProcessModel.create({
            rfid_code: input.rfid_code,
            maturity: input.maturity,
            number_of_segments: input.number_of_segments,
            creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
              decoded.user_id,
            ),
            created_at: now,
            updated_at: now,
          });

      const updated = await this.DurianRegistrationModel.updateOne(
        { rfid_code: input.rfid_code },
        {
          $set: {
            maturity: input.maturity,
            number_of_segments: input.number_of_segments,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Count segments created successfully',
        data: [
          { action: Boolean(checkExistsIds) ? 'update' : 'insert', saved },
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

  async createFreezerProcess(
    input: CreateFreezerProcessDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkExistsIds = await this.FreezerProcessModel.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');

      const existsRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);
      const countRfidCodes = input.rfid_codes?.length ?? 0;
      const countRfidTimestamp = input.timestamp?.length ?? 0;
      const mergeData =
        countRfidCodes <= countRfidTimestamp
          ? input.rfid_codes?.map((item, i) => ({
              rfid_code: item,
              timestamp: input.timestamp[i],
            }))
          : input.timestamp?.map((item, i) => ({
              rfid_code: input.rfid_codes[i],
              timestamp: item,
            }));

      const insertDocuments = mergeData
        .filter((item) => !existsRfidCodes.includes(item.rfid_code))
        .map((item) => ({
          rfid_code: item.rfid_code,
          creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
            decoded.user_id,
          ),
          created_at: new Date(item.timestamp),
          updated_at: new Date(item.timestamp),
        }));

      if (insertDocuments.length === 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'RFID code already exists',
          data: [],
        };

      const inserted =
        insertDocuments.length > 0
          ? await this.FreezerProcessModel.insertMany(insertDocuments)
          : [];

      return {
        status: 'success',
        statusCode: 201,
        message: 'Freezer created successfully',
        // data: [],
        data: [{ inserted_count: inserted.length }],
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

  async createWeightingsProcess(
    input: CreateWeightingsProcessDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Bypass check register exists
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      // prevent duplicate rfid
      const checkExistsIds = await this.WeightingsProcessModel.findOne({
        rfid_code: input.rfid_code,
      });

      const saved = Boolean(checkExistsIds)
        ? await this.WeightingsProcessModel.updateMany(
            { rfid_code: input.rfid_code },
            {
              weight: input.weight,
              updated_at: now,
            },
          )
        : await this.WeightingsProcessModel.create({
            rfid_code: input.rfid_code,
            weight: input.weight,
            creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
              decoded.user_id,
            ),
            created_at: now,
            updated_at: now,
          });

      await this.DurianRegistrationModel.updateOne(
        { rfid_code: input.rfid_code },
        {
          $set: {
            weight: input.weight,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Weightings created successfully',
        data: [
          { action: Boolean(checkExistsIds) ? 'update' : 'insert', saved },
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

  async createPackingProcess(
    input: CreatePackingProcessDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
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

      const pipeline = [
        {
          $match: {
            rfid_code: {
              $in: input.rfid_codes,
            },
          },
        },
        {
          $group: {
            _id: '$rfid_code',
            last_obj: {
              $last: '$$ROOT',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$last_obj',
          },
        },
        {
          $lookup: {
            from: 'vwWeightingsProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'vwWeightingsProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  weight: 1,
                  export_grade: 1,
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
          $project: {
            _id: 0,
            orchard_code: 1,
            packing_house_code: 1,
            rfid_code: 1,
            weight: {
              $cond: [
                {
                  $gt: ['$weight', null],
                },
                '$weight',
                0,
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
                  $gt: ['$inspected_grade', null],
                },
                '$inspected_grade',
                null,
              ],
            },
          },
        },
      ];
      const results = await this.DurianRegistrationModel.aggregate(pipeline);
      if (results.length === 0)
        return {
          status: 'error',
          statusCode: 404,
          message: 'RFID code not found',
          data: [],
        };

      const totalWeight = results.reduce(
        (acc, cur) => acc + (cur?.weight ?? 0),
        0,
      );
      const orchardCode =
        results.find((result) => result.orchard_code).orchard_code ?? '-';
      const packingHouseCode =
        results.find((result) => result.packing_house_code)
          .packing_house_code ?? '-';
      // const packingDate = new Date().toLocaleDateString('en-GB', {
      //   day: 'numeric',
      //   month: 'numeric',
      //   year: 'numeric',
      // });

      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      const packingDate = now.toUTCString();

      const resp = await axios.post(
        'http://172.16.1.125:30107/idee/api/v2/service/packing-print-upload',
        {
          orchard_code: orchardCode,
          packing_house_code: packingHouseCode,
          packing_date: packingDate,
          total_weight: totalWeight,
          results: results,
        },
      );

      if (resp.data?.status !== 'success')
        return {
          status: 'error',
          statusCode: 500,
          message:
            resp.data?.message || 'Error while creating packing (Microservice)',
          data: [],
        };

      const respData = resp.data?.data || [];

      const checkExistsIds = await this.PackingProcessModel.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');
      const existsRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);

      const insertedDocuments = documents.filter(
        (item) => !existsRfidCodes.includes(item.rfid_code),
      );

      if (insertedDocuments.length > 0)
        await this.PackingProcessModel.insertMany(insertedDocuments);

      // const imageLink =
      //   'https://sncservices.sncformer.com/data/iDEE/packing-process/v2/packing-labels/' +
      //   filename;

      return {
        status: 'success',
        statusCode: 201,
        message: 'Packing created successfully',
        data: respData,
        // results,
        // totalWeight,
        // data: [
        // {
        //   image_link: resp ? imageLink : '',
        // },
        // ],
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

  async createPackingProcessRawData(
    input: CreatePackingProcess2Dto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
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

      const pipeline = [
        {
          $match: {
            rfid_code: {
              $in: input.rfid_codes,
            },
          },
        },
        {
          $group: {
            _id: '$rfid_code',
            last_obj: {
              $last: '$$ROOT',
            },
          },
        },
        {
          $replaceRoot: {
            newRoot: '$last_obj',
          },
        },
        {
          $lookup: {
            from: 'vwWeightingsProcess',
            localField: 'rfid_code',
            foreignField: 'rfid_code',
            as: 'vwWeightingsProcess',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  weight: 1,
                  export_grade: 1,
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
          $project: {
            _id: 0,
            orchard_code: 1,
            packing_house_code: 1,
            rfid_code: 1,
            weight: {
              $cond: [
                {
                  $gt: ['$weight', null],
                },
                '$weight',
                0,
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
          },
        },
      ];
      const results = await this.DurianRegistrationModel.aggregate(pipeline);
      if (results.length === 0)
        return {
          status: 'error',
          statusCode: 404,
          message: 'RFID code not found',
          data: [],
        };
      // const totalWeight = results.reduce(
      //   (acc, cur) => acc + (cur?.weight ?? 0),
      //   0,
      // );
      const orchardCode =
        results.find((result) => result?.orchard_code)?.orchard_code ?? '-';
      const packingHouseCode =
        results.find((result) => result?.packing_house_code)
          ?.packing_house_code ?? '-';
      // const packingDate = new Date().toLocaleDateString('en-GB', {
      //   day: 'numeric',
      //   month: 'numeric',
      //   year: 'numeric',
      // });

      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      const packingDate = now.toUTCString();

      const checkExistsIds = await this.PackingProcessModel.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');
      const existsRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);

      const insertedDocuments = documents.filter(
        (item) => !existsRfidCodes.includes(item.rfid_code),
      );

      if (insertedDocuments.length > 0)
        await this.PackingProcessModel.insertMany(insertedDocuments);

      // const imageLink =
      //   'https://sncservices.sncformer.com/data/iDEE/packing-process/v2/packing-labels/' +
      //   filename;

      const matchRfidCodes = input.rfid_codes.map((rfid_code) => {
        const result = results.find((result) => result.rfid_code === rfid_code);
        return {
          rfid_code: rfid_code,
          weight: result?.weight ?? 0,
          export_grade: result?.inspected_grade ?? '-',
        };
      });

      const data = new Array(
        Math.ceil(input.rfid_codes.length / input.packaging_type),
      )
        .fill(0)
        .map((_, index) => {
          const splitRfidCodes = matchRfidCodes.slice(
            index * input.packaging_type,
            (index + 1) * input.packaging_type,
          );
          const totalWeight = splitRfidCodes.reduce(
            (acc, cur) => acc + (cur?.weight ?? 0),
            0,
          );

          return {
            exporting_company: 'Demeter Cooperation Co., Ltd',
            fruit_name: 'Durian (Monthong)',
            orchard_code: orchardCode,
            packing_house_code: packingHouseCode,
            packing_date: packingDate,
            packing_quantity: splitRfidCodes.length,
            total_weight: totalWeight,
            results: splitRfidCodes,
          };
        });

      return {
        status: 'success',
        statusCode: 201,
        message: 'Packing created successfully',
        data: data,
        // data: [
        // {
        //   image_link: resp ? imageLink : '',
        // },
        // ],
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
  ): Promise<TServiceResponse> {
    try {
      // const checkRegisterExists = await this.DurianRegistrationModel.find({
      //   fruit_code: createQcDto.fruit_code,
      //   registered_at: { $ne: null },
      // })
      //   .sort({ _id: -1 })
      //   .limit(1);

      // const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkExistsIds = await this.TransportationModel.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');

      const existsRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);
      const countRfidCodes = input.rfid_codes?.length ?? 0;
      const countRfidTimestamp = input.timestamp?.length ?? 0;
      const mergeData =
        countRfidCodes <= countRfidTimestamp
          ? input.rfid_codes?.map((item, i) => ({
              rfid_code: item,
              timestamp: input.timestamp[i],
            }))
          : input.timestamp?.map((item, i) => ({
              rfid_code: input.rfid_codes[i],
              timestamp: item,
            }));

      const insertDocuments = mergeData
        .filter((item) => !existsRfidCodes.includes(item.rfid_code))
        .map((item) => ({
          container_no: input.container_no,
          rfid_code: item.rfid_code,
          reserve_id: mongo.BSON.ObjectId.createFromHexString(input.reserve_id),
          creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
            decoded.user_id,
          ),
          created_at: new Date(item.timestamp),
          updated_at: new Date(item.timestamp),
        }));

      if (insertDocuments.length === 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'RFID code already exists',
          data: [],
        };

      const inserted =
        insertDocuments.length > 0
          ? await this.TransportationModel.insertMany(insertDocuments)
          : [];

      await this.DurianRegistrationModel.updateOne(
        { rfid_code: { $in: input.rfid_codes } },
        {
          $set: {
            reserve_id: mongo.BSON.ObjectId.createFromHexString(
              input.reserve_id,
            ),
            container_no: input.container_no,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Transportation created successfully',
        // data: [],
        data: [{ inserted_count: inserted.length }],
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

  async getAllProcess(rfid_code: string): Promise<TServiceResponse> {
    try {
      const process = await this.DurianRegistrationModel.aggregate([
        {
          $match: {
            rfid_code: rfid_code,
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
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
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
                  $arrayElemAt: ['$OrchardRegistration', 0],
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
            container_no: {
              $cond: [
                {
                  $gt: ['$container_no', null],
                },
                '$container_no',
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
        statusCode: 200,
        message: 'Process found',
        data: process,
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

  async editWeightingsProcess(
    input: EditWeightingsProcessDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      await this.DurianRegistrationModel.updateOne(
        { rfid_code: input.rfid_code },
        {
          $set: {
            inspected_grade: input.inspected_grade,
            exported_grade: input.export_grade,
            number_of_segments: input.number_of_segments,
            weight: input.weight,
            maturity: input.maturity,
            remarks: input.remarks,
            updated_at: now,
            // inspected_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
          },
        },
      );

      await this.WeightingsProcessModel.updateOne(
        { rfid_code: input.rfid_code },
        {
          $set: {
            weight: input.weight,
            updated_at: now,
          },
        },
      );

      await this.CountSegmentsProcessModel.updateOne(
        { rfid_code: input.rfid_code },
        {
          $set: {
            maturity: input.maturity,
            number_of_segments: input.number_of_segments,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Weightings edited successfully',
        data: [],
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

  //* [GET] /packing/weight-detail
  async getWeightingsDetail(rfid_code: string): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            rfid_code: rfid_code,
          },
        },
        {
          $sort: { created_at: -1 },
        },
        { $limit: 1 },
        {
          $lookup: {
            from: 'Users',
            localField: 'creator_id',
            foreignField: '_id',
            as: 'Users',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  creator_name: '$name',
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
                  $arrayElemAt: ['$Users', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            creator_name: {
              $cond: [{ $gt: ['$creator_name', null] }, '$creator_name', ''],
            },
            rfid_code: 1,
            weight: {
              $cond: [{ $gt: ['$weight', null] }, '$weight', ''],
            },
            maturity: {
              $cond: [{ $gt: ['$maturity', null] }, '$maturity', ''],
            },
            number_of_segments: {
              $cond: [
                { $gt: ['$number_of_segments', null] },
                '$number_of_segments',
                '',
              ],
            },
            export_grade: {
              $cond: [{ $gt: ['$export_grade', null] }, '$export_grade', ''],
            },
            packing_house_code: 1,
            inspected_grade: 1,
          },
        },
      ];

      const results = await this.DurianRegistrationModel.aggregate(pipeline);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get Weightings detail successfully',
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
