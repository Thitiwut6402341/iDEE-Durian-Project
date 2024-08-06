import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import {
  OrchardRegister,
  OrchardRegisterDocument,
} from 'src/schema/orchard/orchard-register.schema';

import axios from 'axios';
import { TJwtPayload } from 'src/types/jwt-payload';
import * as mongoose from 'mongoose';
import {
  DataCollection,
  DataCollectionDocument,
} from 'src/schema/hardware/data-collection.schema';
import {
  DeviceRegistration,
  DeviceRegistrationDocument,
} from 'src/schema/hardware/device-registration.schema';
import {
  TreesRegistration,
  TreesRegisterDocument,
} from 'src/schema/trees/trees-registration.schema';

import {
  CreateOrchardRegisterDto,
  OrchardInfoDto,
  EditOrchardInfoDto,
} from './dto';
import { TServiceResponse } from 'src/types/service-response';

@Injectable()
export class OrchardRegisterService {
  constructor(
    @InjectModel(OrchardRegister.name)
    private OrchardModel: Model<OrchardRegisterDocument>,

    @InjectModel(TreesRegistration.name)
    private readonly TreesRegistrationModel: Model<TreesRegisterDocument>,

    @InjectModel(DataCollection.name)
    private readonly DataCollectionModel: Model<DataCollectionDocument>,

    @InjectModel(DeviceRegistration.name)
    private readonly DeviceRegistrationModel: Model<DeviceRegistrationDocument>,
  ) {}

  //* [GET] /orchard-register/get-datacollection
  async getDataCollection(): Promise<TServiceResponse> {
    try {
      const aggregationResult = await this.DataCollectionModel.aggregate([
        {
          $project: {
            _id: 0,
            device_id: { $toString: '$device_id' },
            air_CO2: '$data.Air_CO2',
            Air_Humidity: '$data.Air_Humidity',
            Air_Noise: '$data.Air_Noise',
            Air_Pressure: '$data.Air_Pressure',
            Air_Temperature: '$data.Air_Temperature',
            Rain_Counter: '$data.Rain_Counter',
            Rain_Volumn: '$data.Rain_Volumn',
            Soil_Conductivity: '$data.Soil_Conductivity',
            Soil_Moisture: '$data.Soil_Moisture',
            Soil_Nitrogen: '$data.Soil_Nitrogen',
            Soil_Phosphorus: '$data.Soil_Phosphorus',
            Soil_Potassium: '$data.Soil_Potassium',
            Soil_Salinity: '$data.Soil_Salinity',
            Soil_Temp: '$data.Soil_Temp',
            Soil_pH: '$data.Soil_pH',
            created_at: {
              $dateToString: {
                date: '$created_at',
                format: '%Y-%m-%d',
              },
            },
            timestamp: '$created_at',
          },
        },
        {
          $setWindowFields: {
            sortBy: {
              created_at: 1,
            },
            output: {
              rain_diff: {
                $shift: {
                  output: '$Rain_Volumn',
                  by: -1,
                  default: null,
                },
              },
            },
            partitionBy: null,
          },
        },
        {
          $project: {
            Rain_Volumn: {
              $subtract: ['$Rain_Volumn', '$rain_diff'],
            },
            _id: 0,
            device_id: 1,
            air_CO2: 1,
            Air_Humidity: 1,
            Air_Noise: 1,
            Air_Pressure: 1,
            Air_Temperature: 1,
            Rain_Counter: 1,
            Soil_Conductivity: 1,
            Soil_Moisture: 1,
            Soil_Nitrogen: 1,
            Soil_Phosphorus: 1,
            Soil_Potassium: 1,
            Soil_Salinity: 1,
            Soil_Temp: 1,
            Soil_pH: 1,
            created_at: 1,
            timestamp: 1,
          },
        },
        {
          $match: {
            $and: [
              {
                Rain_Volumn: {
                  $ne: null,
                },
              },
              {
                Rain_Volumn: {
                  $gte: 0,
                },
              },
            ],
          },
        },
        {
          $project: {
            _id: 0,
            device_id: 1,
            Rain_Volumn: 1,
            air_CO2: 1,
            Air_Humidity: 1,
            Air_Noise: 1,
            Air_Pressure: 1,
            Air_Temperature: 1,
            Rain_Counter: 1,
            Soil_Conductivity: 1,
            Soil_Moisture: 1,
            Soil_Nitrogen: 1,
            Soil_Phosphorus: 1,
            Soil_Potassium: 1,
            Soil_Salinity: 1,
            Soil_Temp: 1,
            Soil_pH: 1,
            created_at: 1,
            timestamp: 1,
          },
        },
      ]);

      // const dataOrg = await axios.get("https://snc-services.sncformer.com/dev/open-api/index.php/locations/thailand-locations")

      return {
        status: 'success',
        statusCode: 200,
        message: 'You query data collection from hardware successfully!',
        data: aggregationResult,
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

  //* [GET] /orchard-register/all-orchard
  async findAll(): Promise<TServiceResponse> {
    try {
      // const result = await this.OrchardModel.find().exec();
      const aggregationResult = await this.OrchardModel.aggregate([
        {
          $project: {
            _id: 0,
            device_id: {
              $toString: '$device_id',
            },
            creator_id: {
              $toString: '$creator_id',
            },
            orchard_code: 1,
            orchard_name: 1,
            province: 1,
            district: 1,
            sub_district: 1,
            zip_code: 1,
            address: 1,
            total_trees: 1,
            is_qa_verify: 1,
            latitude: 1,
            longitude: 1,
            created_at: {
              $dateToString: {
                date: '$created_at',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
            updated_at: {
              $dateToString: {
                date: '$updated_at',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
            area_ngan: 1,
            area_rai: 1,
            area_wa: 1,
            email: 1,
            gap_no: 1,
            gap_img: 1,
            gap_exp: 1,
            harvest_season: 1,
            owner_first_name: 1,
            owner_last_name: 1,
            phone: 1,
            soil_type: 1,
            tax_id: 1,
            title_name: 1,
            qa_by: 1,
            // 'cultivar': 1,
            avg_fruit_per_tree: 1,
          },
        },
      ]);
      // const https = require('https');
      // const httpsAgent = new https.Agent({
      //   rejectUnauthorized: false,
      // });

      // const instance = axios.create({ httpsAgent });
      // const dataOrg = await instance.get(
      //   'https://snc-services.sncformer.com/dev/open-api/index.php/locations/thailand-locations',
      // );

      return {
        status: 'success',
        statusCode: 200,
        message: 'You query all orchard and houses successfully!',
        data: aggregationResult,
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

  //* [GET] /orchard-register/all-orchard
  async findAllDevices(): Promise<TServiceResponse> {
    try {
      // const result = await this.OrchardModel.find().exec();
      const pipeline: PipelineStage[] = [
        {
          $project: {
            _id: 0,
            device_id: { $toString: '$_id' },
            device_name: 1,
            orchard_code: 1,
            serial_no: 1,
            created_at: {
              $dateToString: {
                date: '$created_at',
                timezone: 'Asia/Bangkok',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
            updated_at: {
              $dateToString: {
                date: '$updated_at',
                timezone: 'Asia/Bangkok',
                format: '%Y-%m-%d %H:%M:%S',
              },
            },
          },
        },
        {
          $sort: {
            created_at: -1,
          },
        },
      ];
      const results = await this.DeviceRegistrationModel.aggregate(pipeline);

      return {
        status: 'success',
        statusCode: 200,
        message: 'You query all devices successfully!',
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

  //* [GET] /orchard-register/get-id-province
  async findID(): Promise<TServiceResponse> {
    try {
      const province = 'ระยอง';
      const district = 'เมืองระยอง';
      const sub_district = 'ท่าประดู่';
      const https = require('https');
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

      const instance = axios.create({ httpsAgent });
      const dataOrg = await instance.get(
        'https://snc-services.sncformer.com/dev/open-api/index.php/locations/thailand-locations',
      );

      const filteredTambonIds: number[] = [];
      for (const provinces of dataOrg.data) {
        if (provinces.name_th === province) {
          for (const amphure of provinces.amphure) {
            if (amphure.name_th === district) {
              for (const tambon of amphure.tambon) {
                if (tambon.name_th === sub_district) {
                  filteredTambonIds.push(tambon.id);
                }
              }
            }
          }
        }
      }

      if (filteredTambonIds.length == 0) {
        return {
          status: 'error',
          statusCode: 400,
          message: 'Not found code from API!',
          data: [],
        };
      }
      return {
        status: 'success',
        statusCode: 200,
        message: 'Data',
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

  //TODO [POST] /orchard-register/register
  async createOrchardRegister(
    validator: CreateOrchardRegisterDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      // now.setHours(now.getHours() + 7)

      const orchardName = validator.orchard_name;
      const province = validator.province;
      const district = validator.district;
      const subDistrict = validator.sub_district;
      const zipCode = validator.zip_code;
      const address = validator.address;
      const totalTrees = validator.total_trees;

      const https = require('https');
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

      const instance = axios.create({ httpsAgent });

      const dataOrg = await instance.get(
        'https://snc-services.sncformer.com/dev/open-api/index.php/locations/thailand-locations',
      );

      const filteredTambonIds: number[] = [];
      for (const provinces of dataOrg.data) {
        if (provinces.name_en === province) {
          for (const amphure of provinces.amphure) {
            if (amphure.name_en === district) {
              for (const tambon of amphure.tambon) {
                if (tambon.name_en === subDistrict) {
                  filteredTambonIds.push(tambon.id);
                }
              }
            }
          }
        }
      }

      if (filteredTambonIds.length == 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Please fill in the information correctly.',
          data: [],
        };

      const checkTambon = await this.OrchardModel.find(
        {
          orchard_code: {
            $regex: `${filteredTambonIds?.[0] ?? 'XXXXXX'}-F`,
            $options: 'i',
          },
        },
        {},
        { sort: { created_at: -1 }, limit: 1 },
      )
        .select('-_id orchard_code register_type')
        .exec();

      const latestOrchardCode =
        checkTambon.length !== 0
          ? Number(checkTambon[0]?.orchard_code?.slice(-3))
          : 0;
      // return {
      //   status: 'success',
      //   statusCode: 200,
      //   message: 'Demo',
      //   data: [{ checkTambon, latestOrchardCode }],
      // };

      const runNoCode = (latestOrchardCode + 1).toString().padStart(3, '0');
      // orchardCode = `${subDistrictID}-F${runNoCode}`;
      const orchardCode = `${filteredTambonIds?.[0] ?? 'XXXXXX'}-F${runNoCode}`;

      // return mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id)

      const newData = new this.OrchardModel({
        orchard_code: orchardCode,
        orchard_name: orchardName,
        province: province,
        district: district,
        sub_district: subDistrict,
        zip_code: zipCode,
        address: address,
        total_trees: totalTrees,
        is_qa_verify: false,
        gap_no: null,
        gap_img: null,
        gap_exp: null,
        title_name: null,
        owner_first_name: null,
        owner_last_name: null,
        tax_id: null,
        phone: null,
        email: null,
        latitude: null,
        longitude: null,
        soil_type: null,
        area_rai: null,
        area_ngan: null,
        area_wa: null,
        harvest_season: null,
        avg_fruit_per_tree: null,
        // cultivar: null,

        created_at: now,
        updated_at: now,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      });

      const result = await newData.save();

      if (!result)
        return {
          status: 'error',
          statusCode: 500,
          message: 'Failed to save data',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 201,
        message: 'Registered orchard successfully!',
        data: [result],
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

  //TODO [POST] /orchard-register/edit-info
  async editInformation(
    validator: EditOrchardInfoDto,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const {
        orchard_code,
        orchard_name,
        area_rai,
        area_ngan,
        area_wa,
        title_name,
        owner_first_name,
        owner_last_name,
        tax_id,
        phone,
        email,
        latitude,
        longitude,
        gap_no,
        gap_img,
        gap_exp,
        total_trees,
        soil_type,
        address,
        harvest_season,
        avg_fruit_per_tree,
        // cultivar,
      } = validator;

      const raiToMeter = isNaN(area_rai) ? null : area_rai * 1600;
      const nganToMeter = isNaN(area_ngan) ? null : area_ngan * 400;
      const waToMeter = isNaN(area_wa) ? null : area_wa * 4;

      const sumMeter = isNaN(raiToMeter + nganToMeter + waToMeter)
        ? null
        : raiToMeter + nganToMeter + waToMeter;
      const sumArea = isNaN(sumMeter) ? null : sumMeter / 1600;

      const checkData = await this.OrchardModel.findOne({
        orchard_code,
      }).exec();

      if (!checkData)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Not found orchard code!',
          data: [],
        };

      const updateData = {
        orchard_name,
        address,
        area_rai,
        area_ngan,
        area_wa,
        sum_area: sumArea,
        phone,
        email,
        latitude,
        longitude,
        gap_no,
        gap_img,
        gap_exp,
        tax_id,
        total_trees,
        soil_type,
        harvest_season,
        // cultivar,
        avg_fruit_per_tree,
        title_name,
        owner_first_name,
        owner_last_name,
        updated_at: now,
      };

      // return updateData;

      const updated = await this.OrchardModel.updateOne(
        { orchard_code },
        { $set: updateData },
      ).exec();

      await this.TreesRegistrationModel.updateMany(
        { orchard_code },
        { orchard_name },
      ).exec();

      return {
        status: 'success',
        statusCode: 201,
        message: 'Edit orchard successfully!',
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

  //TODO [POST] /orchard-register/orchard-info
  async getOrchardInformation(
    validator: OrchardInfoDto,
  ): Promise<TServiceResponse> {
    try {
      // const token = authorizationHeader.split(' ')[1];
      // const decodedToken = this.jwtService.verify(token);

      // if (!decodedToken) {
      //   throw new UnauthorizedException('Invalid or expired token');
      // }

      const result = await this.OrchardModel.findOne({
        orchard_code: validator.orchard_code,
      }).exec();

      if (!result)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Orchard code not found!',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get orchard info successfully!',
        data: [result],
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

  //! [DELETE] /orchard-register/delete
  async deleteOrchard(orchard_code: string): Promise<TServiceResponse> {
    try {
      const deleted = await this.OrchardModel.findOneAndDelete({
        orchard_code: orchard_code,
      }).exec();

      if (!deleted)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Not found orchard code!',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Delete orchard successfully!',
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
}
