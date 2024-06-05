import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ExperimentData } from 'src/schema/experiment-data/experiment-data.schema';
import { InsertRawDataDto } from './dto/insert-rawdata.dto';
import { UploadPictureDto } from './dto/upload-picture.dto';
import { UpdateRawDataDto } from './dto/update-rawdata.dto';
import { response } from 'express';
const Ftp = require("ftp");


@Injectable()
export class RawdataService {
    constructor(
        @InjectModel(ExperimentData.name) private readonly experimentDataModel: Model<ExperimentData>,

    ) { }

    //* [POST] /raw-data/insert
    async insertRawData(validator: InsertRawDataDto,): Promise<any> {
        try {
            const insertData = new this.experimentDataModel({
                information: validator.information,
                created_at: new Date(),
                updated_at: new Date()

            });
            await insertData.save();

            return {
                status: 'success',
                message: 'insert new experiment data success',
                data: insertData
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: []
            }
        }
    }

    //* [PUT] /raw-data/update
    async updateRawData(validator: UpdateRawDataDto,): Promise<any> {
        try {
            const updateData = await this.experimentDataModel.findOneAndUpdate(
                { _id: validator.id },
                {
                    information: validator.information,
                    updated_at: new Date()
                },
                { new: true }
            );

            return {
                status: 'success',
                message: 'update experiment data success',
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

    //* [GET] /raw-data/get-all
    async getAllRawData(): Promise<any> {
        try {
            const allData = await this.experimentDataModel.find();
            return {
                status: 'success',
                message: 'get all experiment data success',
                data: allData
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: []
            }
        }
    }

    async uploadFileFromBase64(client, base64Data, remote) {
        return new Promise((resolve, reject) => {
            const buffer = Buffer.from(base64Data, "base64");
            client.put(buffer, remote, async function (err) {
                if (err) reject(err);
                resolve(true);
            });
        });
    }

    async uploadPicture(validator: UploadPictureDto): Promise<any> {
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

            const allData = await this.experimentDataModel.find();

            let fileUrlTop = null;
            let fileUrlBottom = null;
            let fileUrlLeft = null;
            let fileUrlRight = null;
            let fileUrlFront = null;
            let fileUrlBack = null;

            for (const entry of allData) {
                for (const info of entry.information) {
                    const { test_code, durian_picture } = info;

                    if (test_code === validator.test_code) {

                        if (validator.picture_top !== null) {
                            const fileNameTop = `${validator.test_code}_top_side_${Date.now()}.png`;
                            const base64Data_Top = validator.picture_top.split(';base64,').pop();
                            await this.uploadFileFromBase64(client, base64Data_Top, `/CoDE_Data/iDEE/${fileNameTop}`);
                            fileUrlTop = `https://${base_url}/data/idee/${fileNameTop}`;
                        }


                        if (validator.picture_bottom !== null) {
                            const fileNameBottom = `${validator.test_code}_bottom_side_${Date.now()}.png`;
                            const base64Data_Bottom = validator.picture_bottom.split(';base64,').pop();
                            await this.uploadFileFromBase64(client, base64Data_Bottom, `/CoDE_Data/iDEE/${fileNameBottom}`);
                            fileUrlBottom = `https://${base_url}/data/idee/${fileNameBottom}`;
                        }

                        if (validator.picture_left !== null) {
                            const fileNameLeft = `${validator.test_code}_left_side_${Date.now()}.png`;
                            const base64Data_Left = validator.picture_left.split(';base64,').pop();
                            await this.uploadFileFromBase64(client, base64Data_Left, `/CoDE_Data/iDEE/${fileNameLeft}`);
                            fileUrlLeft = `https://${base_url}/data/idee/${fileNameLeft}`;
                        }
                        if (validator.picture_right !== null) {
                            const fileNameRight = `${validator.test_code}_right_side_${Date.now()}.png`;
                            const base64Data_Right = validator.picture_right.split(';base64,').pop();
                            await this.uploadFileFromBase64(client, base64Data_Right, `/CoDE_Data/iDEE/${fileNameRight}`);
                            fileUrlRight = `https://${base_url}/data/idee/${fileNameRight}`;
                        }

                        if (validator.picture_front !== null) {
                            const fileNameFront = `${validator.test_code}_front_side_${Date.now()}.png`;
                            const base64Data_Front = validator.picture_front.split(';base64,').pop();
                            await this.uploadFileFromBase64(client, base64Data_Front, `/CoDE_Data/iDEE/${fileNameFront}`);
                            fileUrlFront = `https://${base_url}/data/idee/${fileNameFront}`;
                        }

                        if (validator.picture_back !== null) {
                            const fileNameBack = `${validator.test_code}_back_side_${Date.now()}.png`;
                            const base64Data_Back = validator.picture_back.split(';base64,').pop();
                            await this.uploadFileFromBase64(client, base64Data_Back, `/CoDE_Data/iDEE/${fileNameBack}`);
                            fileUrlBack = `https://${base_url}/data/idee/${fileNameBack}`;
                        }

                        info.durian_picture = {
                            top: fileUrlTop,
                            bottom: fileUrlBottom,
                            left: fileUrlLeft,
                            right: fileUrlRight,
                            front: fileUrlFront,
                            back: fileUrlBack,
                        };
                    }
                }
            }
            const a = await this.experimentDataModel.updateOne(
                {
                    _id: validator.id,
                },
                { $set: { information: allData[0].information } });

            // Disconnect from FTP server
            client.end();

            return {
                status: 'success',
                message: 'Uploaded pictures successfully',
                data: allData,
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