import { Test, TestingModule } from '@nestjs/testing';
import { FruitStatusController } from './fruit-status.controller';
import { FruitStatusService } from './fruit-status.service';

describe('FruitStatusController', () => {
  let controller: FruitStatusController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FruitStatusController],
      providers: [FruitStatusService],
    }).compile();

    controller = module.get<FruitStatusController>(FruitStatusController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
