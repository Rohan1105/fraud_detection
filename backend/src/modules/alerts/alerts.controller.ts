// src/modules/alerts/alerts.controller.ts
import { Controller, Get, Patch, Param, ParseIntPipe } from '@nestjs/common';
import { AlertsService } from './alerts.service';
import { FraudAlert } from './fraud-alert.entity';

@Controller('api/alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {} // ✅ inject service

  @Get()
  async getAlerts(): Promise<FraudAlert[]> {
    return this.alertsService.getAllAlerts(); // call service method
  }

  @Patch(':id/read')
  async markAlertAsRead(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<FraudAlert> {
    return this.alertsService.markAsRead(id); // call service method
  }
}
