import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { query } from 'express';
import mongoose, { Model } from 'mongoose';
import { GradeSetting, GradeSettingDocument } from 'src/schema/grade-setting';
import { CreateGradeConditionDto } from './dto';
import { TJwtPayload } from 'src/types/jwt-payload';
import { ExportGradeDto } from './dto/export-grade.dto';

@Injectable()
export class GradeSettingService {
    constructor(
        @InjectModel(GradeSetting.name)
        private gradeSettingModel: Model<GradeSettingDocument>,
    ) { }

    //* [POST] /grade-setting/create-condition
    async createGradeCondition(
        validator: CreateGradeConditionDto,
        decoded: TJwtPayload,
    ) {
        try {

            const insertData = await this.gradeSettingModel.create({
                effective_date: validator.effective_date,
                grade_system: validator.grade_system,
                creator_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),

            });

            return {
                status: 'success',
                message: 'Grade condition created successfully',
                data: [insertData],
            };

        }
        catch (error) {
            return {
                status: 'error',
                message: error.message,
                data: [],
            };
        }
    }

    public async exportGrade(inspected_grade: string, number_of_segments: number, weight: number): Promise<any> {
        try {

            const today = new Date().toJSON().slice(0, 10);

            const queryData = await this.gradeSettingModel.aggregate(
                [
                    {
                        '$project': {
                            '_id': 0,
                            'today': today,
                            'effective_date': 1,
                            'grade_system': 1,
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
                    }, {
                        '$match': {
                            '$expr': {
                                '$gt': [
                                    '$today', '$effective_date'
                                ]
                            }
                        }
                    }, {
                        '$sort': {
                            'effective_date': -1
                        }
                    }, {
                        '$limit': 1
                    }
                ]

            );
            // console.log(queryData);

            const result = queryData[0]?.grade_system?.find((item) =>
                eval(item.formula)(inspected_grade, number_of_segments, weight),
            );


            const export_grade = result?.grade ?? 'No grade found';

            return {
                status: 'success',
                message: 'Grade Setting exported successfully',
                data: [{ export_grade: export_grade }]

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
