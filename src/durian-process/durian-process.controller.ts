import { Body, Controller, Get, Post, Req, Request, ValidationPipe } from '@nestjs/common';
import { DurianProcessService } from './durian-process.service';
import { DurianRejectDto } from './dto/durian-reject.dto';
import { TJwtPayload } from 'src/types/jwt-payload';

@Controller('durian-process')
export class DurianProcessController {
  constructor(private readonly durianProcessService: DurianProcessService) { }


  @Post('reject')
  async rejectDurianProcess(
    @Body(new ValidationPipe()) durianRejectDto: DurianRejectDto,
    // @Req() req: Request & { decoded: TJwtPayload },
    @Request() req: any,
  ) {
    const { decoded } = req;
    return this.durianProcessService.rejectDurianProcess(durianRejectDto, decoded);
  }
}
