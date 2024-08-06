import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import {
  CreateNgCaseDto,
  UpdateNgCaseDto,
  CreateCultivarDto,
  UpdateCultivarDto,
} from './dto';
import {
  Cultivar,
  CultivarDocument,
  NgCase,
  NgCaseDocument,
  SoilTypes,
  SoilTypesDocument,
} from 'src/schema/setting-schemas';
import { TServiceResponse } from 'src/types/service-response';

@Injectable()
export class SettingService {
  constructor(
    @InjectModel(NgCase.name)
    private NgCaseModel: Model<NgCaseDocument>,
    @InjectModel(SoilTypes.name)
    private SoilTypesModel: Model<SoilTypesDocument>,
    @InjectModel(Cultivar.name)
    private CultivarModel: Model<CultivarDocument>,
    // @InjectModel(QualityControl.name)
    // private QualityControlModel: Model<QualityControlDocument>,
    // @InjectModel(NgCase.name)
    // private NgCaseModel: Model<NgCaseDocument>,
  ) {}

  //! Ng Case -------------------------------------------------------------------------
  async createNgCase(input: CreateNgCaseDto): Promise<TServiceResponse> {
    // return createNgCaseDto;
    try {
      const now = new Date();
      if (process.platform === 'win32') now.setHours(now.getHours() - 7);

      const checkExists = await this.NgCaseModel.findOne({
        case_name: input.case_name,
      });

      if (checkExists)
        return {
          status: 'success',
          statusCode: 400,
          message: 'Case name already exists',
          data: [],
        };

      const saved = await this.NgCaseModel.create({
        case_name: input.case_name,
        description: input.description,
        created_at: now,
        updated_at: now,
      });

      return {
        status: 'success',
        statusCode: 201,
        message: 'Ng Case created successfully',
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

  async getNgCases(): Promise<TServiceResponse> {
    try {
      const results = await this.NgCaseModel.find(
        {},
        {
          _id: 0,
          case_id: { $toString: '$_id' },
          case_name: 1,
          description: 1,
        },
      );
      return {
        status: 'success',
        statusCode: 200,
        message: 'Ng Cases fetched successfully',
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

  async updateNgCase(input: UpdateNgCaseDto): Promise<TServiceResponse> {
    // return updateNgCaseDto;
    try {
      const now = new Date();
      if (process.platform === 'win32') now.setHours(now.getHours() - 7);
      const checkCaseName = await this.NgCaseModel.findOne({
        case_name: input.case_name,
        _id: { $ne: input.case_id },
      });

      if (checkCaseName)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Case name already exists',
          data: [],
        };

      const updated = await this.NgCaseModel.updateOne(
        { _id: mongo.BSON.ObjectId.createFromHexString(input.case_id) },
        {
          case_name: input.case_name,
          description: input.description,
          updated_at: now,
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Ng Case updated successfully',
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

  async deleteNgCase(case_id: string): Promise<TServiceResponse> {
    try {
      // {ng_cases: {$elemMatch: {$eq: new ObjectId('661371b8e327d562ae1cdbf5')}}}
      const checkUsed = await this.NgCaseModel.findOne({
        ng_case_id: {
          $elemMatch: { $eq: mongo.BSON.ObjectId.createFromHexString(case_id) },
        },
      });

      if (checkUsed)
        return {
          status: 'success',
          statusCode: 400,
          message: 'Ng Case is being used in Quality Control',
          data: [],
        };

      const deleted = await this.NgCaseModel.deleteOne({
        _id: mongo.BSON.ObjectId.createFromHexString(case_id),
      });

      return {
        status: 'success',
        statusCode: 200,
        message: 'Ng Case deleted successfully',
        data: [deleted],
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

  //! Soil types -------------------------------------------------------------------------
  async getSoilTypes(): Promise<TServiceResponse> {
    try {
      const soilTypes = await this.SoilTypesModel.find(
        {},
        {
          _id: 0,
          name: 1,
          description: 1,
        },
      );
      return {
        status: 'success',
        statusCode: 200,
        message: 'Soil types fetched successfully',
        data: soilTypes,
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

  //! Cultivar -------------------------------------------------------------------------
  async createCultivar(input: CreateCultivarDto): Promise<TServiceResponse> {
    // return createNgCaseDto;
    try {
      const now = new Date();
      if (process.platform === 'win32') now.setHours(now.getHours() - 7);

      const checkCultivar = await this.CultivarModel.findOne({
        cultivar_th: input.cultivar_th,
      });

      if (checkCultivar)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Cultivar already exists',
          data: [],
        };

      const saved = await this.CultivarModel.create({
        cultivar_th: input.cultivar_th,
        cultivar_en: input.cultivar_en,
        description: input.description,
        created_at: now,
        updated_at: now,
      });

      return {
        status: 'success',
        statusCode: 201,
        message: 'Cultivar created successfully',
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

  async getCultivars(): Promise<TServiceResponse> {
    try {
      const cultivars = await this.CultivarModel.find(
        {},
        {
          _id: 0,
          cultivar_id: { $toString: '$_id' },
          cultivar_th: 1,
          cultivar_en: 1,
          description: 1,
        },
      );
      return {
        status: 'success',
        statusCode: 201,
        message: 'Cultivars fetched successfully',
        data: cultivars,
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

  async updateCultivar(input: UpdateCultivarDto): Promise<TServiceResponse> {
    // return updateCultivarDto;
    try {
      const now = new Date();
      if (process.platform === 'win32') now.setHours(now.getHours() - 7);

      const checkExists = await this.CultivarModel.findOne({
        cultivar_th: input.cultivar_th,
        _id: {
          $ne: mongo.BSON.ObjectId.createFromHexString(input.cultivar_id),
        },
      });

      if (checkExists)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Cultivar already exists',
          data: [],
        };

      const updated = await this.CultivarModel.updateOne(
        { _id: mongo.BSON.ObjectId.createFromHexString(input.cultivar_id) },
        {
          cultivar_th: input.cultivar_th,
          cultivar_en: input.cultivar_en,
          description: input.description,
          updated_at: now,
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Cultivar updated successfully',
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

  async deleteCultivar(cultivar_id: string): Promise<TServiceResponse> {
    try {
      const deleted = await this.CultivarModel.findOneAndDelete({
        _id: cultivar_id,
      });

      if (!deleted)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Cultivar not found',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Cultivar deleted successfully',
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
}
