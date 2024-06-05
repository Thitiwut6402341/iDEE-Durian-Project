import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateOrchardRegisterDto } from './dto/create-orchard-register.dto';
import { OrchardInfoDto } from './dto/orchard-info.dto';
import { EditOrchardInfoDto } from './dto/edit-orchard-info.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  OrchardRegister,
  OrchardRegisterDocument,
} from 'src/schema/orchard/orchard-register.schema';
import {
  DepartmentProvincial,
  DepartmentProvincialDocument,
} from 'src/schema/orchard/department-provincial.schema';
import axios from 'axios';
import { TJwtPayload } from 'src/types/jwt-payload';
import * as mongoose from 'mongoose';
import {
  DataCollection,
  DataCollectionDocument,
} from 'src/schema/hardware/data-collection.schema';
import {
  TreesRegistration,
  TreesRegisterDocument,
} from 'src/schema/trees/trees-registration.schema';
import https from 'https'
const Ftp = require("ftp");

@Injectable()
export class OrchardRegisterService {
  constructor(
    @InjectModel(OrchardRegister.name)
    private OrchardModel: Model<OrchardRegisterDocument>,
    @InjectModel(DepartmentProvincial.name)
    private readonly DepartmentProvincialModel: Model<DepartmentProvincialDocument>,
    @InjectModel(TreesRegistration.name)
    private readonly TreesRegistrationModel: Model<TreesRegisterDocument>,

    @InjectModel(DataCollection.name)
    private readonly DataCollectionModel: Model<DataCollectionDocument>,
  ) { }

  //* [GET] /orchard-register/get-datacollection
  async getDataCollection(): Promise<any> {
    try {

      const aggregationResult = await this.DataCollectionModel.aggregate(
        [
          {
            '$project': {
              '_id': 0,
              'air_CO2': '$data.Air_CO2',
              'Air_Humidity': '$data.Air_Humidity',
              'Air_Noise': '$data.Air_Noise',
              'Air_Pressure': '$data.Air_Pressure',
              'Air_Temperature': '$data.Air_Temperature',
              'Rain_Counter': '$data.Rain_Counter',
              'Rain_Volumn': '$data.Rain_Volumn',
              'Soil_Conductivity': '$data.Soil_Conductivity',
              'Soil_Moisture': '$data.Soil_Moisture',
              'Soil_Nitrogen': '$data.Soil_Nitrogen',
              'Soil_Phosphorus': '$data.Soil_Phosphorus',
              'Soil_Potassium': '$data.Soil_Potassium',
              'Soil_Salinity': '$data.Soil_Salinity',
              'Soil_Temp': '$data.Soil_Temp',
              'Soil_pH': '$data.Soil_pH',
              'created_at': {
                '$dateToString': {
                  'date': '$created_at',
                  'format': '%Y-%m-%d'
                }
              },
              'timestamp': '$created_at'
            }
          }, {
            '$setWindowFields': {
              'sortBy': {
                'created_at': 1
              },
              'output': {
                'rain_diff': {
                  '$shift': {
                    'output': '$Rain_Volumn',
                    'by': -1,
                    'default': null
                  }
                }
              },
              'partitionBy': null
            }
          }, {
            '$project': {
              'Rain_Volumn': {
                '$subtract': [
                  '$Rain_Volumn', '$rain_diff'
                ]
              },
              '_id': 0,
              'air_CO2': 1,
              'Air_Humidity': 1,
              'Air_Noise': 1,
              'Air_Pressure': 1,
              'Air_Temperature': 1,
              'Rain_Counter': 1,
              'Soil_Conductivity': 1,
              'Soil_Moisture': 1,
              'Soil_Nitrogen': 1,
              'Soil_Phosphorus': 1,
              'Soil_Potassium': 1,
              'Soil_Salinity': 1,
              'Soil_Temp': 1,
              'Soil_pH': 1,
              'created_at': 1,
              'timestamp': 1
            }
          }, {
            '$match': {
              '$and': [
                {
                  'Rain_Volumn': {
                    '$ne': null
                  }
                }, {
                  'Rain_Volumn': {
                    '$gte': 0
                  }
                }
              ]
            }
          }, {
            '$project': {
              '_id': 0,
              'Rain_Volumn': 1,
              'air_CO2': 1,
              'Air_Humidity': 1,
              'Air_Noise': 1,
              'Air_Pressure': 1,
              'Air_Temperature': 1,
              'Rain_Counter': 1,
              'Soil_Conductivity': 1,
              'Soil_Moisture': 1,
              'Soil_Nitrogen': 1,
              'Soil_Phosphorus': 1,
              'Soil_Potassium': 1,
              'Soil_Salinity': 1,
              'Soil_Temp': 1,
              'Soil_pH': 1,
              'created_at': 1,
              'timestamp': 1
            }
          }
        ]
      ).exec();

      // const dataOrg = await axios.get("https://snc-services.sncformer.com/dev/open-api/index.php/locations/thailand-locations")

      return {
        status: "success",
        message: 'You query data collection from hardware successfully!',
        data: aggregationResult,
      };

    } catch (error) {
      throw error;
    }
  }

  //* [GET] /orchard-register/all-orchard
  async findAll(): Promise<any> {
    try {
      // const result = await this.OrchardModel.find().exec();
      const aggregationResult = await this.OrchardModel.aggregate(
        [
          {
            '$project': {
              '_id': 0,
              'creator_id': {
                '$toString': '$creator_id'
              },
              'orchard_code': 1,
              'orchard_name': 1,
              'province': 1,
              'district': 1,
              'sub_district': 1,
              'zip_code': 1,
              'address': 1,
              'total_trees': 1,
              'is_qa_verify': 1,
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
              'gap_img': 1,
              'area_ngan': 1,
              'area_rai': 1,
              'area_wa': 1,
              'capacity': 1,
              'email': 1,
              'gap_no': 1,
              'harvest_season': 1,
              'owner_first_name': 1,
              'owner_last_name': 1,
              'phone': 1,
              'soil_type': 1,
              'tax_id': 1,
              'title_name': 1,
              'qa_by': 1,
            }
          }
        ]
      ).exec();
      const https = require('https');
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false,
      });

      const instance = axios.create({ httpsAgent })
      const dataOrg = await instance.get(
        'https://snc-services.sncformer.com/dev/open-api/index.php/locations/thailand-locations',
      );

      return {
        status: 'success',
        message: 'You query all orchard and houses successfully!',
        data: aggregationResult,
      };
    } catch (error) {
      throw error;
    }
  }

  //* [GET] /orchard-register/get-id-province
  async findID(): Promise<any> {
    try {
      const province = 'ระยอง';
      const district = 'เมืองระยอง';
      const sub_district = 'ท่าประดู่';
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
          message: 'Not found code from API!',
          data: [],
        };
      }

      return filteredTambonIds[0];
    } catch (error) {
      throw error;
    }
  }

  // async uploadFileFromBase64(client, base64Data, remote) {
  //   return new Promise((resolve, reject) => {
  //     const buffer = Buffer.from(base64Data, "base64");
  //     client.put(buffer, remote, async function (err) {
  //       if (err) reject(err);
  //       resolve(true);
  //     });
  //   });
  // }


  // async uploadPicture(gap_img: string, orchard_code: string): Promise<any> {
  //   try {
  //     const ftpHost = '10.0.0.3';
  //     const ftpUser = 'SNC_CoDE';
  //     const ftpPassword = '$nCC0deTe@mS';
  //     const base_url = 'sncservices.sncformer.com';

  //     const client = new Ftp();

  //     // Connect to FTP server
  //     client.connect({
  //       host: ftpHost,
  //       user: ftpUser,
  //       password: ftpPassword,
  //     });

  //     // Wait for FTP client to be ready
  //     await new Promise((resolve, reject) => {
  //       client.on("ready", resolve);
  //       client.on("error", reject);
  //     });
  //     // const qa_by = decoded.user_id;

  //     let UrlGapImg = null;

  //     if (gap_img !== null) {
  //       const fileNameGapNo = `gap_no_${orchard_code}_${Date.now()}.png`;
  //       const base64Data = gap_img.split(';base64,').pop();
  //       await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileNameGapNo}`);
  //       UrlGapImg = `https://${base_url}/data/idee/${fileNameGapNo}`;
  //     }

  //     const a = await this.OrchardModel.updateOne(
  //       {
  //         orchard_code: orchard_code,
  //       },
  //       {
  //         $set: {
  //           gap_img: UrlGapImg,
  //           is_qa_verify: true,
  //           // qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
  //           //   decoded.user_id,
  //           // ),
  //         }
  //       });

  //     // Disconnect from FTP server
  //     client.end();

  //     return {
  //       status: 'success',
  //       message: 'Uploaded pictures successfully',
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

  //* [POST] /orchard-register/register
  async OrchardRegister(
    validator: CreateOrchardRegisterDto,
    decoded: any,
  ) {
    try {
      let orchardCode: string;
      let runNoCode: string;
      let queryData: null | any[] = null;
      const now = new Date();
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

      queryData = await this.OrchardModel.find({
        orchard_code: { $regex: `${filteredTambonIds[0]}-F`, $options: 'i' },
      })
        .select('-_id orchard_code register_type')
        .exec();
      runNoCode = (queryData.length + 1).toString().padStart(3, '0');
      // orchardCode = `${subDistrictID}-F${runNoCode}`;
      orchardCode = `${filteredTambonIds[0]}-F${runNoCode}`;

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
        created_at: now,
        updated_at: now,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id)

      });

      const result = await newData.save();

      if (!result) {
        throw new NotFoundException('Failed to save data');
      }

      return {
        status: 'success',
        message: 'Registered orchard successfully!',
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
        message: error,
      });
    }
  }

  //* [POST] /orchard-register/edit-info
  async editInformation(validator: EditOrchardInfoDto, decoded: any): Promise<any> {
    try {
      const now = new Date();

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
        total_trees,
        soil_type,
        address,
        harvest_season,
        capacity,
      } = validator;

      const raiToMeter = isNaN(area_rai * 1600) ? null : area_rai * 1600;
      const nganToMeter = isNaN(area_ngan * 400) ? null : area_ngan * 400;
      const waToMeter = isNaN(area_wa * 4) ? null : area_wa * 4;

      const sumMeter = isNaN(raiToMeter + nganToMeter + waToMeter)
        ? null
        : raiToMeter + nganToMeter + waToMeter;
      const sumArea = isNaN(sumMeter / 1600) ? null : sumMeter / 1600;

      const checkData = await this.OrchardModel.findOne({
        orchard_code,
      }).exec();

      if (!checkData) {
        return {
          status: 'error',
          message: 'Not found orchard code!',
          data: [],
        };
      }

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
        tax_id,
        total_trees,
        soil_type,
        harvest_season,
        capacity,
        title_name,
        owner_first_name,
        owner_last_name,
        updated_at: now,
      };

      const newData = await this.OrchardModel.updateOne(
        { orchard_code },
        { $set: updateData }
      ).exec();

      await this.TreesRegistrationModel.updateMany(
        { orchard_code },
        { orchard_name }
      ).exec();

      return {
        status: 'success',
        message: 'Edit orchard successfully!',
        data: newData,
      };
    } catch (error) {
      return new InternalServerErrorException({
        status: 'error',
        message: error.message,
      });
    }
  }

  //* [POST] /orchard-register/orchard-info
  async getOrchardInformation(validator: OrchardInfoDto): Promise<any> {
    try {
      // const token = authorizationHeader.split(' ')[1];
      // const decodedToken = this.jwtService.verify(token);

      // if (!decodedToken) {
      //   throw new UnauthorizedException('Invalid or expired token');
      // }
      const orchardCode = validator.orchard_code;

      const result = await this.OrchardModel.findOne({
        orchard_code: orchardCode,
      }).exec();

      if (!result) {
        return {
          status: 'error',
          message: 'Orchard code not found!',
          data: [],
        };
      }

      return {
        status: 'success',
        message: 'Get orchard info successfully!',
        data: [result],
      };
    } catch (error) {
      return new InternalServerErrorException({
        status: 'error',
        message: error.message,
      });
    }
  }

  //* [DELETE] /orchard-register/delete
  async deleteOrchard(orchard_code: string): Promise<any> {
    try {
      const checkData = await this.OrchardModel.findOne({
        orchard_code: orchard_code,
      }).exec();

      if (!checkData) {
        return {
          status: 'error',
          message: 'Not found orchard code!',
          data: [],
        };
      }

      const deleteData = await this.OrchardModel.findOneAndDelete({
        orchard_code: orchard_code,
      }).exec();

      return {
        status: 'success',
        message: 'Delete orchard successfully!',
        data: [deleteData],
      };
    } catch (error) {
      return new InternalServerErrorException({
        status: 'error',
        message: error.message,
      });
    }
  }
}
