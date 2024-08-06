import {
  Body,
  Controller,
  Get,
  Query,
  Patch,
  Post,
  Request,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { QaProcessService } from './qa-process.service';
import { QAOrchardDto } from './dto/qa-orchard.dto';
import { QAPackingHouseDto } from './dto/qa-packing-house.dto';
import { DMPercentageDto } from './dto/dm-percent.dto';
import { DMPercentagePackingDto } from './dto/dm-percent-packing.dto';
import { DMPercentageAgricultureDto } from './dto/dm-percent-agriculture.dto';
import { FreezerRoomDto } from './dto/freezer-room.dto';
import { UpdatePackagingNoDto } from './dto/update-packaging-no.dto';
import { ContainerSendDto } from './dto/container-send.dto';
import { ContainerReceiveDto } from './dto/container-receive.dto';
import { DocumentsDto } from './dto/documents.dto';
import { QAFreezerDto } from './dto/qa-freezer.dto';
import { QAContainerBeforeCloseDto } from './dto/qa-container-before-close.dto';
import { QATruckCustomerDto } from './dto/qa-truck-customer.dto';
import { BookingDetailsDto } from './dto/booking-details.dto';

@Controller('qa-process')
export class QaProcessController {
  constructor(private readonly qaProcessService: QaProcessService) { }

  @Patch('orchard')
  async QAOrchard(
    @Body(new ValidationPipe()) qaOrchardDto: QAOrchardDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.QAOrchard(qaOrchardDto, decoded);
  }

  @Patch('packing-house')
  async QAPackingHouse(
    @Body(new ValidationPipe()) qaPackingHouseDto: QAPackingHouseDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.QAPackingHouse(qaPackingHouseDto, decoded);
  }

  @Post('dm-percentage-orchard')
  async DMPercentageOrchard(
    @Body(new ValidationPipe()) DMPercentageDto: DMPercentageDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.DMPercentageOrchard(DMPercentageDto, decoded);
  }

  @Post('dm-percentage-packing-house')
  async DMPercentagePackingHouse(
    @Body(new ValidationPipe()) DMPercentagePackingDto: DMPercentagePackingDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.DMPercentagePackingHouse(
      DMPercentagePackingDto,
      decoded,
    );
  }

  @Post('dm-percentage-agriculture')
  async DMPercentageAgriculture(
    @Body(new ValidationPipe())
    DMPercentageAgricultureDto: DMPercentageAgricultureDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.DMPercentageAgriculture(
      DMPercentageAgricultureDto,
      decoded,
    );
  }

  @Post('freezer-room')
  async FreezerRoom(
    @Body(new ValidationPipe())
    FreezerRoomDto: FreezerRoomDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.FreezerRoom(FreezerRoomDto, decoded);
  }

  @Get('dm-percentage-packing-house')
  async DMPercentagePackingHouseHistory() {
    return this.qaProcessService.DMPercentagePackingHouseHistory();
  }

  @Get('dm-percentage-orchard')
  async getDMPercentageOrchardHistory() {
    return this.qaProcessService.DMPercentageOrchardHistory();
  }

  @Get('dm-percentage-agriculture')
  async DMPercentageAgricultureHistory(
    @Query('transportation_id') transportation_id: string,
  ) {
    return this.qaProcessService.DMPercentageAgricultureHistory(
      transportation_id,
    );
  }

  @Get('freezer-room-history')
  async getFreezerRoomHistory(@Query('location') location: string) {
    if (!location) {
      throw new BadRequestException('Location parameter is required');
    }
    return this.qaProcessService.FreezerRoomHistory(location);
  }

  @Get('transportation-history')
  async GetTransportationHistory() {
    return this.qaProcessService.GetTransportationHistory();
  }

  @Patch('update-packaging-no')
  async UpdatePackagingNumber(
    @Body(new ValidationPipe()) updatePackagingNoDto: UpdatePackagingNoDto,
  ) {
    return this.qaProcessService.UpdatePackagingNumber(updatePackagingNoDto);
  }

  @Post('qa-freezer')
  async QAFreezer(
    @Body(new ValidationPipe()) qAFreezerDto: QAFreezerDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.QAFreezer(qAFreezerDto, decoded);
  }

  @Post('qa-container-before-close')
  async QAContainerBeforeClose(
    @Body(new ValidationPipe())
    qAContainerBeforeCloseDto: QAContainerBeforeCloseDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.QAContainerBeforeClose(
      qAContainerBeforeCloseDto,
      decoded,
    );
  }

  @Post('qa-container-sending')
  async QAContainerSend(
    @Body(new ValidationPipe()) containerSendDto: ContainerSendDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.QAContainerSend(containerSendDto, decoded);
  }

  @Post('qa-container-receiving')
  async QAContainerReceive(
    @Body(new ValidationPipe()) containerReceiveDto: ContainerReceiveDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.QAContainerReceive(
      containerReceiveDto,
      decoded,
    );
  }

  @Post('qa-vahicle-before-delivery')
  async QATruckCustomer(
    @Body(new ValidationPipe()) qATruckCustomerDto: QATruckCustomerDto,
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.qaProcessService.QATruckCustomer(qATruckCustomerDto, decoded);
  }

  @Get('qa-history')
  async QAHistory() {
    return this.qaProcessService.QAHistory();
  }

  @Get('all-booking')
  async GetAllBooking() {
    return this.qaProcessService.GetAllBooking();
  }

  @Post('booking-details')
  async BookingDetails(
    @Body(new ValidationPipe()) bookingDetailsDto: BookingDetailsDto,
  ) {
    return this.qaProcessService.BookingDetails(bookingDetailsDto);
  }

  // @Get('transportation-history')
  // async GetTransportationHistory() {
  //   return this.qaProcessService.GetTransportationHistory()
  // }

  @Get('container-seal-th-history')
  async GetContainerSealTHHistory() {
    return this.qaProcessService.GetContainerSealTHHistory()
  }
  @Get('container-seal-cn-history')
  async GetContainerSealCNHistory() {
    return this.qaProcessService.GetContainerSealCNHistory()
  }

  // @Get('check-rfid')
  // async checkNonRFIDCode() {
  //   return this.qaProcessService.checkNonRFIDCode()
  // }



}
