import { Controller, Post, Body } from '@nestjs/common';
import { TDurianPrice, TRequestPrice } from './types/price';
import { PriceService } from './price.service';

@Controller('price')
export class PriceController {
  constructor(private readonly priceService: PriceService) {}

  @Post()
  getPrices(@Body() requestPrice: TRequestPrice): Promise<TDurianPrice> {
    return this.priceService.getPrices(requestPrice);
  }
}
