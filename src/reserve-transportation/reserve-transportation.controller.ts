import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, Req } from '@nestjs/common';
import { ReserveTransportationService } from './reserve-transportation.service';
import { TJwtPayload } from 'src/types/jwt-payload';
import { CreateReserveDto } from './dto/create-reserve.dto';
import { EditReserveDto } from './dto/edit-reserve.dto';
@Controller('reserve')
export class ReserveTransportationController {
  constructor(private readonly reserveTransportationService: ReserveTransportationService) { }

  @Post('transportation')
  async newBooking(
    @Body() createReserveDto: CreateReserveDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.reserveTransportationService.newBooking(createReserveDto, req.decoded);
  }

  @Put('update')
  async editReserveTransportation(
    @Body() editReserveDto: EditReserveDto,
    @Req() req: Request & { decoded: TJwtPayload },
  ) {
    return this.reserveTransportationService.editReserveTransportation(editReserveDto, req.decoded);
  }

  @Get('transportation-id/:reserve_id')
  async getReserveTransportation(@Param('reserve_id') reserve_id: string) {
    return this.reserveTransportationService.getReserveTransportation(reserve_id);
  }

  @Get('all-transportation')
  async getAllReserveTransportation() {
    return this.reserveTransportationService.getAllReserveTransportation();
  }

  @Delete('delete')
  async deleteReserve(@Query('reserve_id') orchardCode: string) {
    return this.reserveTransportationService.deleteReserve(orchardCode);
  }
}
