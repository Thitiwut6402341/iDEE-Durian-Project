import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';
import { TransportationService } from './transportation.service';
import { TransportationDto } from './dto/transportation.dto';

@Controller('packing')
export class TransportationController {
  constructor(private readonly transportationService: TransportationService) { }

  @Post('transportation')
  async TransportationStation(@Body(new ValidationPipe()) transportationDto: TransportationDto) {
    return await this.transportationService.TransportationStation(transportationDto);
  }

  // @Get('lot-id')
  // async GetAllLotId() {
  //   return await this.transportationService.GetAllLotId();
  // }

  // @Post('departure')
}

