import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DurianRegistration } from 'src/schema/durian-registration.schema';
import { DepartmentProvincial } from 'src/schema/department-provincial.schema';
import { RegisterDurianDto } from './dto/register-durian.dto';
import { TreesRegistration } from 'src/schema/trees-registration.schema';
import { GradeInspectionDto } from './dto/grade_inspection.dto';
import { User } from 'src/schema/user.schema';

@Injectable()
export class DurianRegisterService {
  constructor(
    @InjectModel(DurianRegistration.name) private durianRegisterModel: Model<DurianRegistration>,
    @InjectModel(DepartmentProvincial.name) private areaModel: Model<DepartmentProvincial>,
    @InjectModel(TreesRegistration.name) private treeRegisterModel: Model<TreesRegistration>,
  ) { }

  // [POST] durian tag (match durian tag with tree)
  async RegisterDurian(validator: RegisterDurianDto): Promise<any> {
    try {
      const now = new Date()
      // now.setHours(now.getHours() + 7)

      // get orchard code
      const orchardCode = await this.treeRegisterModel.findOne({ tree_code: validator.tree_code }).select('-_id orchard_code')

      // check durian tag in the same province
      const provinceCode = orchardCode.orchard_code.slice(0, 2)
      const checkDurianTag = await this.durianRegisterModel.find({ fruit_code: { $regex: `TH${provinceCode}`, $options: 'i' } }).exec()
      let presentNumber = checkDurianTag.length // present number of tag

      // register into the system
      const tag = []
      for (const rfid of validator.rfid_code) {
        const runNumber = presentNumber + 1
        presentNumber = runNumber
        const fruitCode = `TH${provinceCode}A${runNumber.toString().padStart(6, '0')}`
        tag.push(fruitCode)

        // prevent duplicate rfid
        const checkDuplicateRfid = await this.durianRegisterModel.findOne({ rfid_code: rfid })
        if (checkDuplicateRfid) {
          await this.durianRegisterModel.updateOne({ rfid_code: rfid }, {
            updated_at: now,
          })
        } else {
          // regist to DB
          await this.durianRegisterModel.create({
            tree_code: validator.tree_code,
            orchard_code: orchardCode.orchard_code,
            packing_house_code: null,
            rfid_code: rfid,
            fruit_code: fruitCode,
            lot_id: null,
            maturity: null,
            inspected_grade: null,
            inspected_by: null,
            remarks: null,
            created_at: now,
            updated_at: now,
            registered_at: now,
          })
        }
      }

      return {
        status: 'success',
        message: 'Register durian success',
        data: tag
      }

    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }

  // [PATCH] grade inspection
  async GradeInspection(validator: GradeInspectionDto, decoded: any): Promise<any> {
    try {
      const now = new Date()
      // now.setHours(now.getHours() + 7)

      // prevent miss fruit_code
      const durianTag = await this.durianRegisterModel.findOne({ rfid_code: validator.rfid_code })
      if (!durianTag) {
        return {
          status: 'error',
          message: 'RFID code not found',
          data: []
        }
      }

      // inspect
      const inspectGrade = await this.durianRegisterModel.updateOne({ rfid_code: validator.rfid_code }, {
        inspected_grade: validator.inspected_grade,
        remarks: validator.remarks,
        inspected_by: mongoose.mongo.BSON.ObjectId.createFromHexString(decoded.user_id),
        updated_at: now,
      })

      return {
        status: 'success',
        message: 'Grade inspection success',
        data: inspectGrade
      }


    } catch (error) {
      return {
        status: 'error',
        message: error.message,
        data: []
      }
    }
  }


}
