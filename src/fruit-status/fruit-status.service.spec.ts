import { Test, TestingModule } from '@nestjs/testing';
import { FruitStatusService } from './fruit-status.service';

describe('FruitStatusService', () => {
  let service: FruitStatusService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FruitStatusService],
    }).compile();

    service = module.get<FruitStatusService>(FruitStatusService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
