import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RejectProcess } from 'src/schema/durian-process';
import { Model } from 'mongoose';
import { RejectProcessDocument } from 'src/schema/durian-process/reject-process.schema';
import { DurianRejectDto } from 'src/durian-process/dto/durian-reject.dto';
import * as mongoose from 'mongoose';
import { TJwtPayload } from 'src/types/jwt-payload';
import { User } from 'src/schema/user.schema';

@Injectable()
export class DurianProcessService {
    constructor(
        @InjectModel(RejectProcess.name) private readonly rejectProcessModel: Model<RejectProcessDocument>,
        @InjectModel(User.name) private readonly usersModel: Model<User>,
    ) { }

    //* [POST] /durian-process/reject
    async rejectDurianProcess(validator: DurianRejectDto, decoded: any,): Promise<any> {
        try {
            const now = new Date()

            const fruitCode = validator.fruit_code;
            const rejectReason = validator.reject_reason;

            const checkCreatorName = await this.usersModel.findOne({ _id: decoded.user_id });
            const checkFruitCode = await this.rejectProcessModel.findOne({ fruit_code: fruitCode });

            if (checkFruitCode) {
                const updateData = await this.rejectProcessModel.findOneAndUpdate({ fruit_code: fruitCode }, {
                    fruit_code: fruitCode,
                    reject_reason: rejectReason,
                    created_by: checkCreatorName.name,
                    updated_at: now,
                    creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id)
                });

                return {
                    status: 'success',
                    message: 'Update reason for reject durian successfully!',
                    data: [],
                };

            } else {
                const newData = new this.rejectProcessModel({
                    fruit_code: fruitCode,
                    reject_reason: rejectReason,
                    created_by: checkCreatorName.name,
                    created_at: now,
                    updated_at: now,
                    creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id)
                });

                const result = await newData.save();

                return {
                    status: 'success',
                    message: 'Create reason reject durian successfully!',
                    data: [result],
                };
            }



        } catch (error) {
            return new InternalServerErrorException({
                status: 'error',
                message: error.message
            })

        }

    }
}
