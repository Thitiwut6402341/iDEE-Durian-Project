import { Controller, Get, Post, Body, Param, Req, Put } from '@nestjs/common';
import { PackingService } from './packing.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { Request } from 'express';
import {
  CreateChemicalProcess1Dto,
  CreateChemicalProcess2Dto,
  CreateChemicalProcess3Dto,
  CreateCountSegmentsProcessDto,
  CreateFreezerProcessDto,
  CreateWeightingsProcessDto,
  CreatePackingProcessDto,
  CreateTransportationProcessDto,
  EditWeightingsProcessDto,
} from './dto';

@Controller('packing')
export class PackingController {
  constructor(private readonly packingService: PackingService) { }

  // @Post('qc')
  // createQc(
  //   @Body() createQcDto: CreateQcDto,
  //   @Req() req: Request & { decoded: TJwtPayload },
  // ) {
  //   return this.packingService.createQc(createQcDto, req.decoded);
  // }

  @Post('chemical-process-1')
  createChemicalProcess1(
    @Body() createChemicalProcess1Dto: CreateChemicalProcess1Dto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createChemicalProcess1(
      createChemicalProcess1Dto,
      req.decoded,
    );
  }

  @Post('chemical-process-2')
  createChemicalProcess2(
    @Body() createChemicalProcess2Dto: CreateChemicalProcess2Dto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createChemicalProcess2(
      createChemicalProcess2Dto,
      req.decoded,
    );
  }

  @Post('chemical-process-3')
  createChemicalProcess3(
    @Body() createChemicalProcess3Dto: CreateChemicalProcess3Dto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createChemicalProcess3(
      createChemicalProcess3Dto,
      req.decoded,
    );
  }

  @Post('count-segments-process')
  createCountSegmentsProcess(
    @Body() createCountSegmentsProcessDto: CreateCountSegmentsProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createCountSegmentsProcess(
      createCountSegmentsProcessDto,
      req.decoded,
    );
  }

  @Post('freezer-process')
  createFreezerProcess(
    @Body() createFreezerProcessDto: CreateFreezerProcessDto,
    // @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createFreezerProcess(
      createFreezerProcessDto,
      // req.decoded,
    );
  }

  @Post('weighting-process')
  createWeightingsProcess(
    @Body() createWeightingsProcessDto: CreateWeightingsProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createWeightingsProcess(createWeightingsProcessDto,
      req.decoded
    );
  }

  @Put('edit-weighting')
  editWeightingsProcess(
    @Body() editWeightingsProcessDto: EditWeightingsProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.editWeightingsProcess(editWeightingsProcessDto, req.decoded);
  }

  @Post('packing-process')
  createPackingProcess(
    @Body() createPackingProcessDto: CreatePackingProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createPackingProcess(createPackingProcessDto, req.decoded);
  }

  @Post('transportation-process')
  createTransportationProcess(
    @Body() createTransportationProcessDto: CreateTransportationProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.packingService.createTransportationProcess(createTransportationProcessDto, req.decoded);
  }

  @Get('all-process/:fruit_code')
  getAllProcess(@Param('fruit_code') fruit_code: string) {
    return this.packingService.getAllProcess(fruit_code);
  }
}
