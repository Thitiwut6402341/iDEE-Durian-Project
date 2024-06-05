import { Test, TestingModule } from '@nestjs/testing';
import { TreeRegisterService } from './tree-register.service';

describe('TreeRegisterService', () => {
  let service: TreeRegisterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TreeRegisterService],
    }).compile();

    service = module.get<TreeRegisterService>(TreeRegisterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
