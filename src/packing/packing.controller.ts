import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  Res,
  Put,
  Query,
} from '@nestjs/common';
import { PackingService } from './packing.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { Request, Response } from 'express';
import {
  CreateChemicalProcess1Dto,
  CreateChemicalProcess2Dto,
  CreateChemicalProcess3Dto,
  CreateCountSegmentsProcessDto,
  CreateFreezerProcessDto,
  CreateWeightingsProcessDto,
  CreatePackingProcessDto,
  CreatePackingProcess2Dto,
  CreateTransportationProcessDto,
  EditWeightingsProcessDto,
} from './dto';

@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) {}

  // @Post('qc')
  // createQc(
  //   @Body() createQcDto: CreateQcDto,
  //   @Req() req: Request & { decoded: TJwtPayload },
  // ) {
  //   return this.packingService.createQc(createQcDto, req.decoded);
  // }

  @Post('chemical-process-1')
  async createChemicalProcess1(
    @Body() createChemicalProcess1Dto: CreateChemicalProcess1Dto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createChemicalProcess1(
    //   createChemicalProcess1Dto,
    //   req.decoded,
    // );
    const result = await this.packingService.createChemicalProcess1(
      createChemicalProcess1Dto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Post('chemical-process-2')
  async createChemicalProcess2(
    @Body() createChemicalProcess2Dto: CreateChemicalProcess2Dto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createChemicalProcess2(
    //   createChemicalProcess2Dto,
    //   req.decoded,
    // );
    const result = await this.packingService.createChemicalProcess2(
      createChemicalProcess2Dto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Post('chemical-process-3')
  async createChemicalProcess3(
    @Body() createChemicalProcess3Dto: CreateChemicalProcess3Dto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createChemicalProcess3(
    //   createChemicalProcess3Dto,
    //   req.decoded,
    // );
    const result = await this.packingService.createChemicalProcess3(
      createChemicalProcess3Dto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Post('count-segments-process')
  async createCountSegmentsProcess(
    @Body() createCountSegmentsProcessDto: CreateCountSegmentsProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createCountSegmentsProcess(
    //   createCountSegmentsProcessDto,
    //   req.decoded,
    // );
    const result = await this.packingService.createCountSegmentsProcess(
      createCountSegmentsProcessDto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Post('freezer-process')
  async createFreezerProcess(
    @Body() createFreezerProcessDto: CreateFreezerProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createFreezerProcess(
    //   createFreezerProcessDto,
    //   req.decoded,
    // );
    const result = await this.packingService.createFreezerProcess(
      createFreezerProcessDto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Post('weighting-process')
  async createWeightingsProcess(
    @Body() createWeightingsProcessDto: CreateWeightingsProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createWeightingsProcess(
    //   createWeightingsProcessDto,
    //   req.decoded,
    // );
    const result = await this.packingService.createWeightingsProcess(
      createWeightingsProcessDto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Put('edit-weighting')
  async editWeightingsProcess(
    @Body() editWeightingsProcessDto: EditWeightingsProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.editWeightingsProcess(
    //   editWeightingsProcessDto,
    //   req.decoded,
    // );
    const result = await this.packingService.editWeightingsProcess(
      editWeightingsProcessDto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Post('packing-process')
  async createPackingProcess(
    @Body() createPackingProcessDto: CreatePackingProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createPackingProcess(createPackingProcessDto, req.decoded);
    const result = await this.packingService.createPackingProcess(
      createPackingProcessDto,
      req.decoded,
    );
    return res.status(result?.statusCode ?? 201).send(result);
  }

  @Post('packing-process-raw')
  async createPackingProcessRawData(
    @Body() createPackingProcess2Dto: CreatePackingProcess2Dto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createPackingProcess(createPackingProcessDto, req.decoded);
    const result = await this.packingService.createPackingProcessRawData(
      createPackingProcess2Dto,
      req.decoded,
    );
    return res.status(result?.statusCode ?? 201).send(result);
  }

  @Post('transportation')
  async createTransportationProcess(
    @Body() createTransportationProcessDto: CreateTransportationProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.packingService.createTransportationProcess(
    //   createTransportationProcessDto,
    //   req.decoded,
    // );
    const result = await this.packingService.createTransportationProcess(
      createTransportationProcessDto,
      req.decoded,
    );
    return res.status(result.statusCode).send(result);
  }

  @Get('all-process/:rfid_code')
  async getAllProcess(
    @Param('rfid_code') rfid_code: string,
    @Res() res: Response,
  ) {
    // return this.packingService.getAllProcess(fruit_code);
    const result = await this.packingService.getAllProcess(rfid_code);
    return res.status(result.statusCode).send(result);
  }

  @Get('weight-detail')
  async getWeightingsDetail(
    @Query('rfid_code') rfid_code: string,
    @Res() res: Response,
  ) {
    // return await this.packingService.getWeightingsDetail(rfid_code);
    const result = await this.packingService.getWeightingsDetail(rfid_code);
    return res.status(result.statusCode).send(result);
  }
}
