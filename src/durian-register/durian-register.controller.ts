import { Body, Controller, Patch, Post, ValidationPipe } from '@nestjs/common';
import { DurianRegisterService } from './durian-register.service';
import { RegisterDurianTagDto } from './dto/register-durian-tag.dto';
import { RegisterDurianDto } from './dto/register-durian.dto';

@Controller('durian-register')
export class DurianRegisterController {
  constructor(private readonly durianRegisterService: DurianRegisterService) { }

  @Post('durian-register')
  async RegisterDurian(@Body(new ValidationPipe()) registerDurianDto: RegisterDurianDto): Promise<any> {
    return await this.durianRegisterService.RegisterDurian(registerDurianDto)
  }
}
