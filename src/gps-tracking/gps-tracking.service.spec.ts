import { Test, TestingModule } from '@nestjs/testing';
import { GpsTrackingService } from './gps-tracking.service';

describe('GpsTrackingService', () => {
  let service: GpsTrackingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GpsTrackingService],
    }).compile();

    service = module.get<GpsTrackingService>(GpsTrackingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
