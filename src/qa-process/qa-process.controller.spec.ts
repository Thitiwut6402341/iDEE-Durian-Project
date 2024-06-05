import { Test, TestingModule } from '@nestjs/testing';
import { QaProcessController } from './qa-process.controller';
import { QaProcessService } from './qa-process.service';

describe('QaProcessController', () => {
  let controller: QaProcessController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QaProcessController],
      providers: [QaProcessService],
    }).compile();

    controller = module.get<QaProcessController>(QaProcessController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
