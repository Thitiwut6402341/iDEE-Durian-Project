import { Test, TestingModule } from '@nestjs/testing';
import { ChinaProcessService } from './china-process.service';

describe('ChinaProcessService', () => {
  let service: ChinaProcessService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ChinaProcessService],
    }).compile();

    service = module.get<ChinaProcessService>(ChinaProcessService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
