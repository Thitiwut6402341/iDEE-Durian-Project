import { Injectable, BadRequestException } from '@nestjs/common';
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
  ) { }

  //! Ng Case -------------------------------------------------------------------------
  async createNgCase(createNgCaseDto: CreateNgCaseDto) {
    // return createNgCaseDto;
    try {
      const checkExists = await this.NgCaseModel.findOne({
        case_name: createNgCaseDto.case_name,
      });

      if (checkExists)
        throw new BadRequestException('Case name already exists');

      const newNgCase = new this.NgCaseModel(createNgCaseDto);
      await newNgCase.save();

      return {
        status: 'success',
        message: 'Ng Case created successfully',
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

  async getNgCases() {
    try {
      const ngCases = await this.NgCaseModel.find(
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
        message: 'Ng Cases fetched successfully',
        data: ngCases,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async updateNgCase(updateNgCaseDto: UpdateNgCaseDto) {
    // return updateNgCaseDto;
    try {
      const checkCaseName = await this.NgCaseModel.findOne({
        case_name: updateNgCaseDto.case_name,
        _id: { $ne: updateNgCaseDto.case_id },
      });

      if (checkCaseName)
        throw new BadRequestException('Case name already exists');

      const updatedNgCase = await this.NgCaseModel.findOneAndUpdate(
        { _id: updateNgCaseDto.case_id },
        {
          case_name: updateNgCaseDto.case_name,
          description: updateNgCaseDto.description,
          updated_at: new Date(),
        },
        { new: true },
      );

      if (!updatedNgCase) throw new BadRequestException('Case not found');

      return {
        status: 'success',
        message: 'Ng Case updated successfully',
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

  // async deleteNgCase(case_id: string) {
  //   try {
  //     // {ng_cases: {$elemMatch: {$eq: new ObjectId('661371b8e327d562ae1cdbf5')}}}
  //     const checkUsed = await this.QualityControlModel.findOne({
  //       ng_case_id: {
  //         $elemMatch: { $eq: mongo.BSON.ObjectId.createFromHexString(case_id) },
  //       },
  //     });

  //     if (checkUsed)
  //       throw new BadRequestException(
  //         'Ng Case is being used in Quality Control',
  //       );

  //     const deleted = await this.NgCaseModel.findOneAndDelete({
  //       _id: case_id,
  //     });

  //     if (!deleted) throw new BadRequestException('Case not found');

  //     return {
  //       status: 'success',
  //       message: 'Ng Case deleted successfully',
  //       data: [],
  //     };
  //   } catch (error) {
  //     return {
  //       status: 'error',
  //       message: error.message,
  //       data: [],
  //     };
  //   }
  // }

  //! Soil types -------------------------------------------------------------------------
  async getSoilTypes() {
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
        message: 'Soil types fetched successfully',
        data: soilTypes,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //! Cultivar -------------------------------------------------------------------------
  async createCultivar(createCultivarDto: CreateCultivarDto) {
    // return createNgCaseDto;
    try {
      const checkCultivar = await this.CultivarModel.findOne({
        cultivar_th: createCultivarDto.cultivar_th,
      });

      if (checkCultivar)
        throw new BadRequestException('Cutivar already exists');

      const newCultivar = new this.CultivarModel(createCultivarDto);
      await newCultivar.save();

      return {
        status: 'success',
        message: 'Cultivar created successfully',
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

  async getCultivars() {
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
        message: 'Cultivars fetched successfully',
        data: cultivars,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async updateCultivar(updateCultivarDto: UpdateCultivarDto) {
    // return updateCultivarDto;
    try {
      const checkExists = await this.CultivarModel.findOne({
        cultivar_th: updateCultivarDto.cultivar_th,
        _id: { $ne: updateCultivarDto.cultivar_id },
      });

      if (checkExists) throw new BadRequestException('Cultivar already exists');

      const updated = await this.CultivarModel.findOneAndUpdate(
        { _id: updateCultivarDto.cultivar_id },
        {
          cultivar_th: updateCultivarDto.cultivar_th,
          cultivar_en: updateCultivarDto.cultivar_en,
          description: updateCultivarDto.description,
          updated_at: new Date(),
        },
        { new: true },
      );

      if (!updated) throw new BadRequestException('Cultivar not found');

      return {
        status: 'success',
        message: 'Cultivar updated successfully',
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

  async deleteCultivar(cultivar_id: string) {
    try {
      const deleted = await this.CultivarModel.findOneAndDelete({
        _id: cultivar_id,
      });

      if (!deleted) throw new BadRequestException('Cultivar not found');

      return {
        status: 'success',
        message: 'Cultivar deleted successfully',
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
}