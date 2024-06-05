import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EditPackingHouseRegisterDto } from './dto/edit-packing-house-info.dto';
import { PackingHouseRegisterDto } from './dto/packing-house-register.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PackingHouseRegisterDocument } from 'src/schema/packinghouse/packing-house-register.schema';
import { PackingHouseRegister } from 'src/schema/packinghouse/packing-house-register.schema';
import {
  DepartmentProvincialDocument,
  DepartmentProvincial,
} from 'src/schema/orchard/department-provincial.schema';
import { PackingHouseInfoDto } from './dto/packing-house-info.dto';
import axios from 'axios';
import { TJwtPayload } from 'src/types/jwt-payload';
import * as mongoose from 'mongoose';

@Injectable()
export class PackingHouseRegisterService {
  constructor(
    @InjectModel(PackingHouseRegister.name)
    private PackingHouseModel: Model<PackingHouseRegisterDocument>,
    @InjectModel(DepartmentProvincial.name)
    private readonly DepartmentProvincialModel: Model<DepartmentProvincialDocument>,
  ) { }

  //* [GET] /packing-house-register/all-packing-house
  async findAll(): Promise<any> {
    try {
      const aggregationResult = await this.PackingHouseModel.aggregate(
        [
          {
            '$project': {
              '_id': 0,
              'creator_id': {
                '$toString': '$creator_id'
              },
              'packing_house_code': 1,
              'register_type': 1,
              'province': 1,
              'district': 1,
              'sub_district': 1,
              'zip_code': 1,
              'address': 1,
              'created_at': {
                '$dateToString': {
                  'date': '$created_at',
                  'format': '%Y-%m-%d %H:%M:%S'
                }
              },
              'updated_at': {
                '$dateToString': {
                  'date': '$updated_at',
                  'format': '%Y-%m-%d %H:%M:%S'
                }
              },
              'capacity_per_day': 1,
              'doa_no': 1,
              'email': 1,
              'gmp_no': 1,
              'latitude': 1,
              'longitude': 1,
              'owner_first_name': 1,
              'owner_last_name': 1,
              'packing_house_name': 1,
              'phone': 1,
              'registration_no': 1,
              'tax_id': 1,
              'title_name': 1,
              'doa_img': 1,
              'gmp_img': 1
            }
          }
        ]
      ).exec();

      return {
        status: 'success',
        message: 'You query all packing house successfully!',
        data: aggregationResult,
      };
    } catch (error) {
      throw error;
    }
  }

  //* [POST] /packing-house-register/register
  async PackingHouseRegister(
    validator: PackingHouseRegisterDto,
    decoded: TJwtPayload,
  ): Promise<any> {
    try {
      let packingHouseCode: string;
      let runNoCode: string;
      let queryData: null | any[] = null;
      const now = new Date();
      // now.setHours(now.getHours() + 7)

      const packingName = validator.packing_name;
      const province = validator.province;
      const district = validator.district;
      const subDistrict = validator.sub_district;
      const zipCode = validator.zip_code;
      const address = validator.address;
      const https = require('https');
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

      const instance = axios.create({ httpsAgent })

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

      if (filteredTambonIds.length == 0) {
        return {
          status: 'error',
          message: 'Please fill in the information correctly.',
          data: [],
        };
      }

      queryData = await this.PackingHouseModel.find({
        packing_house_code: {
          $regex: `${filteredTambonIds[0]}-P`,
          $options: 'i',
        },
      })
        .select('-_id packing_house_code register_type')
        .exec();
      runNoCode = (queryData.length + 1).toString().padStart(3, '0');
      packingHouseCode = `${filteredTambonIds[0]}-P${runNoCode}`;

      const newData = new this.PackingHouseModel({
        packing_house_code: packingHouseCode,
        register_type: 'house',
        packing_name: packingName,
        province: province,
        district: district,
        sub_district: subDistrict,
        zip_code: zipCode,
        address: address,
        is_qa_verify: false,
        created_at: now,
        updated_at: now,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      });

      const result = await newData.save();

      if (!result) {
        throw new NotFoundException('Failed to save data');
      }

      return {
        status: 'success',
        message: 'Registered packing house code successfully!',
        data: [result],
      };
    } catch (error) {
      // throw error;
      if (error.message === 'jwt expired') {
        return {
          response: {
            status: 'error',
            message: 'Unauthorized',
          },
          status: 401,
        };
      }
      return new InternalServerErrorException({
        status: 'error',
        message: error.message,
      });
    }
  }

  //* [POST] /packing-house-register/edit-info
  async editPackingHouseInfo(
    validator: EditPackingHouseRegisterDto,
  ): Promise<any> {
    try {
      const packingHouseCode = validator.packing_house_code;
      // const registerType = validator.register_type
      const registerationNo = validator.registration_no;
      const gmpNo = validator.gmp_no;
      const doaNo = validator.doa_no;

      const gmpImg = validator.gmp_img;
      const doaImg = validator.doa_img;

      const packingName = validator.packing_house_name;
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
      const capability = validator.capacity_per_day

      const now = new Date();

      const checkData = await this.PackingHouseModel.findOne({
        packing_house_code: packingHouseCode,
      }).exec();
      if (!checkData) {
        return {
          status: 'error',
          message: 'Packing house code not found!',
          data: [],
        };
      }

      const updatedData = await this.PackingHouseModel.findOneAndUpdate(
        { packing_house_code: packingHouseCode },
        {
          register_type: 'house',
          registration_no: registerationNo,
          gmp_no: gmpNo,
          doa_no: doaNo,
          doa_img: doaImg,
          gmp_img: gmpImg,
          packing_house_name: packingName,
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
      ).exec();

      return {
        status: 'success',
        message: 'Edit packing house successfully!',
        data: [updatedData],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //* [POST] /packing-house-register/packing-house-info
  async getPackingHouseInfo(validator: PackingHouseInfoDto): Promise<any> {
    try {
      const packingHouseCode = validator.packing_house_code;

      const result = await this.PackingHouseModel.findOne({
        packing_house_code: packingHouseCode,
      }).exec();

      if (!result) {
        return {
          status: 'error',
          message: 'Packing house code not found!',
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'Get packing house info successfully!',
        data: [result],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //* [DELETE] /packing-house-register/delete-packing-house
  async deletePackingHouse(packingHouseCode: string): Promise<any> {
    try {
      const checkData = await this.PackingHouseModel.findOne({
        packing_house_code: packingHouseCode,
      }).exec();

      if (!checkData) {
        return {
          status: 'error',
          message: 'Packing house code not found!',
          data: [],
        };
      }

      const deleteData = await this.PackingHouseModel.deleteOne({
        packing_house_code: packingHouseCode,
      }).exec();

      return {
        status: 'success',
        message: 'Delete packing house successfully!',
        data: [deleteData],
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
