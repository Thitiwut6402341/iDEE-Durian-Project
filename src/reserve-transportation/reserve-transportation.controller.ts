import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ReserveTransportationService } from './reserve-transportation.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { CreateReserveDto, EditReserveDto } from './dto';
import { Request, Response } from 'express';

@Controller('reserve')
export class ReserveTransportationController {
  constructor(
    private readonly reserveTransportationService: ReserveTransportationService,
  ) {}

  @Post('transportation')
  async newBooking(
    @Body() createReserveDto: CreateReserveDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.reserveTransportationService.newBooking(
    //   createReserveDto,
    //   req.decoded,
    // );
    const result = await this.reserveTransportationService.newBooking(
      createReserveDto,
      req.decoded,
    );
    return res.status(result.statusCode).json(result);
  }

  @Put('update')
  async editReserveTransportation(
    @Body() editReserveDto: EditReserveDto,
    @Req() req: Request & { decoded: TJwtPayload },
    @Res() res: Response,
  ) {
    // return this.reserveTransportationService.editReserveTransportation(
    //   editReserveDto,
    //   req.decoded,
    // );
    const result =
      await this.reserveTransportationService.editReserveTransportation(
        editReserveDto,
        req.decoded,
      );
    return res.status(result.statusCode).json(result);
  }

  @Get('transportation-id/:reserve_id')
  async getReserveTransportation(
    @Param('reserve_id') reserve_id: string,
    @Res() res: Response,
  ) {
    // return this.reserveTransportationService.getReserveTransportation(
    //   reserve_id,
    // );
    const result =
      await this.reserveTransportationService.getReserveTransportation(
        reserve_id,
      );
    return res.status(result.statusCode).json(result);
  }

  @Get('all-transportation')
  async getAllReserveTransportation(@Res() res: Response) {
    // return this.reserveTransportationService.getAllReserveTransportation();
    const result =
      await this.reserveTransportationService.getAllReserveTransportation();
    return res.status(result.statusCode).json(result);
  }

  @Delete('delete')
  async deleteReserve(
    @Query('reserve_id') reserve_id: string,
    @Res() res: Response,
  ) {
    // return this.reserveTransportationService.deleteReserve(reserve_id);
    const result =
      await this.reserveTransportationService.deleteReserve(reserve_id);
    return res.status(result.statusCode).json(result);
  }
}
