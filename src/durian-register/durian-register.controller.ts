import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { DurianRegisterService } from './durian-register.service';
import { Request, Response } from 'express';
import { TJwtPayload } from 'src/types/jwt-payload';
import {
  RegisterDurianDto,
  GradeInspectionDto /*,RegisterDurianTagDto*/,
} from './dto';

@Controller('durian-register')
export class DurianRegisterController {
  constructor(private readonly durianRegisterService: DurianRegisterService) {}

  @Post('durian-register')
  async registerDurian(
    @Body() registerDurianDto: RegisterDurianDto,
    @Res() res: Response,
  ) {
    // return await this.durianRegisterService.registerDurian(registerDurianDto);
    const result =
      await this.durianRegisterService.registerDurian(registerDurianDto);
    return res.status(result.statusCode).json(result);
  }
  @Patch('grade-inspection')
  async GradeInspection(
    @Body() gradeInspectionDto: GradeInspectionDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return await this.durianRegisterService.GradeInspection(
    //   gradeInspectionDto,
    //   req.decoded,
    // );
    const result = await this.durianRegisterService.GradeInspection(
      gradeInspectionDto,
      req.decoded,
    );
    return res.status(result.statusCode).json(result);
  }
}
