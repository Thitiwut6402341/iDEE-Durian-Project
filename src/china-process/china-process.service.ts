import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo, PipelineStage } from 'mongoose';
import {
  ChinaLoadInProcess,
  ChinaLoadInProcessDocument,
} from 'src/schema/china-process/loadin-process.schema';
import { CreateLoadInDto } from './dto/create-loadin-process.dto';
import {
  WeightingsProcess,
  WeightingsProcessDocument,
} from 'src/schema/packing-schemas';
import {
  ChinaStoreProcess,
  ChinaStoreProcessDocument,
} from 'src/schema/china-process/store-process.schema';
import { CreateStoreDto } from './dto/create-store-process.dto';
import { CreateRePackingProcessDto } from './dto/create-re-packing-process.dto';
import {
  ChinaRePackingProcess,
  ChinaRePackingProcessDocument,
} from 'src/schema/china-process/re-packing-process.schema';
import { Transportation } from 'src/schema/transportation.schema';
import { TransportationDocument } from 'src/schema/transportation.schema';
import { CreateDeliveryDto } from './dto/create-delivery-process.dto';
import {
  ChinaDeliveryProcess,
  ChinaDeliveryProcessDocument,
} from 'src/schema/china-process/delivery-process.schema';
import {
  ChinaLoadOutStoreProcess,
  ChinaLoadOutStoreProcessDocument,
} from 'src/schema/china-process/load-out-store-process.schema';
import { CreateLoadOutStoreDto } from './dto/create-load-out-store-process.dto';
import { TServiceResponse } from 'src/types/service-response';
import { TJwtPayload } from 'src/types/jwt-payload';
import {
  DurianRegistration,
  DurianRegistrationDocument,
} from 'src/schema/durian-register';

@Injectable()
export class ChinaProcessService {
  constructor(
    @InjectModel(ChinaLoadInProcess.name)
    private ChinaLoadInProcessModel: Model<ChinaLoadInProcessDocument>,
    @InjectModel(WeightingsProcess.name)
    private WeightingsProcessModel: Model<WeightingsProcessDocument>,
    @InjectModel(ChinaStoreProcess.name)
    private ChinaStoreProcessModel: Model<ChinaStoreProcessDocument>,
    @InjectModel(ChinaLoadOutStoreProcess.name)
    private ChinaLoadOutStoreProcessModel: Model<ChinaLoadOutStoreProcessDocument>,
    @InjectModel(ChinaRePackingProcess.name)
    private ChinaRePackingProcessModel: Model<ChinaRePackingProcessDocument>,
    @InjectModel(Transportation.name)
    private TransportationModel: Model<TransportationDocument>,
    @InjectModel(ChinaDeliveryProcess.name)
    private ChinaDeliveryProcessModel: Model<ChinaDeliveryProcessDocument>,
    @InjectModel(DurianRegistration.name)
    private DurianRegistrationModel: Model<DurianRegistrationDocument>,
  ) {}

  //TODO [POST] /china-process/load-in
  async createChinaLoadInProcess(
    input: CreateLoadInDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      //! Bypass check register exists
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkExistsIds = await this.ChinaLoadInProcessModel.find({
        rfid_code: { $in: input.rfid_codes },
      }).select('-_id rfid_code');
      const updateRfidCodes = checkExistsIds.map((rfid) => rfid.rfid_code);
      const insertRfidCodes = input.rfid_codes.filter(
        (rfid) => !updateRfidCodes.includes(rfid),
      );

      const insertDocuments = insertRfidCodes.map((rfid_code) => ({
        rfid_code,
        creator_id: mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
        created_at: now,
        updated_at: now,
      }));

      if (insertRfidCodes.length > 0)
        await this.ChinaLoadInProcessModel.insertMany(insertDocuments);

      if (updateRfidCodes.length > 0)
        await this.ChinaLoadInProcessModel.updateMany(
          { rfid_code: { $in: updateRfidCodes } },
          { $set: { updated_at: now } },
        );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Load In created successfully',
        // data: result,
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

  //TODO [POST] /china-process/store
  async createChinaStoreProcess(
    input: CreateStoreDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkExistsIds = await this.ChinaStoreProcessModel.find({
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
          creator_id: mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
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
          ? await this.ChinaStoreProcessModel.insertMany(insertDocuments)
          : [];

      return {
        status: 'success',
        statusCode: 201,
        message: 'Store durian created successfully',
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

  //TODO [POST] /china-process/load-out-store
  async createChinaLoadOutStoreProcess(
    input: CreateLoadOutStoreDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkExistsIds = await this.ChinaLoadOutStoreProcessModel.find({
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
          creator_id: mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
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
          ? await this.ChinaLoadOutStoreProcessModel.insertMany(insertDocuments)
          : [];

      return {
        status: 'success',
        statusCode: 201,
        message: 'Store durian created successfully',
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

  //TODO [POST] /china-process/re-packing
  async createChinaRePackingProcess(
    input: CreateRePackingProcessDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();

      const inserted = await this.ChinaRePackingProcessModel.create({
        rfid_code: input.rfid_code,
        packaging_id: input.packaging_id,
        weight_sale: input.weight_sale,
        creator_id: mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
        created_at: now,
        updated_at: now,
      });

      await this.DurianRegistrationModel.updateOne(
        {
          rfid_code: input.rfid_code,
        },
        {
          $set: {
            weight_sale: input.weight_sale,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Repacking process created successfully',
        data: [inserted],
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

  //TODO [POST] /china-process/delivery
  async createChinaDeliveryProcess(
    input: CreateDeliveryDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const checkExistsIds = await this.ChinaDeliveryProcessModel.find({
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
          creator_id: mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
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
          ? await this.ChinaDeliveryProcessModel.insertMany(insertDocuments)
          : [];

      return {
        status: 'success',
        statusCode: 201,
        message: 'Delivery create successfully',
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
}
