import { QrMokupDocument } from 'src/qr/schema/qrmokup.schema';
import { 
  Controller, 
  Get,
  Query,
  // Post, 
  // Body,
  // Headers,
} from '@nestjs/common';
import { QrService } from './qr.service';
// import { CreateQrDto } from './dto/create-qr.dto';
// import { UpdateQrDto } from './dto/update-qr.dto';

@Controller('qr')
export class QrController {
  constructor(private readonly QrService: QrService) {}

  @Get('product')
    async findAll(@Query('fruitcode') fruitcode: string) {
        return this.QrService.findAll(fruitcode);
    }

    @Get('fruitstatus')
    async getfruitstatus(@Query('fruitcode') fruitcode: string) {
        return this.QrService.getfruitstatus(fruitcode);
    } 

    @Get('fruitlevel')
    async getfruitlevel(@Query('fruitcode') fruitcode: string) {
        return this.QrService.getfruitlevel(fruitcode);
    } 

    @Get('chinafruitlevel')
    async getchinafruitlevel(@Query('fruitcodenew') fruitcode: string) {
        return this.QrService.getchinafruitlevel(fruitcode);
    } 
   
    @Get('mokup-product')
    async mokupfindAll(@Query('fruitcode') fruitcode: string) {
      return this.QrService.mokupfindAll(fruitcode);
  }

  @Get('mokup-fruitstatus')
  async mokupgetfruitstatus(@Query('fruitcode') fruitcode: string) {
      return this.QrService.mokupgetfruitstatus(fruitcode);
  }
  
  @Get('mokup-chinafruitlevel')
  async mokupchinafruitlevel(@Query('fruitcode') fruitcode: string) {
      return this.QrService.mokupchinafruitlevel(fruitcode);
  }
}


