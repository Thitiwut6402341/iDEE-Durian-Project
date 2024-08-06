import { Body, Controller, Get, Post, Query, Res } from '@nestjs/common';
import { FruitStatusService } from './fruit-status.service';
import { Response } from 'express';
import { FruitStatusDto, FruitStatusByCodeDto, FruitByReserveDto } from './dto';

@Controller('fruit-status')
export class FruitStatusController {
  constructor(private readonly fruitStatusService: FruitStatusService) {}

  // @Post('havest-status')
  // async FruitStatus(@Body() fruitStatusDto: FruitStatusDto) {
  //   return await this.fruitStatusService.FruitStatus(fruitStatusDto);
  // }

  // @Post('new-havest-status')
  // async HarvestStatus(@Body() fruitStatusDto: FruitStatusDto) {
  //   return await this.fruitStatusService.HarvestStatus(fruitStatusDto);
  // }

  @Post('flow')
  async FruitStatusByCode(
    @Body() fruitStatusByCodeDto: FruitStatusByCodeDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.FruitStatusByCode(
    //   fruitStatusByCodeDto,
    // );
    const result =
      await this.fruitStatusService.FruitStatusByCode(fruitStatusByCodeDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('harvest')
  async HarvestProcess(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.HarvestProcess(fruitStatusDto);
    const result = await this.fruitStatusService.HarvestProcess(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('chemical1')
  async ChemicalProcess1(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.ChemicalProcess1(fruitStatusDto);
    const result =
      await this.fruitStatusService.ChemicalProcess1(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('chemical2')
  async ChemicalProcess2(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.ChemicalProcess2(fruitStatusDto);
    const result =
      await this.fruitStatusService.ChemicalProcess2(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('chemical3')
  async ChemicalProcess3(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.ChemicalProcess3(fruitStatusDto);
    const result =
      await this.fruitStatusService.ChemicalProcess3(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('weighting')
  async WeightingProcess(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.WeightingProcess(fruitStatusDto);
    const result =
      await this.fruitStatusService.WeightingProcess(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('packing')
  async PackingProcess(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.PackingProcess(fruitStatusDto);
    const result = await this.fruitStatusService.PackingProcess(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('freeze')
  async FreezerProcess(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.FreezerProcess(fruitStatusDto);
    const result = await this.fruitStatusService.FreezerProcess(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('transportation')
  async TransportationProcess(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.TransportationProcess(fruitStatusDto);
    const result =
      await this.fruitStatusService.TransportationProcess(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('arrival')
  async ArrivalProcess(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.ArrivalProcess(fruitStatusDto);
    const result = await this.fruitStatusService.ArrivalProcess(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Post('reject')
  async RejectedProcess(
    @Body() fruitStatusDto: FruitStatusDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.RejectedProcess(fruitStatusDto);
    const result =
      await this.fruitStatusService.RejectedProcess(fruitStatusDto);
    return res.status(result.statusCode).json(result);
  }

  @Get('all-pages')
  async AllPages(
    @Query('period') period: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.AllPages(period, from, to);
    const result = await this.fruitStatusService.AllPages(period, from, to);
    return res.status(result.statusCode).json(result);
  }

  @Post('fruit-by-reserve')
  async getDurianByReserve(
    @Body() fruitByReserveDto: FruitByReserveDto,
    @Res() res: Response,
  ) {
    // return await this.fruitStatusService.AllPages(period, from, to);
    const result =
      await this.fruitStatusService.getDurianByReserve(fruitByReserveDto);
    return res.status(result.statusCode).json(result);
  }
}
