import { Body, Controller, Patch, Post, Request, ValidationPipe } from '@nestjs/common';
import { QaProcessService } from './qa-process.service';
import { QAOrchardDto } from './dto/qa-orchard.dto';
import { QAPackingHouseDto } from './dto/qa-packing-house.dto';
import { DMPercentageDto } from './dto/dm-percen.dto';
import { UpdatePackagingNoDto } from './dto/update-packaging-no.dto';
import { ContainerSendDto } from './dto/container-send.dto';
import { ContainerReceiveDto } from './dto/container-receive.dto';
import { DocumentsDto } from './dto/documents.dto';

@Controller('qa-process')
export class QaProcessController {
  constructor(private readonly qaProcessService: QaProcessService) {}

  @Patch('orchard')
  async QAOrchard(@Body(new ValidationPipe()) qaOrchardDto: QAOrchardDto, @Request() req:any) {
    const { decoded } = req
    return this.qaProcessService.QAOrchard(qaOrchardDto, decoded)
  }

  @Patch('packing-house')
  async QAPackingHouse(@Body(new ValidationPipe()) qaPackingHouseDto: QAPackingHouseDto, @Request() req:any) {
    const { decoded } = req
    return this.qaProcessService.QAPackingHouse(qaPackingHouseDto, decoded)
  }

  @Post('dm-percentage')
  async DMPercentage(@Body(new ValidationPipe()) DMPercentageDto:DMPercentageDto, @Request() req: any) {
    const { decoded } = req
    return this.qaProcessService.DMPercentage(DMPercentageDto, decoded)
  }

  @Patch('update-packaging-no')
  async UpdatePackagingNumber(@Body(new ValidationPipe()) updatePackagingNoDto: UpdatePackagingNoDto) {
    return this.qaProcessService.UpdatePackagingNumber(updatePackagingNoDto)
  }

  @Post('qa-container-sending')
  async QAContainerSend(@Body(new ValidationPipe()) containerSendDto: ContainerSendDto, @Request() req: any) {
    const { decoded } = req
    return this.qaProcessService.QAContainerSend(containerSendDto, decoded)
  }

  @Patch('qa-container-receiving')
  async QAContainerReceive(@Body(new ValidationPipe()) containerReceiveDto: ContainerReceiveDto, @Request() req: any) {
    const { decoded } = req
    return this.qaProcessService.QAContainerReceive(containerReceiveDto, decoded)
  }

  @Post('get-send-documents')
  async GetAndSendDocuments(@Body(new ValidationPipe()) documentsDto:DocumentsDto) {
    return this.qaProcessService.GetAndSendDocuments(documentsDto)
  }
}
