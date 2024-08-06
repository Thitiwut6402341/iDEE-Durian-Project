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
    constructor(private readonly QrService: QrService) { }

    @Get('product')
    async findAll(@Query('rfid_code') rfid_code: string) {
        return this.QrService.findAll(rfid_code);
    }

    @Get('fruitstatus')
    async getfruitstatus(@Query('rfid_code') rfid_code: string) {
        return this.QrService.getfruitstatus(rfid_code);
    }

    @Get('fruitlevel')
    async getfruitlevel(@Query('rfid_code') rfid_code: string) {
        return this.QrService.getfruitlevel(rfid_code);
    }

    @Get('chinafruitlevel')
    async getchinafruitlevel(@Query('rfid_code') rfid_code: string) {
        return this.QrService.getchinafruitlevel(rfid_code);
    }

    @Get('contact')
    async getContact(@Query('rfid_code') rfid_code: string) {
        return this.QrService.getContact(rfid_code);
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


