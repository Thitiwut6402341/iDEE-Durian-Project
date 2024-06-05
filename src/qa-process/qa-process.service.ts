import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { OrchardRegister } from 'src/schema/orchard-registration.schema';
import { PackingHouseRegister } from 'src/schema/packing-house-registration.schema';
import { QAOrchardDto } from './dto/qa-orchard.dto';
import { QAPackingHouseDto } from './dto/qa-packing-house.dto';
import { DMPercentage } from 'src/schema/dm-percentage.schema';
import { DMPercentageDto } from './dto/dm-percen.dto';
import { UpdatePackagingNoDto } from './dto/update-packaging-no.dto';
import { ReserveTransportation } from 'src/schema/reserve-transportation/register-reserve.schema';
import { Container } from 'src/schema/container.schema';
import { ContainerSendDto } from './dto/container-send.dto';
import { ContainerReceiveDto } from './dto/container-receive.dto';
import { DocumentsDto } from './dto/documents.dto';
const Ftp = require("ftp");

@Injectable()
export class QaProcessService {
  constructor(
    @InjectModel(OrchardRegister.name) private orchardRegisterModel: Model<OrchardRegister>,
    @InjectModel(PackingHouseRegister.name) private packingHouseRegisterModel: Model<PackingHouseRegister>,
    @InjectModel(DMPercentage.name) private dmPercentageModel: Model<DMPercentage>,
    @InjectModel(ReserveTransportation.name) private reserveTransportationModel: Model<ReserveTransportation>,
    @InjectModel(Container.name) private containerModel: Model<Container>,
  ) {}

  // upload file into FTP server.
  async uploadFileFromBase64(client, base64Data, remote) {
    return new Promise((resolve, reject) => {
        const buffer = Buffer.from(base64Data, "base64");
        client.put(buffer, remote, async function (err) {
            if (err) reject(err);
            resolve(true);
        });
    });
}

  // [PATCH] QA orchard; request GAP no. anf GAP file.
  async QAOrchard(validator: QAOrchardDto, decode: any): Promise<any>{
    try {
      const now = new Date();

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
          client.on("ready", resolve);
          client.on("error", reject);
      });

      let url = null;

      // for PDF file
      if (validator.gap_file != null && validator.gap_file.startsWith('data:application/pdf;base64,')) {
        const fileName = `GAP-${validator.gap_no}.pdf`
        const base64Data = validator.gap_file.replace(/^data:application\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        url = `https://${base_url}/data/idee/${fileName}`
      }
      // for img file
      else if (validator.gap_file != null) {
        const fileName = `GAP-${validator.gap_no}.png`
        const base64Data = validator.gap_file.replace(/^data:image\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        url = `https://${base_url}/data/idee/${fileName}`
      }

      const QAOrchard = await this.orchardRegisterModel.updateOne({orchard_code: validator.orchard_code}, {
        gap_no: validator.gap_no,
        gap_img: url,
        is_qa_verify: true,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decode.user_id),
        updated_at: now
      })

      client.end()

      return {
        status: 'success',
        message: 'QA orchard success',
        data: QAOrchard
      }

    }catch(error){
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  // [PATCH] QA packing house; request GMP no. anf GMP file.
  async QAPackingHouse(validator: QAPackingHouseDto, decode: any): Promise<any>{
    try {
      const now = new Date();

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
          client.on("ready", resolve);
          client.on("error", reject);
      });

      let gmpUrl = null;
      let doaUrl = null;

      // for GMP PDF file
      if (validator.gmp_file != null && validator.gmp_file.startsWith('data:application/pdf;base64,')) {
        const fileName = `GMP-${validator.gmp_no}.pdf`
        const base64Data = validator.gmp_file.replace(/^data:application\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        gmpUrl = `https://${base_url}/data/idee/${fileName}`
      }
      // for GMP img file
      else if (validator.gmp_file != null) {
        const fileName = `GMP-${validator.gmp_no}.png`
        const base64Data = validator.gmp_file.replace(/^data:image\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        gmpUrl = `https://${base_url}/data/idee/${fileName}`
      }

      // for DOA PDF file
      if (validator.doa_file != null && validator.doa_file.startsWith('data:application/pdf;base64,')) {
        const fileName = `DOA-${validator.doa_no}.pdf`
        const base64Data = validator.doa_file.replace(/^data:application\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        doaUrl = `https://${base_url}/data/idee/${fileName}`
      }
      // for DOA img file
      else if (validator.doa_file != null) {
        const fileName = `DOA-${validator.doa_no}.png`
        const base64Data = validator.doa_file.replace(/^data:image\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        doaUrl = `https://${base_url}/data/idee/${fileName}`
      }

      const QAPackingHouse = await this.packingHouseRegisterModel.updateOne({packing_house_code: validator.packing_house_code}, {
        gmp_no: validator.gmp_no,
        gmp_img: gmpUrl,
        doa_no: validator.doa_no,
        doa_img: doaUrl,
        is_qa_verify: true,
        qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decode.user_id),
        updated_at: now
      })

      client.end()

      return {
        status: 'success',
        message: 'QA orchard success',
        data: QAPackingHouse
      }

    }catch(error){
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  // [POST] %DM qualification
  async DMPercentage(validator: DMPercentageDto, decode:any): Promise<any>{
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
          client.on("ready", resolve);
          client.on("error", reject);
      });

      const now = new Date();
      let img = null
      let QADMPercentage = null

      // prevent duplication
      const qa = await this.dmPercentageModel.findOne({qualified_by: validator.qualified_by, created_at: {$gte: now.setHours(0,0,0,0), $lte: now.setHours(23,59,59,999)}})
      if (qa) {
        if (validator.dm_img != null && validator.dm_img.startsWith('data:image')) {
          const fileName = `DM-${validator.qualified_by}-${now.getTime()}.png`
          const base64Data = validator.dm_img.replace(/^data:image\/\w+;base64,/, '')
          await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
          img = `https://${base_url}/data/idee/${fileName}`
        }

        QADMPercentage = await this.dmPercentageModel.updateOne({qualified_by: validator.qualified_by, created_at: {$gte: now.setHours(0,0,0,0), $lte: now.setHours(23,59,59,999)}}, {
          qa_type: validator.qa_type,
          dm_percentage: validator.dm_percentage,
          dm_img: img,
          qualified_by: validator.qualified_by,
          qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decode.user_id),
          updated_at: now
        })
      
      }else {
        // if QA send an image
        if (validator.dm_img != null && validator.dm_img.startsWith('data:image')) {
          const fileName = `DM-${validator.qualified_by}-${now.getTime()}.png`
          const base64Data = validator.dm_img.replace(/^data:image\/\w+;base64,/, '')
          await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
          img = `https://${base_url}/data/idee/${fileName}`
        }

        QADMPercentage = await this.dmPercentageModel.create({
          qa_type: validator.qa_type,
          dm_percentage: validator.dm_percentage,
          dm_img: img,
          qualified_by: validator.qualified_by,
          qa_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decode.user_id),
          created_at: now,
          updated_at: now
        })
      }
      client.end()

      return {
        status: 'success',
        message: 'Qulification %DM success',
        data: QADMPercentage
      }
    }catch(error){
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  // [PATCH] update packaging number
  async UpdatePackagingNumber(validator: UpdatePackagingNoDto): Promise<any> {
    try {
      const nowe = new Date();

      const checkPackaging = await this.reserveTransportationModel.findOne({booking_ref: validator.booking_ref})
      if (!checkPackaging) {
        return {
          status: 'error',
          message: 'Booking reference not found'
        }
      }

      const updatePackaging = await this.reserveTransportationModel.updateOne({booking_ref: validator.booking_ref}, {
        packaging_no: validator.packaging_no,
        updated_at: nowe
      })

      return {
        status: 'success',
        message: 'Update packaging number success',
        data: updatePackaging
      }

    }catch(error){
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  // [POST] QA container sending
  async QAContainerSend(validator: ContainerSendDto, decoded:any): Promise<any> {
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
          client.on("ready", resolve);
          client.on("error", reject);
      });

      const now = new Date();
      let  containerImg = null
      let sealImg = null

      // upload container image
      if (validator.container_img != null && validator.container_img.startsWith('data:image')) {
        const fileName = `CONTAINER${validator.container_no}.png`
        const base64Data = validator.container_img.replace(/^data:image\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        containerImg = `https://${base_url}/data/idee/${fileName}`
      }

      // upload seal image
      if (validator.seal_sending != null && validator.seal_sending.startsWith('data:image')) {
        const fileName = `SEAL-SEND${validator.container_no}.png`
        const base64Data = validator.seal_sending.replace(/^data:image\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        sealImg = `https://${base_url}/data/idee/${fileName}`
      }

      const qaContainer = await this.containerModel.create({
        container_no: validator.container_no,
        container_img: containerImg,
        seal_sending: sealImg,
        seal_receiving: null,
        sent_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
        received_by: null,
        created_at: now,
        updated_at: now
      })

      client.end()

      return {
        status: 'success',
        message: 'QA container sending success',
        data: qaContainer
      }
    }catch(error){
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  // [PATCH] QA container receiving
  async QAContainerReceive(validator: ContainerReceiveDto, decoded:any): Promise<any> {
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
          client.on("ready", resolve);
          client.on("error", reject);
      });

      const now = new Date()
      let sealImg = null

      // upload seal image
      if (validator.sael_receiving != null && validator.sael_receiving.startsWith('data:image')) {
        const fileName = `SEAL-RECEIVE${validator.container_no}.png`
        const base64Data = validator.sael_receiving.replace(/^data:image\/\w+;base64,/, '')
        await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
        sealImg = `https://${base_url}/data/idee/${fileName}`
      }

      const qaContainer = await this.containerModel.updateOne({container_no: validator.container_no}, {
        seal_receiving: sealImg,
        received_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
        updated_at: now
      })

      return {
        status: 'success',
        message: 'QA container receiving success',
        data: qaContainer
      }
    }catch(error){
      return {
        status: 'error',
        message: error.message
      }
    }
  }

  // [POST] get and sent all necessary documents
  async GetAndSendDocuments(validator: DocumentsDto): Promise<any> {
    try{
      const orchardAndPackingHouse = await this.reserveTransportationModel.findOne({booking_ref: validator.booking_ref})
      if (!orchardAndPackingHouse) {
        return {
          status: 'error',
          message: 'Booking reference not found',
          data: []
        }
      }

      const gmp = await this.packingHouseRegisterModel.findOne({packing_house_code: orchardAndPackingHouse.packing_house_code}).select('-_id gmp_no gmp_img doa_no doa_img')

      const gap = []
      for (const i of orchardAndPackingHouse.orchard_code) {
        const gaps = (await this.orchardRegisterModel.findOne({orchard_code: i})).isSelected('-_id orchard_code orchard_name gap_no gap_img')
        gap.push(gaps)
      }

      return {
        status: 'success',
        message: 'Get and send documents success',
        data: [] 
      }

    }catch(error){
      return {
        status: 'error',
        message: error.message
      }
    }
  }
}
