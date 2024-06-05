import { Body, Controller, Post, Req } from '@nestjs/common';
import { GradeSettingService } from './grade-setting.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { Request } from 'express';
import { CreateGradeConditionDto } from './dto';
import { ExportGradeDto } from './dto/export-grade.dto';


@Controller('grade-setting')
export class GradeSettingController {
  constructor(private readonly gradeSettingService: GradeSettingService) { }


  @Post('create-condition')
  async createGradeCondition(
    @Body() createGradeConditionDto: CreateGradeConditionDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.gradeSettingService.createGradeCondition(createGradeConditionDto, req.decoded);
  }

  @Post('export-grade')
  async exportGrade(
    // @Body() exportGradeDto: ExportGradeDto,
    @Body()
    inspected_grade: string,
    number_of_segments: number,
    weight: number,

  ): Promise<any> {
    return this.gradeSettingService.exportGrade(inspected_grade, number_of_segments, weight);
  }
}
