import { Module } from '@nestjs/common';
import { GpsTrackingService } from './gps-tracking.service';
import { GpsTrackingController } from './gps-tracking.controller';

@Module({
  controllers: [GpsTrackingController],
  providers: [GpsTrackingService],
})
export class GpsTrackingModule {}
