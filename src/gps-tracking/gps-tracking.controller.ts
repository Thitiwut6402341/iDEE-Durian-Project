import { Controller, Get } from '@nestjs/common';
import { GpsTrackingService } from './gps-tracking.service';

@Controller('gps-tracking')
export class GpsTrackingController {
  constructor(private readonly gpsTrackingService: GpsTrackingService) {}

  @Get('current')
  async getWeightingsDetail(): Promise<any> {
    return await this.gpsTrackingService.getCurrentTracking();
  }

  @Get('current-container-status')
  async getCurrentContainerStatus(): Promise<any> {
    return await this.gpsTrackingService.getCurrentContainerStatus();
  }
}
