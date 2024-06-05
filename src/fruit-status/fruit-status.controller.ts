import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { FruitStatusService } from './fruit-status.service';
import { FruitStatusDto } from './dto/fruit-status.dto';
import { FruitStatusByCodeDto } from './dto/fruit-status-by-code.dto';

@Controller('fruit-status')
export class FruitStatusController {
  constructor(private readonly fruitStatusService: FruitStatusService) { }

  @Post('havest-status')
  async FruitStatus(@Body(new ValidationPipe()) fruitStatusDto: FruitStatusDto) {
    return await this.fruitStatusService.FruitStatus(fruitStatusDto);
  }

  @Post('flow')
  async FruitStatusByCode(@Body(new ValidationPipe()) fruitStatusByCodeDto: FruitStatusByCodeDto) {
    return await this.fruitStatusService.FruitStatusByCode(fruitStatusByCodeDto);
  }
}
