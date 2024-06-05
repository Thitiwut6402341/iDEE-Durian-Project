import { Test, TestingModule } from '@nestjs/testing';
import { QaProcessService } from './qa-process.service';

describe('QaProcessService', () => {
  let service: QaProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QaProcessService],
    }).compile();

    service = module.get<QaProcessService>(QaProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
