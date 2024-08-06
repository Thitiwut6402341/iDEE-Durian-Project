import { Test, TestingModule } from '@nestjs/testing';
import { ChinaProcessController } from './china-process.controller';
import { ChinaProcessService } from './china-process.service';

describe('ChinaProcessController', () => {
  let controller: ChinaProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ChinaProcessController],
      providers: [ChinaProcessService],
    }).compile();

    controller = module.get<ChinaProcessController>(ChinaProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
