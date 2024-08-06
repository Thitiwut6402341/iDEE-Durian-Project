import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { TradeMarkSetting } from 'src/schema/trade-mark-setting/create-trademark.schema';
const Ftp = require('ftp');
import { TJwtPayload } from 'src/types/jwt-payload';
import { CreateTradeMarkDto } from './dto/create-trademark.dto';
import { UpdateTradeMarkDto } from './dto/update-trademark.dto';

@Injectable()
export class TradeMarkSettingService {
  constructor(
    @InjectModel(TradeMarkSetting.name)
    private readonly tradeMarkSettingModel: Model<TradeMarkSetting>,
  ) {}

  async uploadFileFromBase64(client, base64Data, remote) {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(base64Data, 'base64');
      client.put(buffer, remote, async function (err) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  //* [POST] /trademark-setting/upload
  async uploadTradeMark(
    createTradeMarkDto: CreateTradeMarkDto,
    decoded: TJwtPayload,
  ): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      client.connect({
        host: ftpHost,
        user: ftpUser,
        password: ftpPassword,
      });

      // Wait for FTP client to be ready
      await new Promise((resolve, reject) => {
        client.on('ready', resolve);
        client.on('error', reject);
      });

      let url = null;

      // for PDF file
      if (
        createTradeMarkDto.trademark_img != null &&
        createTradeMarkDto.trademark_img.startsWith(
          'data:application/pdf;base64,',
        )
      ) {
        const fileName = `trade_mark_${createTradeMarkDto.product_name}_${Date.now()}.pdf`;
        const base64Data = createTradeMarkDto.trademark_img.replace(
          /^data:application\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        url = `https://${base_url}/data/idee/${fileName}`;
      }
      // for img file
      else if (createTradeMarkDto.trademark_img != null) {
        const fileName = `trade_mark_${createTradeMarkDto.product_name}_${Date.now()}.png`;
        const base64Data = createTradeMarkDto.trademark_img.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        url = `https://${base_url}/data/idee/${fileName}`;
      }

      const insertData = await this.tradeMarkSettingModel.create({
        product_name: createTradeMarkDto.product_name,
        trademark_img: url,
        created_at: now,
        updated_at: now,
        creator_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
      });

      client.end();

      return {
        status: 'success',
        message: 'upload trade mark success',
        data: insertData,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //* [GET] /trademark-setting
  async getTradeMark(): Promise<any> {
    try {
      const tradeMark = await this.tradeMarkSettingModel
        .find()
        .sort({ created_at: -1 });

      return {
        status: 'success',
        message: 'get trade mark success',
        data: tradeMark,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: [],
      };
    }
  }

  //* [DELETE] /trademark-setting/delete
  async deleteTradeMark(id: string): Promise<any> {
    try {
      const tradeMark = await this.tradeMarkSettingModel.findByIdAndDelete(id);

      return {
        status: 'success',
        message: 'delete trade mark success',
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

  //* [PUT] /trademark-setting/update
  async updateTradeMark(updateTradeMarkDto: UpdateTradeMarkDto): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const editData = await this.tradeMarkSettingModel.updateOne(
        { _id: updateTradeMarkDto.trademark_id },
        {
          $set: {
            product_name: updateTradeMarkDto.product_name,
            trademark_img: updateTradeMarkDto.trademark_img,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        message: 'update trade mark success',
        data: [editData],
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
