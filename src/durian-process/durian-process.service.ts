import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RejectProcess } from 'src/schema/durian-process';
import { Model } from 'mongoose';
import { RejectProcessDocument } from 'src/schema/durian-process/reject-process.schema';
import { DurianRejectDto } from 'src/durian-process/dto/durian-reject.dto';
import * as mongoose from 'mongoose';
import { TJwtPayload } from 'src/types/jwt-payload';
import { TServiceResponse } from 'src/types/service-response';
import { User } from 'src/schema/user.schema';
import { DurianRegistration } from 'src/schema/durian-registration.schema';
// import { IsNull } from 'typeorm';
import { TreesRegistration } from 'src/schema/trees-registration.schema';

@Injectable()
export class DurianProcessService {
  constructor(
    @InjectModel(RejectProcess.name)
    private readonly RejectProcessModel: Model<RejectProcessDocument>,
    @InjectModel(User.name) private readonly UsersModel: Model<User>,
    @InjectModel(DurianRegistration.name)
    private readonly DurianRegistrationModel: Model<DurianRegistration>,
    @InjectModel(TreesRegistration.name)
    private TreeRegisterModel: Model<TreesRegistration>,
  ) {}

  //* [POST] /durian-process/reject
  async rejectDurianProcess(
    validator: DurianRejectDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const saved = await this.RejectProcessModel.create({
        rfid_code: validator.rfid_code,
        reject_reason: validator.reject_reason,
        creator_id: mongoose.mongo.BSON.ObjectId.createFromHexString(
          decoded.user_id,
        ),
        created_at: now,
        updated_at: now,
      });

      await this.DurianRegistrationModel.updateOne(
        { rfid_code: validator.rfid_code },
        { $set: { is_reject: false, updated_at: now } },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Create reason reject durian successfully!',
        data: [saved],
      };
    } catch (error) {
      return {
        status: 'success',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }
}
