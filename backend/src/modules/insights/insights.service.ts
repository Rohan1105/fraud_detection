import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class InsightsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async getCustomerInsights(customerId: string) {
    // Top 5 merchants
    const topMerchants = await this.transactionRepo
      .createQueryBuilder('t')
      .select('t.merchant')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.customerId = :customerId', { customerId })
      .groupBy('t.merchant')
      .orderBy('total', 'DESC')
      .limit(5)
      .getRawMany();

    // Categories (MCC)
    const categories = await this.transactionRepo
      .createQueryBuilder('t')
      .select('t.mcc')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.customerId = :customerId', { customerId })
      .groupBy('t.mcc')
      .orderBy('total', 'DESC')
      .getRawMany();

    // Monthly trend
    const monthly = await this.transactionRepo
      .createQueryBuilder('t')
      .select("DATE_TRUNC('month', t.ts)", 'month')
      .addSelect('SUM(t.amount)', 'total')
      .where('t.customerId = :customerId', { customerId })
      .groupBy('month')
      .orderBy('month')
      .getRawMany();

    return { topMerchants, categories, monthly };
  }
}
