import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterTreeDto } from './dto/register-tree.dto';
import { TreesRegistration } from 'src/schema/trees-registration.schema';
import { OrchardRegister } from 'src/schema/orchard-registration.schema';
import { EditTreeDto } from './dto/edit-tree.dto';
import { TreeDetailsDto } from './dto/tree-details.dto';
import { DurianRegistration } from 'src/schema/durian-registration.schema';


@Injectable()
export class TreeRegisterService {
  constructor(
    @InjectModel(TreesRegistration.name) private treeRegisterModel: Model<TreesRegistration>,
    @InjectModel(OrchardRegister.name) private orchardRegisterModel: Model<OrchardRegister>,
    @InjectModel(DurianRegistration.name) private durianRegistrationModel: Model<DurianRegistration>,
  ) { }

  // [POST] tree register
  async RegisterNewTree(validator: RegisterTreeDto): Promise<any> {
    try {
      // // input orchard name, but need orchard code63
      // const orchardName = validator.orchard_name;
      // const orchardCodeQuery = await this.orchardRegisterModel.findOne({orchard_name: orchardName}).select('-_id orchard_code').exec()
      // const orchardCode = orchardCodeQuery.orchard_code;

      // // check tree registration in the same orchard
      // const checkTreeInOrchard = await this.treeRegisterModel.find({orchard_code: orchardCode}).exec()

      // // run number of tree
      // const runCode = (checkTreeInOrchard.length + 1).toString().padStart(4, '0');
      // const treeCode = `${orchardCode}-${runCode}`;

      const now = new Date()
      // now.setHours(now.getHours() + 7)

      // // register tree into database
      // const newTree = new this.treeRegisterModel({
      //   orchard_code: orchardCode,
      //   orchard_name: orchardName,
      //   tree_code: treeCode,
      //   cultivar: validator.cultivar,
      //   tree_latitude: validator.tree_latitude,
      //   tree_longitude: validator.tree_longitude,
      //   plant_year: validator.plant_year,
      //   tree_height: validator.tree_height,
      //   circumference: validator.circumference,
      //   sea_level: validator.sea_level,
      //   fruit_per_tree: validator.fruit_per_tree,
      //   cultivar_source: validator.cultivar_source,
      //   soil_type: validator.soil_type,
      //   created_at: now,
      //   updated_at: now
      // })      
      // await newTree.save()

      // check tree registration in the same orchard
      const checkOrchard = await this.treeRegisterModel.find({ orchard_code: validator.orchard_code }).exec()
      let n: number

      // run number of tree
      for (let i = 1; i <= validator.tree_number; i++) {
        if (checkOrchard.length !== 0) {
          n = checkOrchard.length + i
        } else {
          n = i
        }
        const runNumber = n.toString().padStart(4, '0');
        const treeCode = `${validator.orchard_code}-${runNumber}`;
        const name = await this.orchardRegisterModel.findOne({ orchard_code: validator.orchard_code }).select('-_id orchard_name').exec()
        await this.treeRegisterModel.create({
          orchard_code: validator.orchard_code,
          orchard_name: name.orchard_name,
          tree_code: treeCode,
          cultivar: null,
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
          updated_at: now
        })
      }
      return {
        status: 'success',
        message: 'Tree registered successfully',
        data: []
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }

  // [GET] all tree register
  async GetAllTreeRegister(): Promise<any> {
    try {
      const allTree = await this.treeRegisterModel.find().exec()
      const allTreeData = []
      for (const i of allTree) {
        allTreeData.push({
          orchard_name: i.orchard_name,
          tree_code: i.tree_code,
          cultivar: i.cultivar,
          latitude: i.latitude,
          longitude: i.longitude,
          plant_year: i.plant_year,
          tree_height: i.tree_height,
          circumference: i.circumference,
          fruit_per_tree: i.fruit_per_tree,

          registration_date: i.created_at,
        })
      }

      return {
        status: 'success',
        message: 'Get all tree register successfully',
        data: allTreeData
      }

    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }

  // [PUT] update tree register
  async UpdateTreeRegister(validator: EditTreeDto): Promise<any> {
    try {
      const now = new Date()
      // now.setHours(now.getHours() + 7)

      const updateTree = await this.treeRegisterModel.updateOne({ tree_code: validator.tree_code }, {
        orchard_code: validator.orchard_code,
        cultivar: validator.cultivar,
        latitude: validator.latitude,
        longitude: validator.longitude,
        plant_year: validator.plant_year,
        tree_height: validator.tree_height,
        circumference: validator.circumference,
        fruit_per_tree: validator.fruit_per_tree,
        updated_at: now
      }).exec()

      return {
        status: 'success',
        message: 'Tree updated successfully',
        data: updateTree
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }

  // [DELETE] delete tree register
  async DeleteTreeRegister(treeCode: string): Promise<any> {
    try {
      await this.treeRegisterModel.deleteOne({ tree_code: treeCode }).exec()
      return {
        status: 'success',
        message: 'Tree deleted successfully',
        data: []
      }
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }

  // [POST] tree detials
  async TreeDetails(validator: TreeDetailsDto): Promise<any> {
    try {
      const pipeline = [
        {
          '$match': {
            'tree_code': validator.tree_code
          }
        }, {
          '$lookup': {
            'from': 'OrchardRegisteration',
            'localField': 'orchard_code',
            'foreignField': 'orchard_code',
            'as': 'OrchardRegisteration'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$OrchardRegisteration', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'orchard_name': 1,
            'registration_date': { '$dateToString': { 'format': '%Y-%m-%d', 'date': '$created_at' } },
            'address': 1,
            'province': 1,
            'district': 1,
            'sub_district': 1,
            'zip_code': 1,
            'latitude': 1,
            'longitude': 1,
            'tree_latitude': 1,
            'tree_longitude': 1,
            'cultivar': 1,
            'cultivar_source': 1,
            'soil_type': 1,
            'fruit_per_tree': 1,
            'plant_year': 1,
            'tree_height': 1,
            'circumference': 1,
            'sea_level': 1
          }
        }
      ]

      const treeDetails = await this.treeRegisterModel.aggregate(pipeline).exec()

      const pipelineFruitTable = [
        {
          '$match': {
            'tree_code': validator.tree_code
          }
        }, {
          '$lookup': {
            'from': 'QualityControlsProcess',
            'localField': 'fruit_code',
            'foreignField': 'fruit_code',
            'as': 'QualityControlsProcess'
          }
        }, {
          '$replaceRoot': {
            'newRoot': {
              '$mergeObjects': [
                {
                  '$arrayElemAt': [
                    '$QualityControlsProcess', 0
                  ]
                }, '$$ROOT'
              ]
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'harvest_date': {
              '$dateToString': {
                'format': '%Y-%m-%d',
                'date': '$registered_at'
              }
            },
            'fruit_code': 1,
            'is_passed': 1
          }
        }, {
          '$group': {
            '_id': {
              'harvest_date': '$harvest_date'
            },
            'count': {
              '$sum': 1
            },
            'pass': {
              '$sum': {
                '$cond': [
                  {
                    '$eq': [
                      '$is_passed', true
                    ]
                  }, 1, 0
                ]
              }
            },
            'fail': {
              '$sum': {
                '$cond': [
                  {
                    '$eq': [
                      '$is_passed', false
                    ]
                  }, 1, 0
                ]
              }
            }
          }
        }, {
          '$project': {
            '_id': 0,
            'harvest_date': '$_id.harvest_date',
            'fruit': '$count',
            'good_fruit': '$pass',
            'fruit_rot': '$fail'
          }
        }
      ]

      const fruitTable = await this.durianRegistrationModel.aggregate(pipelineFruitTable).exec()

      return {
        status: 'success',
        message: 'Get tree details successfully',
        data: {
          orchard_name: treeDetails[0].orchard_name,
          province: treeDetails[0].province,
          district: treeDetails[0].district,
          sub_district: treeDetails[0].sub_district,
          zip_code: treeDetails[0].zip_code,
          address: treeDetails[0].address,
          latitude: treeDetails[0].latitude,
          longitude: treeDetails[0].longitude,
          cultivar: treeDetails[0].cultivar,
          cultivae_source: treeDetails[0].cultivar_source,
          tree_latitude: treeDetails[0].tree_latitude,
          tree_longitude: treeDetails[0].tree_longitude,
          plant_year: treeDetails[0].plant_year,
          tree_height: treeDetails[0].tree_height,
          circumference: treeDetails[0].circumference,
          sea_level: treeDetails[0].sea_level,
          soil_type: treeDetails[0].soil_type,
          fruit_per_tree: treeDetails[0].fruit_per_tree,
          registration_date: treeDetails[0].registration_date,
          fruitTable: fruitTable
        }
      }

    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }

}
