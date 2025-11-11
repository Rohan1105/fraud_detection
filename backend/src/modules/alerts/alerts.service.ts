// src/modules/alerts/alerts.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FraudAlert } from './fraud-alert.entity';

@Injectable()
export class AlertsService {
  constructor(
    @InjectRepository(FraudAlert)
    private alertRepo: Repository<FraudAlert>,
  ) {}

  async getAllAlerts(): Promise<FraudAlert[]> {
    return this.alertRepo.find({ order: { timestamp: 'DESC' } });
  }

  async markAsRead(alertId: number): Promise<FraudAlert> {
    const alert = await this.alertRepo.findOne({ where: { id: alertId } });
    if (!alert) throw new NotFoundException('Alert not found');
    alert.read = true;
    return this.alertRepo.save(alert);
  }
}
