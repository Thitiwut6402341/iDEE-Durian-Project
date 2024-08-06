import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, mongo } from 'mongoose';
import {
  DurianRegistration,
  DurianRegistrationDocument,
} from 'src/schema/durian-register';
// import { DepartmentProvincial } from 'src/schema/department-provincial.schema';
import { TreesRegistration } from 'src/schema/trees-registration.schema';
import { TServiceResponse } from 'src/types/service-response';
import {
  RegisterDurianDto,
  GradeInspectionDto /*,RegisterDurianTagDto*/,
} from './dto';
import { TJwtPayload } from 'src/types/jwt-payload';

@Injectable()
export class DurianRegisterService {
  constructor(
    @InjectModel(DurianRegistration.name)
    private DurianRegisterModel: Model<DurianRegistrationDocument>,
    // @InjectModel(DepartmentProvincial.name) private areaModel: Model<DepartmentProvincial>,
    @InjectModel(TreesRegistration.name)
    private treeRegisterModel: Model<TreesRegistration>,
  ) {}

  // [POST] durian tag (match durian tag with tree)
  async registerDurian(
    validator: RegisterDurianDto,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      // check rfid code exists
      const checkRfidExists = await this.DurianRegisterModel.find({
        rfid_code: { $in: validator.rfid_codes },
      }).select('-_id rfid_code');
      const rfidExists = checkRfidExists.map((item) => item.rfid_code);
      const rfidNotExists = validator.rfid_codes.filter(
        (item) => !rfidExists.includes(item),
      );

      if (rfidNotExists.length === 0)
        return {
          status: 'error',
          statusCode: 400,
          message: 'RFID code already exists',
          data: [],
        };

      // get orchard code
      const orchardCode = await this.treeRegisterModel
        .findOne({ tree_code: validator.tree_code })
        .select('-_id orchard_code');

      //! Bypass orchard code & tree code
      const documents = rfidNotExists.map((rfid) => ({
        tree_code: validator.tree_code,
        orchard_code: orchardCode?.orchard_code ?? null,
        packing_house_code: null,
        rfid_code: rfid,
        container_no: null,
        inspected_grade: null,
        export_grade: null,
        maturity: null,
        weight: null,
        number_of_segments: null,
        gps_no: null,
        inspected_by: null,
        remarks: null,
        status: true,
        is_reject: true,
        booking_ref: null,
        created_at: now,
        updated_at: now,
        registered_at: now,
      }));

      const saved = await this.DurianRegisterModel.insertMany(documents);

      return {
        status: 'success',
        statusCode: 201,
        message: 'Register durian successfully',
        data: [{ inserted_count: saved.length }],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }

  // [PATCH] grade inspection
  async GradeInspection(
    validator: GradeInspectionDto,
    decoded: TJwtPayload,
  ): Promise<TServiceResponse> {
    try {
      const now = new Date();
      // // if (process.platform !== 'win32') now.setHours(now.getHours() - 7);

      const updated = await this.DurianRegisterModel.updateMany(
        { rfid_code: { $in: validator.rfid_codes } },
        {
          $set: {
            inspected_grade: validator.inspected_grade,
            inspected_by: mongo.BSON.ObjectId.createFromHexString(
              decoded.user_id,
            ),
            remarks: !Boolean(validator.remarks) ? 1 : validator.remarks,
            updated_at: now,
          },
        },
      );

      return {
        status: 'success',
        statusCode: 201,
        message: 'Grade inspection successfully',
        data: [updated],
      };
    } catch (error) {
      return {
        status: 'error',
        statusCode: 500,
        message: error.message,
        data: [],
      };
    }
  }
}
