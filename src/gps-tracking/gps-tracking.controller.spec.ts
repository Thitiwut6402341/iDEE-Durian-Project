import { Test, TestingModule } from '@nestjs/testing';
import { GpsTrackingController } from './gps-tracking.controller';
import { GpsTrackingService } from './gps-tracking.service';

describe('GpsTrackingController', () => {
  let controller: GpsTrackingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GpsTrackingController],
      providers: [GpsTrackingService],
    }).compile();

    controller = module.get<GpsTrackingController>(GpsTrackingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
