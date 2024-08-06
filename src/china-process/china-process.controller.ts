import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ChinaProcessService } from './china-process.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { CreateLoadInDto } from './dto/create-loadin-process.dto';
import { CreateStoreDto } from './dto/create-store-process.dto';
import { CreateRePackingProcessDto } from './dto/create-re-packing-process.dto';
import { CreateDeliveryDto } from './dto/create-delivery-process.dto';
import { CreateLoadOutStoreDto } from './dto/create-load-out-store-process.dto';

@Controller('china-process')
export class ChinaProcessController {
  constructor(private readonly chinaProcessService: ChinaProcessService) {}

  @Post('load-in')
  async createChinaLoadInProcess(
    @Body() createLoadInDto: CreateLoadInDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.chinaProcessService.createChinaLoadInProcess(
    //   createLoadInDto,
    //   req.decoded,
    // );
    const result = await this.chinaProcessService.createChinaLoadInProcess(
      createLoadInDto,
      req.decoded,
    );
    return res.status(result.statusCode).json(result);
  }

  @Post('store')
  async createChinaStoreProcess(
    @Body() createStoreDto: CreateStoreDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.chinaProcessService.createChinaStoreProcess(createStoreDto);
    const result = await this.chinaProcessService.createChinaStoreProcess(
      createStoreDto,
      req.decoded,
    );
    return res.status(result.statusCode).json(result);
  }

  @Post('load-out-store')
  async createChinaLoadOutStoreProcess(
    @Body() createLoadOutStoreDto: CreateLoadOutStoreDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.chinaProcessService.createChinaLoadOutStoreProcess(
    //   createLoadOutStoreDto,
    // );
    const result =
      await this.chinaProcessService.createChinaLoadOutStoreProcess(
        createLoadOutStoreDto,
        req.decoded,
      );
    return res.status(result.statusCode).json(result);
  }

  @Post('re-packing')
  async createChinaRePackingProcess(
    @Body() createRePackingProcessDto: CreateRePackingProcessDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.chinaProcessService.createChinaRePackingProcess(
    //   createRePackingProcessDto,
    // );
    const result = await this.chinaProcessService.createChinaRePackingProcess(
      createRePackingProcessDto,
      req.decoded,
    );
    return res.status(result.statusCode).json(result);
  }

  @Post('delivery')
  async createChinaDeliveryProcess(
    @Body() createDeliveryDto: CreateDeliveryDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.chinaProcessService.createChinaDeliveryProcess(
    //   createDeliveryDto,
    // );
    const result = await this.chinaProcessService.createChinaDeliveryProcess(
      createDeliveryDto,
      req.decoded,
    );
    return res.status(result.statusCode).json(result);
  }
}
