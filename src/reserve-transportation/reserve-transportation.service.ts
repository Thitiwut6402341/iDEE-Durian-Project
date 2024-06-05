import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { ReserveTransportation, ReserveTransportationDocument } from 'src/schema/reserve-transportation/register-reserve.schema';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { TJwtPayload } from 'src/types/jwt-payload';
const Ftp = require("ftp");
import { EditReserveDto } from './dto/edit-reserve.dto';


@Injectable()
export class ReserveTransportationService {
    constructor(
        @InjectModel(ReserveTransportation.name)
        private ReserveTransportationModel: Model<ReserveTransportationDocument>,
    ) { }

    async uploadFileFromBase64(client, base64Data, remote) {
        return new Promise((resolve, reject) => {
            const buffer = Buffer.from(base64Data, "base64");
            client.put(buffer, remote, async function (err) {
                if (err) reject(err);
                resolve(true);
            });
        });
    }

    //* [POST] /reserve/transportation
    async newBooking(
        createReserveDto: CreateReserveDto,
        decoded: TJwtPayload,
    ): Promise<any> {
        try {
            const now = new Date();

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
                client.on("ready", resolve);
                client.on("error", reject);
            });

            let url = null;

            const {
                product_name,
                packing_house_code,
                destination,
                container_type,
                container_no,
                weight,
                date_time,
                product_list,
                packaging_shape,
                volume,
                booking_ref,
                freight_forwarder,
                packaging_no,
                export_type,
                air_line,
                flight,
                flight_depart_date,
                flight_arrive_date,
                trade_mark,
            } = createReserveDto;

            // const checkDuplicate = await this.ReserveTransportationModel.find({ packing_house_code: packing_house_code })

            // if (checkDuplicate.length > 0) throw new BadRequestException('packing_house_code duplicated');

            // for PDF file
            if (trade_mark != null && trade_mark.startsWith('data:application/pdf;base64,')) {
                const fileName = `trade_mark_${packing_house_code}_${Date.now()}.pdf`
                const base64Data = trade_mark.replace(/^data:application\/\w+;base64,/, '')
                await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
                url = `https://${base_url}/data/idee/${fileName}`
            }
            // for img file
            else if (trade_mark != null) {
                const fileName = `trade_mark_${packing_house_code}_${Date.now()}.png`
                const base64Data = trade_mark.replace(/^data:image\/\w+;base64,/, '')
                await this.uploadFileFromBase64(client, base64Data, `/CoDE_Data/iDEE/${fileName}`)
                url = `https://${base_url}/data/idee/${fileName}`
            }

            let reserve: any

            if (export_type === 'plane') {
                reserve = await this.ReserveTransportationModel.create({
                    product_name: product_name,
                    packing_house_code: packing_house_code,
                    destination: destination,
                    container_type: container_type,
                    container_no: container_no,
                    weight: weight,
                    date_time: date_time,
                    product_list: product_list,
                    packaging_shape: packaging_shape,
                    volume: volume,
                    booking_ref: booking_ref,
                    freight_forwarder: freight_forwarder,
                    packaging_no: packaging_no,
                    export_type: export_type,
                    air_line: air_line,
                    flight: flight,
                    flight_depart_date: flight_depart_date,
                    flight_arrive_date: flight_arrive_date,
                    trade_mark: url,
                    created_at: now,
                    updated_at: now,
                    creator_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
                });
            } else {
                reserve = await this.ReserveTransportationModel.create({
                    product_name: product_name,
                    packing_house_code: packing_house_code,
                    destination: destination,
                    container_type: container_type,
                    container_no: container_no,
                    weight: weight,
                    date_time: date_time,
                    product_list: product_list,
                    packaging_shape: packaging_shape,
                    volume: volume,
                    booking_ref: booking_ref,
                    freight_forwarder: freight_forwarder,
                    packaging_no: packaging_no,
                    export_type: export_type,
                    air_line: null,
                    flight: null,
                    flight_depart_date: null,
                    flight_arrive_date: null,
                    trade_mark: url,
                    created_at: now,
                    updated_at: now,
                    creator_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),

                });
            }

            client.end()
            return {
                status: 'success',
                message: 'Serve Transportation successfully',
                data: reserve
            }

        } catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: [],
            };
        }

    }

    //* [PUT] /reserve/edit-transportation
    async editReserveTransportation(validator: EditReserveDto, decoded: any): Promise<any> {
        try {
            const now = new Date();

            const {
                reserve_id,
                product_name,
                packing_house_code,
                destination,
                container_type,
                container_no,
                weight,
                date_time,
                product_list,
                packaging_shape,
                volume,
                booking_ref,
                freight_forwarder,
                export_type,
                air_line,
                flight,
                flight_depart_date,
                flight_arrive_date,
                trade_mark,
                packaging_no,
            } = validator;

            const checkData = await this.ReserveTransportationModel.findOne({
                _id: mongoose.mongo.BSON.ObjectId.createFromHexString(validator.reserve_id),
            }).exec();

            if (!checkData) {
                return {
                    status: 'error',
                    message: 'Not found booking!',
                    data: [],
                };
            }

            const updateData = await this.ReserveTransportationModel.updateOne({ _id: validator.reserve_id }, {
                $set: {
                    product_name: product_name,
                    packing_house_code: packing_house_code,
                    destination: destination,
                    container_type: container_type,
                    container_no: container_no,
                    weight: weight,
                    date_time: date_time,
                    product_list: product_list,
                    packaging_shape: packaging_shape,
                    volume: volume,
                    booking_ref: booking_ref,
                    freight_forwarder: freight_forwarder,
                    export_type: export_type,
                    air_line: air_line,
                    flight: flight,
                    flight_depart_date: flight_depart_date,
                    flight_arrive_date: flight_arrive_date,
                    trade_mark: trade_mark,
                    packaging_no: packaging_no,
                    updated_at: now,
                    update_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
                }
            })

            return {
                status: 'success',
                message: 'Update booking success',
                data: updateData
            }

        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: [],
            };
        }

    }

    //* [GET] /reserve/all-transportation
    async getReserveTransportation(reserve_id: string) {
        try {

            const result = await this.ReserveTransportationModel.aggregate(
                [
                    {
                        '$match': {
                            '_id': mongoose.mongo.BSON.ObjectId.createFromHexString(reserve_id)
                        }
                    }, {
                        '$project': {
                            '_id': 0,
                            'reserve_id': {
                                '$toString': '$_id'
                            },
                            'product_name': 1,
                            'packing_house_code': 1,
                            'destination': 1,
                            'container_type': 1,
                            'container_no': 1,
                            'weight': 1,
                            'date_time': 1,
                            'product_list': 1,
                            'volume': 1,
                            'booking_ref': 1,
                            'freight_forwarder': 1,
                            'export_type': 1,
                            'air_line': 1,
                            'flight': 1,
                            'flight_depart_date': 1,
                            'flight_arrive_date': 1,
                            'trade_mark': 1,
                            'packaging_no': 1,
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
                            }
                        }
                    }
                ]

            )

            if (!result) {
                return {
                    status: 'error',
                    message: 'booking not found!',
                    data: [],
                };
            }

            return {
                status: 'success',
                message: 'Get reserve by id successfully',
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

    //* [GET] /reserve/all-transportation
    async getAllReserveTransportation(): Promise<any> {
        try {

            const result = await this.ReserveTransportationModel.aggregate(
                [
                    {
                        '$project': {
                            '_id': 0,
                            'reserve_id': {
                                '$toString': '$_id'
                            },
                            'product_name': 1,
                            'packing_house_code': 1,
                            'destination': 1,
                            'container_type': 1,
                            'container_no': 1,
                            'weight': 1,
                            'date_time': 1,
                            'product_list': 1,
                            'volume': 1,
                            'booking_ref': 1,
                            'freight_forwarder': 1,
                            'export_type': 1,
                            'air_line': 1,
                            'flight': 1,
                            'flight_depart_date': 1,
                            'flight_arrive_date': 1,
                            'trade_mark': 1,
                            'packaging_no': 1,
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
                            }
                        }
                    }
                ]

            )

            if (!result) {
                return {
                    status: 'error',
                    message: 'booking not found!',
                    data: [],
                };
            }

            return {
                status: 'success',
                message: 'Get all reserve successfully',
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

    //* [DELETE] /reserve/delete
    async deleteReserve(reserve_id: string): Promise<any> {
        try {
            const checkData = await this.ReserveTransportationModel.findOne({
                _id: reserve_id,
            }).exec();

            if (!checkData) {
                return {
                    status: 'error',
                    message: 'Not found orchard code!',
                    data: [],
                };
            }

            const deleteData = await this.ReserveTransportationModel.findOneAndDelete({
                _id: reserve_id,

            }).exec();

            return {
                status: 'success',
                message: 'Delete orchard successfully!',
                data: [],
            };
        } catch (error) {
            return new InternalServerErrorException({
                status: 'error',
                message: error.message,
            });
        }
    }



}
