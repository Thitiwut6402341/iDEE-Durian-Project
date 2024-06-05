import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { TransportationService } from './transportation.service';
import { TransportationDto } from './dto/transportation.dto';

@Controller('packing')
export class TransportationController {
  constructor(private readonly transportationService: TransportationService) { }

  @Post('transportation')
  async TransportationStation(@Body(new ValidationPipe()) transportationDto: TransportationDto) {
    return await this.transportationService.TransportationStation(transportationDto);
  }

  // @Post('departure')
}

