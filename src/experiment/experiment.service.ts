import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Experiment } from 'src/schema/experiment';
import { UploadPictureDto } from './dto/upload-picture.dto';
const Ftp = require('ftp');

@Injectable()
export class ExperimentService {
  constructor(
    @InjectModel(Experiment.name)
    private readonly experimentModel: Model<Experiment>,
  ) { }

  //TODO [POST] /experiment
  async create(data: any): Promise<any> {
    try {
      const result = new this.experimentModel({
        data,
        created_at: new Date(),
        updated_at: new Date(),
      });

      result.save();

      return {
        status: 'success',
        message: 'create new experiment data success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //TODO [POST] /experiment/many
  async creates(data: any[]): Promise<any> {
    try {
      const insertDataArray = data?.map((data) => ({
        data,
        created_at: new Date(),
        updated_at: new Date(),
      }));

      const result = await this.experimentModel.insertMany(insertDataArray);

      return {
        status: 'success',
        message: 'creates new experiment data success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //*    [GET] /experiment
  async findAll(): Promise<any> {
    try {
      const result = (await this.experimentModel.find())?.map((info) => ({
        id: info?._id ?? null,
        ...info?.data,
        created_at: info?.created_at ?? null,
        updated_at: info?.updated_at ?? null,
      }));

      return {
        status: 'success',
        message: 'Get all experiment data success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //?    [PUT] /experiment
  async update(dataUpdate: any): Promise<any> {
    try {
      const data = await dataUpdate;
      const id = await dataUpdate.id;
      delete data?.id;
      delete data?.created_at;
      delete data?.updated_at;

      const result = await this.experimentModel.findByIdAndUpdate(
        { _id: id },
        { data: dataUpdate, updated_at: new Date() },
        { new: true },
      );

      return {
        status: 'success',
        message: 'Updated experiment data success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //?    [PUT] /experiment/many
  async updateMany(dataUpdates: any[]): Promise<any> {
    try {
      const result = await Promise.all(
        dataUpdates.map(async (dataUpdate) => {
          const id = dataUpdate.id;
          const data = { ...dataUpdate };
          delete data.id;
          delete data.created_at;
          delete data.updated_at;

          const UpdatedData = await this.experimentModel.findByIdAndUpdate(
            { _id: id },
            { data: data, updated_at: new Date() },
            { new: true },
          );

          return UpdatedData;
        }),
      );
      return {
        status: 'success',
        message: 'Updated all experiment data success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //!    [Delete] /experiment
  async delete(id: string): Promise<any> {
    try {
      const result = await this.experimentModel.findByIdAndDelete(id);

      return {
        status: 'success',
        message: 'Delete experiment data success',
        data: result,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  async uploadFileFromBase64(client, base64Data, remote) {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(base64Data, 'base64');
      client.put(buffer, remote, async function (err) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  //TODO [POST] /experiment/upload-picture
  async uploadPicture(data: UploadPictureDto): Promise<any> {
    try {
      const DATA = {
        HOST: '10.0.0.3',
        USER_NAME: 'SNC_CoDE',
        PASSWORD: '$nCC0deTe@mS',
        BASE_URL: 'sncservices.sncformer.com',
      };
      const { HOST, USER_NAME, PASSWORD, BASE_URL } = DATA;

      const client = new Ftp();

      //TODO Connect to FTP server
      client.connect({
        host: HOST,
        user: USER_NAME,
        password: PASSWORD,
      });

      //? Wait for FTP client to be ready
      await new Promise((resolve, reject) => {
        client.on('ready', resolve);
        client.on('error', reject);
      });

      const DataExperiment = await this.experimentModel.find();
      const DATA_MAIN = DataExperiment?.find(
        (info) => String(info?._id) === data?.id,
      )?.data;

      const TEST_CODE = DATA_MAIN?.test_code ?? '';

      const pictures = {
        top: null,
        bottom: null,
        left: null,
        right: null,
        front: null,
        back: null,
        ...DATA_MAIN?.pictures,
      };

      const PICTURES = ['top', 'bottom', 'left', 'right', 'front', 'back'];

      for (let i = 0; i < PICTURES.length; i++) {
        if (
          (data?.pictures?.[PICTURES[i]] ?? '') !== '' &&
          data?.pictures?.[PICTURES[i]]?.slice(0, 8) !== 'https://'
        ) {
          const FILE_NAME = `${TEST_CODE}_${[PICTURES[i]]}_side_${Date.now()}.png`;
          const BASE_64_DATA = data?.pictures?.[PICTURES[i]]
            ?.split(';base64,')
            .pop();
          await this.uploadFileFromBase64(
            client,
            BASE_64_DATA,
            `/CoDE_Data/iDEE/${FILE_NAME}`,
          );

          pictures.PICTURES[i] = `https://${BASE_URL}/data/idee/${FILE_NAME}`;
        }
      }

      const UpdateData = DataExperiment?.filter(
        (info) => info?.data?.test_code === TEST_CODE,
      )?.map((info) => ({
        id: info?._id ?? null,
        ...info?.data,
        pictures,
        created_at: info?.created_at ?? null,
        updated_at: info?.updated_at ?? null,
      }));

      const result = await Promise.all(
        UpdateData.map(async (dataUpdate) => {
          const id = dataUpdate.id;
          const data = { ...dataUpdate };
          delete data.id;
          delete data.created_at;
          delete data.updated_at;

          const UpdatedData = await this.experimentModel.findByIdAndUpdate(
            { _id: id },
            { data: data, updated_at: new Date() },
            { new: true },
          );

          return UpdatedData;
        }),
      );

      //! Disconnect from FTP server
      client.end();

      return {
        status: 'success',
        message: 'Uploaded pictures successfully',
        data: result,
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
