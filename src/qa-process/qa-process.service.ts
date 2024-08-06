import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OrchardRegister } from 'src/schema/orchard-registration.schema';
import { PackingHouseRegister } from 'src/schema/packing-house-registration.schema';
import { QAOrchardDto } from './dto/qa-orchard.dto';
import { QAPackingHouseDto } from './dto/qa-packing-house.dto';
import { DMPercentageDto } from './dto/dm-percent.dto';
import { DMPercentagePackingDto } from './dto/dm-percent-packing.dto';
import { DMPercentageAgricultureDto } from './dto/dm-percent-agriculture.dto';
import { FreezerRoomDto } from './dto/freezer-room.dto';
import { UpdatePackagingNoDto } from './dto/update-packaging-no.dto';
import { ReserveTransportation } from 'src/schema/reserve-transportation/register-reserve.schema';
import { ContainerSendDto } from './dto/container-send.dto';
import { ContainerReceiveDto } from './dto/container-receive.dto';
import { DocumentsDto } from './dto/documents.dto';
import { QAProcess } from 'src/schema/qa-process.schema';
import { QAFreezerDto } from './dto/qa-freezer.dto';
import { QAContainerBeforeCloseDto } from './dto/qa-container-before-close.dto';
import { DurianRegistration } from 'src/schema/durian-registration.schema';
import { QATruckCustomerDto } from './dto/qa-truck-customer.dto';
import { BookingDetailsDto } from './dto/booking-details.dto';
import { Transportation } from 'src/schema/transportation.schema';
const Ftp = require('ftp');
import { Container } from 'src/container/schema/container.schema';
import {
  ChemicalProcess1,
  ChemicalProcess1Document,
} from 'src/schema/packing-schemas';

@Injectable()
export class QaProcessService {
  constructor(
    @InjectModel(OrchardRegister.name)
    private orchardRegisterModel: Model<OrchardRegister>,
    @InjectModel(PackingHouseRegister.name)
    private packingHouseRegisterModel: Model<PackingHouseRegister>,
    @InjectModel(ReserveTransportation.name)
    private reserveTransportationModel: Model<ReserveTransportation>,
    @InjectModel(QAProcess.name) private qaProcessModel: Model<QAProcess>,
    @InjectModel(DurianRegistration.name)
    private durianRegistrationModel: Model<DurianRegistration>,
    @InjectModel(Transportation.name)
    private transportationModel: Model<Transportation>,
    @InjectModel(Container.name) private containerModel: Model<Container>,
    @InjectModel(ChemicalProcess1.name)
    private ChemicalProcess1Model: Model<ChemicalProcess1Document>,
  ) { }

  // upload file into FTP server.
  async uploadFileFromBase64(client, base64Data, remote) {
    return new Promise((resolve, reject) => {
      const buffer = Buffer.from(base64Data, 'base64');
      client.put(buffer, remote, async function (err) {
        if (err) reject(err);
        resolve(true);
      });
    });
  }

  // [PATCH] QA orchard; request GAP no. anf GAP file. (QA1)
  async QAOrchard(validator: QAOrchardDto, decoded: any): Promise<any> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      // Connect to FTP server
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
        validator.gap_file != null &&
        validator.gap_file.startsWith('data:application/pdf;base64,')
      ) {
        const fileName = `GAP-${validator.gap_no}-${now.getTime()}.pdf`;
        const base64Data = validator.gap_file.replace(
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
      else if (
        validator.gap_file != null &&
        validator.gap_file.startsWith('data:image')
      ) {
        const fileName = `GAP-${validator.gap_no}-${now.getTime()}.png`;
        const base64Data = validator.gap_file.replace(
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

      // if send url
      else if (
        validator.gap_file !== null &&
        validator.gap_file.startsWith('http')
      ) {
        url = validator.gap_file;
      }

      // add data into orchard tabel
      const QAOrchard = await this.orchardRegisterModel.updateOne(
        { orchard_code: validator.orchard_code },
        {
          gap_no: validator.gap_no,
          gap_img: url,
          gap_exp: validator.gap_exp,
          is_qa_verify: true,
          qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
            decoded.user_id,
          ),
          updated_at: now,
        },
      );

      // log qa history
      const qaHistory = await this.qaProcessModel.create({
        qa_process: 'QA orchard',
        location: validator.orchard_code,
        temperature: null,
        humidity: null,
        container_no: null,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      client.end();

      return {
        status: 'success',
        message: 'QA orchard success',
        data: [QAOrchard, qaHistory],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [PATCH] QA packing house; request GMP no. anf GMP file. (QA2)
  async QAPackingHouse(
    validator: QAPackingHouseDto,
    decoded: any,
  ): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      // Connect to FTP server
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

      let gmpUrl = null;
      let doaUrl = null;
      let duUrl = null;
      let cnUrl = null;

      // for GMP PDF file
      if (
        validator.gmp_file != null &&
        validator.gmp_file.startsWith('data:application/pdf;base64,')
      ) {
        const fileName = `GMP-${validator.gmp_no}-${now.getTime()}.pdf`;
        const base64Data = validator.gmp_file.replace(
          /^data:application\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        gmpUrl = `https://${base_url}/data/idee/${fileName}`;
      }
      // for GMP img file
      else if (
        validator.gmp_file != null &&
        validator.gmp_file.startsWith('data:image')
      ) {
        const fileName = `GMP-${validator.gmp_no}-${now.getTime()}.png`;
        const base64Data = validator.gmp_file.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        gmpUrl = `https://${base_url}/data/idee/${fileName}`;
      }

      // for DOA PDF file
      if (
        validator.doa_file != null &&
        validator.doa_file.startsWith('data:application/pdf;base64,')
      ) {
        const fileName = `DOA-${validator.doa_no}-${now.getTime()}.pdf`;
        const base64Data = validator.doa_file.replace(
          /^data:application\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        doaUrl = `https://${base_url}/data/idee/${fileName}`;
      }
      // for DOA img file
      else if (
        validator.doa_file != null &&
        validator.doa_file.startsWith('data:image')
      ) {
        const fileName = `DOA-${validator.doa_no}-${now.getTime()}.png`;
        const base64Data = validator.doa_file.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        doaUrl = `https://${base_url}/data/idee/${fileName}`;
      }

      // for DU PDF file
      if (
        validator.du_file != null &&
        validator.du_file.startsWith('data:application/pdf;base64,')
      ) {
        const fileName = `DU-${validator.du_no}-${now.getTime()}.pdf`;
        const base64Data = validator.du_file.replace(
          /^data:application\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        duUrl = `https://${base_url}/data/idee/${fileName}`;
      }
      // for DU img file
      else if (
        validator.du_file != null &&
        validator.du_file.startsWith('data:image')
      ) {
        const fileName = `DU-${validator.du_no}-${now.getTime()}.png`;
        const base64Data = validator.du_file.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        duUrl = `https://${base_url}/data/idee/${fileName}`;
      }

      // for CN PDF file
      if (
        validator.cn_file != null &&
        validator.cn_file.startsWith('data:application/pdf;base64,')
      ) {
        const fileName = `CN-${validator.cn_no}-${now.getTime()}.pdf`;
        const base64Data = validator.cn_file.replace(
          /^data:application\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        cnUrl = `https://${base_url}/data/idee/${fileName}`;
      }
      // for CN img file
      else if (
        validator.cn_file != null &&
        validator.cn_file.startsWith('data:image')
      ) {
        const fileName = `CN-${validator.cn_no}-${now.getTime()}.png`;
        const base64Data = validator.cn_file.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        cnUrl = `https://${base_url}/data/idee/${fileName}`;
      }

      // if send url
      else if (
        validator.gmp_file !== null &&
        validator.gmp_file.startsWith('http')
      ) {
        gmpUrl = validator.gmp_file;
      } else if (
        validator.doa_file !== null &&
        validator.doa_file.startsWith('http')
      ) {
        doaUrl = validator.doa_file;
      } else if (
        validator.du_file !== null &&
        validator.du_file.startsWith('http')
      ) {
        duUrl = validator.du_file;
      } else if (
        validator.cn_file !== null &&
        validator.cn_file.startsWith('http')
      ) {
        cnUrl = validator.cn_file;
      }

      // add data into packing house tabel
      const QAPackingHouse = await this.packingHouseRegisterModel.updateOne(
        { packing_house_code: validator.packing_house_code },
        {
          gmp_no: validator.gmp_no,
          gmp_img: gmpUrl,
          gmp_exp: validator.gmp_exp,
          doa_no: validator.doa_no,
          doa_img: doaUrl,
          doa_exp: validator.doa_exp,
          du_no: validator.du_no,
          du_img: duUrl,
          du_exp: validator.du_exp,
          cn_no: validator.cn_no,
          cn_img: cnUrl,
          cn_exp: validator.cn_exp,
          is_qa_verify: true,
          qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
            decoded.user_id,
          ),
          updated_at: now,
        },
      );

      // log qa history
      const qaHistory = await this.qaProcessModel.create({
        qa_process: 'QA packing house',
        location: validator.packing_house_code,
        temperature: null,
        humidity: null,
        container_no: null,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      client.end();

      return {
        status: 'success',
        message: 'QA orchard success',
        data: QAPackingHouse,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] %DM qualification (QA3, QA4, QA5)
  async DMPercentageOrchard(
    validator: DMPercentageDto,
    decoded: any,
  ): Promise<any> {
    try {
      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      // Connect to FTP server
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

      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      let img = null;

      // if QA send an image
      if (
        validator.dm_img != null &&
        validator.dm_img.startsWith('data:image')
      ) {
        const fileName = `DM-${validator.orchard_code}-${now.getTime()}.png`;
        const base64Data = validator.dm_img.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        img = `https://${base_url}/data/idee/${fileName}`;
      }

      // const qaProcess = (validator.orchard_code.startsWith('A'.toLocaleLowerCase())) ? 'QA DM for adriculture' : (validator.orchard_code.split('-')[1].startsWith('F'.toLocaleLowerCase())) ? 'QA DM for orchard' : 'QA DM for packing house'

      const QADMPercentage = await this.qaProcessModel.create({
        lot_id: null,
        qa_process: 'QA Orchard',
        location: validator.orchard_code,
        temperature: null,
        humidity: null,
        container_no: null,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: img,
        dm_percentage: validator.dm_percentage,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      client.end();

      return {
        status: 'success',
        message: 'Qualification %DM success',
        data: QADMPercentage,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] %DM qualification (QA3, QA4, QA5)
  async DMPercentagePackingHouse(
    validator: DMPercentagePackingDto,
    decoded: any,
  ): Promise<any> {
    try {
      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      // Connect to FTP server
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

      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      let img = null;

      // if QA send an image
      if (
        validator.dm_img != null &&
        validator.dm_img.startsWith('data:image')
      ) {
        const fileName = `DM-${validator.packing_house_code}-${now.getTime()}.png`;
        const base64Data = validator.dm_img.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        img = `https://${base_url}/data/idee/${fileName}`;
      }

      // const qaProcess = (validator.orchard_code.startsWith('A'.toLocaleLowerCase())) ? 'QA DM for adriculture' : (validator.orchard_code.split('-')[1].startsWith('F'.toLocaleLowerCase())) ? 'QA DM for orchard' : 'QA DM for packing house'

      const QADMPercentage = await this.qaProcessModel.create({
        lot_id: null,
        qa_process: 'QA Packing House',
        location: validator.packing_house_code,
        temperature: null,
        humidity: null,
        container_no: null,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: img,
        dm_percentage: validator.dm_percentage,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      client.end();

      return {
        status: 'success',
        message: 'Qualification %DM success',
        data: QADMPercentage,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] %DM qualification (QA3, QA4, QA5)
  async DMPercentageAgriculture(
    validator: DMPercentageAgricultureDto,
    decoded: any,
  ): Promise<any> {
    try {
      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      // Connect to FTP server
      await new Promise<void>((resolve, reject) => {
        client.connect({
          host: ftpHost,
          user: ftpUser,
          password: ftpPassword,
        });

        client.on('ready', resolve);
        client.on('error', reject);
      });

      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      let img = null;

      // If QA sends an image
      if (validator.dm_img && validator.dm_img.startsWith('data:image')) {
        const fileName = `DM-${validator.container_no}-${now.getTime()}.png`;
        const base64Data = validator.dm_img.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        img = `https://${base_url}/data/idee/${fileName}`;
      } else if (
        validator.dm_img !== null &&
        validator.dm_img.startsWith('http')
      ) {
        img = validator.dm_img;
      }

      // Create the document in the database
      const QADMPercentage = await this.qaProcessModel.create({
        reserve_id: new mongoose.Types.ObjectId(validator.reserve_id), // Convert reserve_id to ObjectId
        lot_id: null,
        qa_process: 'QA Agriculture',
        location: null,
        temperature: null,
        humidity: null,
        container_no: validator.container_no,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: img || null, // Ensure dm_img is null if not provided
        dm_percentage: validator.dm_percentage,
        qa_by: new mongoose.Types.ObjectId(decoded.user_id), // Convert user_id to ObjectId
        created_at: now,
        updated_at: now,
      });

      client.end();

      return {
        status: 'success',
        message: 'Qualification %DM success',
        data: QADMPercentage,
      };
    } catch (error) {
      console.error('Error during DMPercentageAgriculture:', error);
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] %DM qualification (QA3, QA4, QA5)
  async FreezerRoom(validator: FreezerRoomDto, decoded: any): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      // const qaProcess = (validator.orchard_code.startsWith('A'.toLocaleLowerCase())) ? 'QA DM for adriculture' : (validator.orchard_code.split('-')[1].startsWith('F'.toLocaleLowerCase())) ? 'QA DM for orchard' : 'QA DM for packing house'

      const QADMPercentage = await this.qaProcessModel.create({
        lot_id: null,
        qa_process: 'QA Freezer Room',
        location: validator.packing_house_code,
        temperature: validator.temperature,
        humidity: validator.humidity,
        container_no: null,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      return {
        status: 'success',
        message: 'Qualification %DM success',
        data: QADMPercentage,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  //* [GET] /qa-process/DMPercentagePackingHouseHistory
  async DMPercentagePackingHouseHistory(): Promise<any> {
    try {
      const pipeline: any[] = [
        {
          $lookup: {
            from: 'QAProcess',
            localField: 'packing_house_code',
            foreignField: 'location',
            as: 'qa_process',
          },
        },
        {
          $unwind: '$qa_process',
        },
        {
          $match: {
            packing_house_code: { $exists: true },
          },
        },
        {
          $project: {
            _id: 0,
            packing_house_code: '$packing_house_code',
            product_name: '$product_name',
            destination: '$destination',
            delivery_date: '$date_time',
            dm_percentage: '$qa_process.dm_percentage',
            dm_img: '$qa_process.dm_img',
            timestamp: '$qa_process.created_at',
          },
        },
      ];

      const DMPercentagePackingHouseHistory =
        await this.reserveTransportationModel.aggregate(pipeline).exec();

      return {
        status: 'success',
        message: 'Get DM percentage packing house history success',
        data: DMPercentagePackingHouseHistory,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  //* [GET] /qa-process/DMPercentageOrchardHistory
  async DMPercentageOrchardHistory(): Promise<any> {
    try {
      const pipeline: any[] = [
        {
          $unwind: '$orchard_code',
        },
        {
          $lookup: {
            from: 'QAProcess',
            localField: 'orchard_code',
            foreignField: 'location',
            as: 'qa_process',
          },
        },
        {
          $unwind: '$qa_process',
        },
        {
          $match: {
            packing_house_code: { $exists: true },
          },
        },
        {
          $project: {
            _id: 0,
            orchard_code: '$orchard_code',
            product_name: '$product_name',
            destination: '$destination',
            delivery_date: '$date_time',
            dm_percentage: '$qa_process.dm_percentage',
            dm_img: '$qa_process.dm_img',
            timestamp: '$qa_process.created_at',
          },
        },
      ];

      const DMPercentageOrchardHistory = await this.reserveTransportationModel
        .aggregate(pipeline)
        .exec();

      return {
        status: 'success',
        message: 'Get DM percentage orchard history success',
        data: DMPercentageOrchardHistory,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  //* [GET] /qa-process/DMPercentageAgricultureHistory
  async DMPercentageAgricultureHistory(
    transportation_id: string,
  ): Promise<any> {
    try {
      const pipeline: any[] = [
        {
          $match: { _id: new mongoose.Types.ObjectId(transportation_id) },
        },
        {
          $lookup: {
            from: 'Container',
            localField: '_id',
            foreignField: 'reserve_id',
            as: 'containers',
          },
        },
        {
          $unwind: '$containers',
        },
        {
          $lookup: {
            from: 'QAProcess',
            localField: 'containers.container_no',
            foreignField: 'container_no',
            as: 'qa_process',
          },
        },
        {
          $unwind: '$qa_process',
        },
        {
          $sort: { 'qa_process.created_at': -1 },
        },
        {
          $group: {
            _id: {
              container_no: '$containers.container_no',
              product_name: '$product_name',
              destination: '$destination',
              delivery_date: '$date_time',
            },
            reserve_id: { $first: '$qa_process.reserve_id' }, // Add reserve_id here
            dm_percentage: { $first: '$qa_process.dm_percentage' },
            dm_img: { $first: '$qa_process.dm_img' },
            timestamp: { $first: '$qa_process.created_at' },
          },
        },
        {
          $project: {
            _id: 0,
            container_no: '$_id.container_no',
            product_name: '$_id.product_name',
            destination: '$_id.destination',
            delivery_date: '$_id.delivery_date',
            reserve_id: '$reserve_id', // Include reserve_id in the projection
            dm_percentage: '$dm_percentage',
            dm_img: '$dm_img',
            timestamp: '$timestamp',
          },
        },
      ];

      const DMPercentageAgricultureHistory =
        await this.reserveTransportationModel.aggregate(pipeline).exec();

      return {
        status: 'success',
        message: 'Get DM percentage agriculture history success',
        data: DMPercentageAgricultureHistory,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  //* [GET] /qa-process/FreezerRoomHistory
  async FreezerRoomHistory(location: string): Promise<any> {
    try {
      const pipeline: any[] = [
        {
          $match: { location: location },
        },
        {
          $project: {
            _id: 0,
            temperature: '$temperature',
            humidity: '$humidity',
            timestamp: '$created_at',
          },
        },
      ];

      const FreezerRoomHistory = await this.qaProcessModel
        .aggregate(pipeline)
        .exec();

      return {
        status: 'success',
        message: 'Get freezer room history success',
        data: FreezerRoomHistory,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [PATCH] update packaging number (QA6)
  async UpdatePackagingNumber(validator: UpdatePackagingNoDto): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      const checkPackaging = await this.reserveTransportationModel.findOne({
        booking_ref: validator.booking_ref,
      });
      if (!checkPackaging) {
        return {
          status: 'error',
          message: 'Booking reference not found',
        };
      }

      const updatePackaging = await this.reserveTransportationModel.updateOne(
        { booking_ref: validator.booking_ref },
        {
          packaging_no: validator.packaging_no,
          updated_at: now,
        },
      );

      return {
        status: 'success',
        message: 'Update packaging number success',
        data: updatePackaging,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] QA freezer temperature and humidity (QA6)
  async QAFreezer(validator: QAFreezerDto, decoded: any): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      const QAFreezer = await this.qaProcessModel.create({
        qa_process: 'QA freezer',
        location: validator.packing_house_code,
        temperature: validator.temperature,
        humidity: validator.humidity,
        container_no: null,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      return {
        status: 'success',
        message: 'QA freezer success',
        data: QAFreezer,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] QA container before close (QA7)
  async QAContainerBeforeClose(
    validator: QAContainerBeforeCloseDto,
    decoded: any,
  ): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const checkTransportID = await this.containerModel
        .findOne({ container_no: validator.container_no })
        .select('-_id reserve_id');
      const queryPackingHouse = await this.reserveTransportationModel
        .findOne({ _id: checkTransportID.reserve_id })
        .select('-_id packing_house_code');

      // add data to qa history
      const QAContainerBeforeClose = await this.qaProcessModel.create({
        reserve_id: new mongoose.Types.ObjectId(validator.reserve_id), // Convert reserve_id to ObjectId
        lot_id: null,
        qa_process: 'QA container before close',
        location: null,
        temperature: validator.temperature,
        humidity: validator.humidity,
        gps_no: validator.gps_no,
        container_no: validator.container_no,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      // add gps_no into durian registration
      const updateGPS = await this.durianRegistrationModel.updateMany(
        // { lot_id: validator.lot_id },
        {
          gps_no: validator.gps_no,
          updated_at: now,
        },
      );

      const updateGPSTransport = await this.transportationModel.updateOne(
        // { lot_id: validator.lot_id },
        {
          gps_no: validator.gps_no,
          updated_at: now,
        },
      );

      return {
        status: 'success',
        message: 'QA container before close success',
        data: [QAContainerBeforeClose, updateGPS],
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] QA container sending (QA8)
  async QAContainerSend(
    validator: ContainerSendDto,
    decoded: any,
  ): Promise<any> {
    try {
      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      // Connect to FTP server
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

      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      let containerImg = null;
      let sealImg = null;

      // upload container image
      if (
        validator.container_img != null &&
        validator.container_img.startsWith('data:image')
      ) {
        const fileName = `CONTAINER${validator.container_no}-${now.getTime()}.png`;
        const base64Data = validator.container_img.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        containerImg = `https://${base_url}/data/idee/${fileName}`;
      } else if (
        validator.container_img !== null &&
        validator.container_img.startsWith('http')
      ) {
        containerImg = validator.container_img;
      }

      // upload seal image
      if (
        validator.seal_sending != null &&
        validator.seal_sending.startsWith('data:image')
      ) {
        const fileName = `SEAL-SEND${validator.container_no}-${now.getTime()}.png`;
        const base64Data = validator.seal_sending.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        sealImg = `https://${base_url}/data/idee/${fileName}`;
      } else if (
        validator.seal_sending !== null &&
        validator.seal_sending.startsWith('http')
      ) {
        sealImg = validator.seal_sending;
      }

      const qaContainer = await this.qaProcessModel.create({
        reserve_id: new mongoose.Types.ObjectId(validator.reserve_id), // Convert reserve_id to ObjectId
        qa_process: 'QA container sending',
        location: null,
        temperature: null,
        humidity: null,
        container_no: validator.container_no,
        container_img: containerImg,
        seal_sending: sealImg,
        seal_no_sending: validator.seal_no_sending,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      client.end();

      return {
        status: 'success',
        message: 'QA container sending success',
        data: qaContainer,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [PATCH] QA container receiving (QA9)
  async QAContainerReceive(
    validator: ContainerReceiveDto,
    decoded: any,
  ): Promise<any> {
    try {
      const ftpHost = '10.0.0.3';
      const ftpUser = 'SNC_CoDE';
      const ftpPassword = '$nCC0deTe@mS';
      const base_url = 'sncservices.sncformer.com';

      const client = new Ftp();

      // Connect to FTP server
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

      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      let sealImg = null;

      // upload seal image
      if (
        validator.seal_receiving != null &&
        validator.seal_receiving.startsWith('data:image')
      ) {
        const fileName = `SEAL-RECEIVE${validator.container_no}-${now.getTime()}.png`;
        const base64Data = validator.seal_receiving.replace(
          /^data:image\/\w+;base64,/,
          '',
        );
        await this.uploadFileFromBase64(
          client,
          base64Data,
          `/CoDE_Data/iDEE/${fileName}`,
        );
        sealImg = `https://${base_url}/data/idee/${fileName}`;
      } else if (
        validator.seal_receiving !== null &&
        validator.seal_receiving.startsWith('http')
      ) {
        sealImg = validator.seal_receiving;
      }

      const qaContainer = await this.qaProcessModel.create({
        reserve_id: new mongoose.Types.ObjectId(validator.reserve_id),
        qa_process: 'QA container receiving',
        location: 'Kunming',
        temperature: null,
        humidity: null,
        container_no: validator.container_no,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: sealImg,
        seal_no_receiving: validator.seal_no_receiving,
        is_seal_pass: validator.is_seal_pass,
        remarks: validator.remarks,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      return {
        status: 'success',
        message: 'QA container receiving success',
        data: qaContainer,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] qa truck customer (QA10)
  async QATruckCustomer(
    validator: QATruckCustomerDto,
    decoded: any,
  ): Promise<any> {
    try {
      const now = new Date();
      // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);
      const qaTruckCustomer = await this.qaProcessModel.create({
        qa_process: 'QA vahicale before delivery',
        location: 'Kunming',
        temperature: validator.temperature,
        humidity: validator.humidity,
        container_no: null,
        container_img: null,
        seal_sending: null,
        seal_no_sending: null,
        seal_receiving: null,
        seal_no_receiving: null,
        is_seal_pass: null,
        remarks: null,
        dm_img: null,
        dm_percentage: null,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      return {
        status: 'success',
        message: 'QA truck customer success',
        data: qaTruckCustomer,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [GET] All QA history processes
  async QAHistory(): Promise<any> {
    try {
      const pipeline = [
        {
          $lookup: {
            from: 'Users',
            localField: 'qa_by',
            foreignField: '_id',
            as: 'Users',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$Users', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'PackingHouseRegisteration',
            localField: 'location',
            foreignField: 'packing_house_code',
            as: 'PackingHouseRegisteration',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$PackingHouseRegisteration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'OrchardRegisteration',
            localField: 'location',
            foreignField: 'orchard_code',
            as: 'OrchardRegisteration',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$OrchardRegisteration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            container_no: 1,
            qa_process: 1,
            location: 1,
            name: 1,
            temperature: 1,
            humidity: 1,
            container_img: 1,
            seal_sending: 1,
            seal_receiving: 1,
            dm_img: 1,
            dm_percentage: 1,
            gap_no: 1,
            gmp_no: 1,
            doa_no: 1,
            du_no: 1,
            cn_no: 1,
          },
        },
      ];

      const qaHistory = await this.qaProcessModel.aggregate(pipeline);
      const data = [];
      for (const i of qaHistory) {
        const details =
          i.qa_process == 'QA orchard'
            ? `GAP No: ${i.gap_no}`
            : i.qa_process == 'QA packing house'
              ? `GMP No: ${i.gmp_no}, DOA No: ${i.doa_no}, DU No: ${i.du_no}, CN No: ${i.cn_no}`
              : i.qa_process == 'QA container sending'
                ? `Container: ${i.container_img}, Seal: ${i.seal_sending}`
                : i.qa_process == 'QA container receiving'
                  ? `Seal: ${i.seal_receiving}`
                  : i.qa_process.startsWith('QA DM')
                    ? `dm percentage: ${i.dm_percentage}`
                    : `Temperature: ${i.temperature}, Humidity: ${i.humidity}`;

        data.push({
          container_no: i.container_no,
          qa_process: i.qa_process,
          location: i.location,
          name: i.name,
          details: details,
        });
      }

      return {
        status: 'success',
        message: 'Get QA history success',
        data: data,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  //* [New Net API] Get transportation history
  async GetTransportationHistory(): Promise<any> {
    try {
      const pipeline = [
        {
          $project: {
            _id: 0,
            reserve_id: 1,
            container_no: 1,
            qa_process: 1,
            temperature: 1,
            humidity: 1,
            gps_no: 1,
            packing_house_code: '$location',
            date_time: '$created_at',
          },
        },
        {
          $match: {
            qa_process: 'QA container before close',
          },
        },
      ];

      const transportationHistory = await this.qaProcessModel
        .aggregate(pipeline)
        .exec();

      return {
        status: 'success',
        message: 'Get transportation history success',
        data: transportationHistory,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // [get] all booking information
  async GetAllBooking(): Promise<any> {
    try {
      const booking = await this.reserveTransportationModel
        .find()
        .select('-_id booking_ref');
      const bookingList = [];
      for (const i of booking) bookingList.push(i.booking_ref);
      return {
        status: 'success',
        message: 'Get all booking information success',
        data: bookingList,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  // [POST] booking detail
  async BookingDetails(validator: BookingDetailsDto): Promise<any> {
    try {
      const pipeline = [
        {
          $match: {
            booking_ref: validator.booking_ref,
          },
        },
        {
          $lookup: {
            from: 'PackingHouseRegisteration',
            localField: 'packing_house_code',
            foreignField: 'packing_house_code',
            as: 'PackingHouseRegisteration',
          },
        },
        {
          $replaceRoot: {
            newRoot: {
              $mergeObjects: [
                {
                  $arrayElemAt: ['$PackingHouseRegisteration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            booking_ref: 1,
            product_name: 1,
            freight_forwarder: 1,
            email_freight: 1,
            destination: 1,
            container_type: 1,
            container_no: 1,
            weight: 1,
            deliver_date: '$date_time',
            trademark_img: 1,
            packaging_no: 1,
            packaging_shape: 1,
            product_list: 1,
            volume: 1,
            export_type: 1,
            air_line: 1,
            flight: 1,
            flight_arrive_date: 1,
            flight_depart_date: 1,

            packing_house_code: 1,
            packing_house_name: 1,
            doa_img: 1,
            gmp_img: 1,
            du_img: 1,
            cn_img: 1,

            orchard_code: 1,
          },
        },
      ];

      const booking = await this.reserveTransportationModel.aggregate(pipeline);
      const gapFile = [];
      const orchardName = [];

      for (const i of booking[0].orchard_code) {
        const orchard = await this.orchardRegisterModel
          .findOne({ orchard_code: i })
          .select('-_id gap_img orchard_name');
        gapFile.push(orchard.gap_img);
        orchardName.push(orchard.orchard_name);
      }

      booking[0].gap = gapFile;
      booking[0].orchard_name = orchardName;

      return {
        status: 'success',
        message: 'Get booking detail success',
        data: booking,
      };
    } catch (error) {
      return {
        status: 'error',
        message: error.message,
      };
    }
  }

  //* [GET] /qa-process/container-seal-th-history
  async GetContainerSealTHHistory(): Promise<any> {
    try {
      const pipeline = [
        {
          $match: {
            qa_process: 'QA container sending',
          },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'qa_by',
            foreignField: '_id',
            as: 'result_Users',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  qa_name: '$name',
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
                  $arrayElemAt: ['$result_Users', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'PackingHouseRegisteration',
            localField: 'location',
            foreignField: 'packing_house_code',
            as: 'result_PackingHouseRegisteration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  packing_house_name: 1,
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
                  $arrayElemAt: ['$result_PackingHouseRegisteration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            qa_by: 0,
            result_Users: 0,
            result_PackingHouseRegisteration: 0,
            temperature: 0,
            humidity: 0,
            dm_img: 0,
            dm_percentage: 0,
            seal_receiving: 0,
            is_seal_pass: 0,
            seal_no_receiving: 0,
          },
        },
      ];

      const ContainerSealHistory =
        await this.qaProcessModel.aggregate(pipeline);

      return {
        status: 'success',
        message: 'Get Container Seal Thailand history success',
        data: ContainerSealHistory,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  //* [GET] /qa-process/container-seal-cn-history
  async GetContainerSealCNHistory(): Promise<any> {
    try {
      const pipeline = [
        {
          $match: {
            qa_process: 'QA container receiving',
          },
        },
        {
          $lookup: {
            from: 'Users',
            localField: 'qa_by',
            foreignField: '_id',
            as: 'result_Users',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  qa_name: '$name',
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
                  $arrayElemAt: ['$result_Users', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $lookup: {
            from: 'PackingHouseRegisteration',
            localField: 'location',
            foreignField: 'packing_house_code',
            as: 'result_PackingHouseRegisteration',
            pipeline: [
              {
                $project: {
                  _id: 0,
                  packing_house_name: 1,
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
                  $arrayElemAt: ['$result_PackingHouseRegisteration', 0],
                },
                '$$ROOT',
              ],
            },
          },
        },
        {
          $project: {
            _id: 0,
            qa_by: 0,
            result_Users: 0,
            result_PackingHouseRegisteration: 0,
            temperature: 0,
            humidity: 0,
            dm_img: 0,
            dm_percentage: 0,
            seal_sending: 0,
            seal_no_sending: 0,
            container_img: 0,
          },
        },
      ];

      const ContainerSealHistory =
        await this.qaProcessModel.aggregate(pipeline);

      return {
        status: 'success',
        message: 'Get Container Seal China history success',
        data: ContainerSealHistory,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  // //* [GET] /qa-process/check-rfid
  // async checkNonRFIDCode() {
  //   try {

  //     const dataDurian = []
  //     const dataCh1 = []
  //     const durianRegister = await this.durianRegistrationModel.find().select('-_id rfid_code')
  //     for (const i of durianRegister) { dataDurian.push(i.rfid_code) }

  //     const ch1RFID = await this.ChemicalProcess1Model.find().select('-_id rfid_code')
  //     for (const i of ch1RFID) { dataCh1.push(i.rfid_code) }

  //     let resultArray = dataDurian.filter(item => !dataCh1.includes(item));

  //     return resultArray

  //   } catch (error) {
  //     throw new BadRequestException(error.message)
  //   }
  // }
}
