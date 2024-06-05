import { Module } from '@nestjs/common';
import { GradeSettingService } from './grade-setting.service';
import { GradeSettingController } from './grade-setting.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { GradeSetting, GradeSettingSchema } from '../schema/grade-setting/grade-setting.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: GradeSetting.name,
        schema: GradeSettingSchema,
      },]),
  ],
  controllers: [GradeSettingController],
  providers: [GradeSettingService],
  exports: [GradeSettingService],
})
export class GradeSettingModule {


}
