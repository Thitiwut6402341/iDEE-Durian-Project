import { Test, TestingModule } from '@nestjs/testing';
import { DurianRegisterService } from './durian-register.service';

describe('DurianRegisterService', () => {
  let service: DurianRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DurianRegisterService],
    }).compile();

    service = module.get<DurianRegisterService>(DurianRegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
