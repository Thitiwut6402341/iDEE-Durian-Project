import { Test, TestingModule } from '@nestjs/testing';
import { DurianRegisterController } from './durian-register.controller';
import { DurianRegisterService } from './durian-register.service';

describe('DurianRegisterController', () => {
  let controller: DurianRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DurianRegisterController],
      providers: [DurianRegisterService],
    }).compile();

    controller = module.get<DurianRegisterController>(DurianRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
