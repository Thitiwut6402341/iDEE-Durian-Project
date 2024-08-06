import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage, mongo } from 'mongoose';
import { RegisterTreeDto } from './dto/register-tree.dto';
import { TreesRegistration } from 'src/schema/trees-registration.schema';
import { OrchardRegister } from 'src/schema/orchard-registration.schema';
import { EditTreeDto } from './dto/edit-tree.dto';
import { TreeDetailsDto } from './dto/tree-details.dto';
import { DurianRegistration } from 'src/schema/durian-registration.schema';
import { TServiceResponse } from 'src/types/service-response';

@Injectable()
export class TreeRegisterService {
  constructor(
    @InjectModel(TreesRegistration.name)
    private treeRegisterModel: Model<TreesRegistration>,
    @InjectModel(OrchardRegister.name)
    private orchardRegisterModel: Model<OrchardRegister>,
    @InjectModel(DurianRegistration.name)
    private durianRegistrationModel: Model<DurianRegistration>,
  ) {}

  //TODO [POST] tree register
  async createTrees(validator: RegisterTreeDto): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      // check tree registration in the same orchard
      const checkOrchardInTreeRegister = await this.treeRegisterModel
        .find(
          { orchard_code: validator.orchard_code },
          {},
          {
            sort: { tree_code: -1 },
            limit: 1,
          },
        )
        .exec();

      const checkOrchard = await this.orchardRegisterModel
        .findOne({ orchard_code: validator.orchard_code })
        .select('-_id orchard_name')
        .exec();

      const latestRunNo =
        checkOrchardInTreeRegister.length > 0
          ? Number(checkOrchardInTreeRegister?.[0]?.tree_code?.slice(-4))
          : 0;

      const documents = new Array(validator.tree_number).fill(0).map((_, i) => {
        const treeCode = `${validator.orchard_code}-${(latestRunNo + i + 1).toString().padStart(4, '0')}`;
        return {
          orchard_code: validator.orchard_code,
          orchard_name: checkOrchard?.orchard_name ?? null,
          tree_code: treeCode,
          // cultivar: null,
          cultivar_id: new mongo.ObjectId(validator.cultivar_id),
          tree_latitude: null,
          tree_longitude: null,
          plant_year: null,
          tree_height: null,
          circumference: null,
          sea_level: null,
          fruit_per_tree: null,
          cultivar_source: null,
          soil_type: null,
          created_at: now,
          updated_at: now,
        };
      });

      const inserted = await this.treeRegisterModel.insertMany(documents);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Tree registered successfully',
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

  //* [GET] all tree register
  async getAllTreeRegister(): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
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
                  cultivar_th: 1,
                  cultivar_en: 1,
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
            orchard_name: 1,
            tree_code: 1,
            cultivar_id: { $toString: '$cultivar_id' },
            cultivar_th: {
              $cond: [{ $gt: ['$cultivar_th', null] }, '$cultivar_th', null],
            },
            cultivar_en: {
              $cond: [{ $gt: ['$cultivar_en', null] }, '$cultivar_en', null],
            },
            latitude: 1,
            longitude: 1,
            plant_year: 1,
            tree_height: 1,
            circumference: 1,
            fruit_per_tree: 1,
            registration_date: {
              $dateToString: {
                format: '%Y-%m-%d %H:%M:%S',
                date: '$created_at',
                timezone: 'Asia/Bangkok',
              },
            },
          },
        },
      ];

      const results = await this.treeRegisterModel.aggregate(pipeline);

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get all tree register successfully',
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

  //? [PUT] update tree register
  async updateTreeRegister(validator: EditTreeDto): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      // now.setHours(now.getHours() + 7)

      const updated = await this.treeRegisterModel
        .updateOne(
          { tree_code: validator.tree_code },
          {
            cultivar_id: new mongo.ObjectId(validator.cultivar_id),
            latitude: validator.latitude,
            longitude: validator.longitude,
            plant_year: validator.plant_year,
            tree_height: validator.tree_height,
            circumference: validator.circumference,
            fruit_per_tree: validator.fruit_per_tree,
            updated_at: now,
          },
        )
        .exec();

      return {
        status: 'success',
        statusCode: 201,
        message: 'Tree updated successfully',
        data: [{ updated }],
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

  //! [DELETE] delete tree register
  async deleteTreeRegister(tree_code: string): Promise<TServiceResponse> {
    try {
      const deleted = await this.treeRegisterModel.deleteOne({ tree_code });
      return {
        status: 'success',
        statusCode: 200,
        message: 'Tree deleted successfully',
        data: [{ deleted }],
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

  //TODO [POST] tree detials
  async getTreeDetails(validator: TreeDetailsDto): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            tree_code: validator.tree_code,
          },
        },
        {
          $lookup: {
            from: 'OrchardRegistration',
            localField: 'orchard_code',
            foreignField: 'orchard_code',
            as: 'OrchardRegistration',
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
            orchard_name: 1,
            registration_date: {
              $dateToString: { format: '%Y-%m-%d', date: '$created_at' },
            },
            address: 1,
            province: 1,
            district: 1,
            sub_district: 1,
            zip_code: 1,
            latitude: 1,
            longitude: 1,
            tree_latitude: 1,
            tree_longitude: 1,
            cultivar: 1,
            cultivar_source: 1,
            soil_type: 1,
            fruit_per_tree: 1,
            plant_year: 1,
            tree_height: 1,
            circumference: 1,
            sea_level: 1,
          },
        },
      ];

      const treeDetails = await this.treeRegisterModel.aggregate(pipeline);

      const pipelineFruitTable: PipelineStage[] = [
        {
          $match: {
            tree_code: validator.tree_code,
          },
        },
        {
          $lookup: {
            from: 'QualityControlsProcess',
            localField: 'fruit_code',
            foreignField: 'fruit_code',
            as: 'QualityControlsProcess',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$QualityControlsProcess', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            harvest_date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$registered_at',
              },
            },
            fruit_code: 1,
            is_passed: 1,
          },
        },
        {
          $group: {
            _id: {
              harvest_date: '$harvest_date',
            },
            count: {
              $sum: 1,
            },
            pass: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$is_passed', true],
                  },
                  1,
                  0,
                ],
              },
            },
            fail: {
              $sum: {
                $cond: [
                  {
                    $eq: ['$is_passed', false],
                  },
                  1,
                  0,
                ],
              },
            },
          },
        },
        {
          $project: {
            _id: 0,
            harvest_date: '$_id.harvest_date',
            fruit: '$count',
            good_fruit: '$pass',
            fruit_rot: '$fail',
          },
        },
      ];

      const fruitTable =
        await this.durianRegistrationModel.aggregate(pipelineFruitTable);

      const results =
        treeDetails.length === 0 ? [] : [{ ...treeDetails[0], fruitTable }];

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get tree details successfully',
        data: results,
        // data: {
        //   orchard_name: treeDetails[0].orchard_name,
        //   province: treeDetails[0].province,
        //   district: treeDetails[0].district,
        //   sub_district: treeDetails[0].sub_district,
        //   zip_code: treeDetails[0].zip_code,
        //   address: treeDetails[0].address,
        //   latitude: treeDetails[0].latitude,
        //   longitude: treeDetails[0].longitude,
        //   cultivar: treeDetails[0].cultivar,
        //   cultivar_source: treeDetails[0].cultivar_source,
        //   tree_latitude: treeDetails[0].tree_latitude,
        //   tree_longitude: treeDetails[0].tree_longitude,
        //   plant_year: treeDetails[0].plant_year,
        //   tree_height: treeDetails[0].tree_height,
        //   circumference: treeDetails[0].circumference,
        //   sea_level: treeDetails[0].sea_level,
        //   soil_type: treeDetails[0].soil_type,
        //   fruit_per_tree: treeDetails[0].fruit_per_tree,
        //   registration_date: treeDetails[0].registration_date,
        //   fruitTable: fruitTable,
        // },
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
