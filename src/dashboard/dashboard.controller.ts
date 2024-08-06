import { Controller, Get, Post, Body, Patch, Param, Delete, ValidationPipe, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { CreateDashboardMonthlyDto } from './dto/dashboard-monthly.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('departures')
  async dbMonthly(@Query("mode") mode: string, @Query("year") year: string): Promise<any> {
    return await this.dashboardService.dbMonthly(mode, year)
  }

  @Get('export-data')
  async exportData(): Promise<any> {
    return await this.dashboardService.exportData()
  }

  @Get('db-premium')
  async dbPremium(): Promise<any> {
    return await this.dashboardService.dbPremium()
  }


}
