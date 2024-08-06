import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';
import { PackingHouseRegisterDocument } from 'src/schema/packinghouse/packing-house-register.schema';
import { PackingHouseRegister } from 'src/schema/packinghouse/packing-house-register.schema';

import axios from 'axios';
import { TJwtPayload } from 'src/types/jwt-payload';
import { TServiceResponse } from 'src/types/service-response';
import * as mongoose from 'mongoose';
import {
  PackingHouseRegisterDto,
  EditPackingHouseRegisterDto,
  PackingHouseInfoDto,
} from './dto';

@Injectable()
export class PackingHouseRegisterService {
  constructor(
    @InjectModel(PackingHouseRegister.name)
    private PackingHouseModel: Model<PackingHouseRegisterDocument>,
  ) {}

  //* [GET] /packing-house-register/all-packing-house
  async findAll(): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $project: {
            _id: 0,
            creator_id: {
              $toString: '$creator_id',
            },
            packing_house_code: 1,
            register_type: 1,
            province: 1,
            district: 1,
            sub_district: 1,
            zip_code: 1,
            address: 1,
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
            capacity_per_day: 1,
            doa_no: 1,
            email: 1,
            gmp_no: 1,
            latitude: 1,
            longitude: 1,
            owner_first_name: 1,
            owner_last_name: 1,
            packing_house_name: 1,
            phone: 1,
            registration_no: 1,
            tax_id: 1,
            title_name: 1,
            doa_img: 1,
            gmp_img: 1,
            is_qa_verify: 1,
            qa_by: 1,
            du_no: 1,
            du_img: 1,
            cn_no: 1,
            cn_img: 1,
            doa_exp: 1,
            gmp_exp: 1,
            du_exp: 1,
            cn_exp: 1,
          },
        },
      ];
      const results = await this.PackingHouseModel.aggregate(pipeline);

      return {
        status: 'success',
        statusCode: 200,
        message: 'You query all packing house successfully!',
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

  //TODO [POST] /packing-house-register/register
  async createPackingHouse(
    validator: PackingHouseRegisterDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      // now.setHours(now.getHours() + 7)

      const packingHouseName = validator.packing_house_name;
      const province = validator.province;
      const district = validator.district;
      const subDistrict = validator.sub_district;
      const zipCode = validator.zip_code;
      const address = validator.address;
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

      const checkTambon = await this.PackingHouseModel.find({
        packing_house_code: {
          $regex: `${filteredTambonIds[0]}-P`,
          $options: 'i',
        },
      })
        .select('-_id packing_house_code register_type')
        .exec();

      const latestPackingHouseCode =
        checkTambon.length !== 0
          ? Number(checkTambon[0]?.packing_house_code?.slice(-3))
          : 0;

      const runNoCode = (latestPackingHouseCode + 1)
        .toString()
        .padStart(3, '0');
      // orchardCode = `${subDistrictID}-F${runNoCode}`;
      const packingHouseCode = `${filteredTambonIds?.[0] ?? 'XXXXXX'}-P${runNoCode}`;

      const newData = new this.PackingHouseModel({
        packing_house_code: packingHouseCode,
        register_type: 'house',
        packing_house_name: packingHouseName,
        province: province,
        district: district,
        sub_district: subDistrict,
        zip_code: zipCode,
        address: address,
        is_qa_verify: false,

        registration_no: null,
        doa_no: null,
        doa_img: null,
        gmp_no: null,
        gmp_img: null,
        du_no: null,
        du_img: null,
        cn_no: null,
        cn_img: null,
        doa_exp: null,
        gmp_exp: null,
        du_exp: null,
        cn_exp: null,
        latitude: null,
        longitude: null,
        title_name: null,
        owner_first_name: null,
        owner_last_name: null,
        tax_id: null,
        phone: null,
        email: null,
        capacity_per_day: null,

        created_at: now,
        updated_at: now,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      });

      const saved = await newData.save();

      if (!saved)
        return {
          status: 'error',
          statusCode: 400,
          message: 'Failed to save data',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 201,
        message: 'Registered packing house code successfully!',
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

  //? [PUT] /packing-house-register/edit-info
  async editPackingHouseInfo(
    validator: EditPackingHouseRegisterDto,
  ): Promise<TServiceResponse> {
    try {
      const packingHouseCode = validator.packing_house_code;
      // const registerType = validator.register_type
      const registerationNo = validator.registration_no;
      const gmpNo = validator.gmp_no;
      const doaNo = validator.doa_no;

      const gmpImg = validator.gmp_img;
      const doaImg = validator.doa_img;

      const packingHouseName = validator.packing_house_name;
      const title = validator.title_name;
      const ownerNameEn = validator.owner_first_name;
      const ownerLastNameEn = validator.owner_last_name;
      const taxID = validator.tax_id;
      const telephone = validator.phone;
      const email = validator.email;

      // const province = validator.province;
      // const district = validator.district;
      // const subDistrict = validator.sub_district;
      // const zipCode = validator.zip_code;
      const address = validator.address;
      const latitude = validator.latitude;
      const longitude = validator.longitude;
      const capability = validator.capacity_per_day;

      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkData = await this.PackingHouseModel.findOne({
        packing_house_code: packingHouseCode,
      }).exec();
      if (!checkData)
        return {
          status: 'error',
          statusCode: 404,
          message: 'Packing house code not found!',
          data: [],
        };

      const updated = await this.PackingHouseModel.updateOne(
        { packing_house_code: packingHouseCode },
        {
          registration_no: registerationNo,
          gmp_no: gmpNo,
          doa_no: doaNo,
          doa_img: doaImg,
          gmp_img: gmpImg,
          packing_house_name: packingHouseName,
          title_name: title,
          owner_first_name: ownerNameEn,
          owner_last_name: ownerLastNameEn,
          tax_id: taxID,
          phone: telephone,
          email: email,
          capacity_per_day: capability,
          address: address,
          latitude: latitude,
          longitude: longitude,
          updated_at: now,
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Edit packing house successfully!',
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

  //* [GET] /packing-house-register/packing-house-info
  async getPackingHouseInfo(
    validator: PackingHouseInfoDto,
  ): Promise<TServiceResponse> {
    try {
      const pipeline: PipelineStage[] = [
        {
          $match: {
            packing_house_code: validator.packing_house_code,
          },
        },
        {
          $project: {
            _id: 0,
            creator_id: 1,
            packing_house_code: 1,
            packing_house_name: 1,
            packing_name: 1,
            is_qa_verify: 1,
            register_type: 1,
            province: 1,
            district: 1,
            sub_district: 1,
            zip_code: 1,
            address: 1,
            registration_no: 1,
            doa_no: 1,
            doa_img: 1,
            gmp_no: 1,
            gmp_img: 1,
            du_no: 1,
            du_img: 1,
            cn_no: 1,
            cn_img: 1,
            doa_exp: 1,
            gmp_exp: 1,
            du_exp: 1,
            cn_exp: 1,
            latitude: 1,
            longitude: 1,
            title_name: 1,
            owner_first_name: 1,
            owner_last_name: 1,
            tax_id: 1,
            phone: 1,
            email: 1,
            capacity_per_day: 1,
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
      ];

      const results = await this.PackingHouseModel.aggregate(pipeline);

      if (results.length === 0)
        return {
          status: 'error',
          statusCode: 404,
          message: 'Packing house code not found!',
          data: [],
        };

      return {
        status: 'success',
        statusCode: 200,
        message: 'Get packing house info successfully',
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

  //! [DELETE] /packing-house-register/delete-packing-house
  async deletePackingHouse(
    packingHouseCode: string,
  ): Promise<TServiceResponse> {
    try {
      const checkData = await this.PackingHouseModel.findOne({
        packing_house_code: packingHouseCode,
      }).exec();

      if (!checkData) {
        return {
          status: 'error',
          statusCode: 404,
          message: 'Packing house code not found!',
          data: [],
        };
      }

      const deleteData = await this.PackingHouseModel.deleteOne({
        packing_house_code: packingHouseCode,
      }).exec();

      return {
        status: 'success',
        statusCode: 200,
        message: 'Delete packing house successfully!',
        data: [deleteData],
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
