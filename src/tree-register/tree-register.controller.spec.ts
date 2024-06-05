import { Test, TestingModule } from '@nestjs/testing';
import { TreeRegisterController } from './tree-register.controller';
import { TreeRegisterService } from './tree-register.service';

describe('TreeRegisterController', () => {
  let controller: TreeRegisterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TreeRegisterController],
      providers: [TreeRegisterService],
    }).compile();

    controller = module.get<TreeRegisterController>(TreeRegisterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
