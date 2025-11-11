import { Controller, Get } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Controller('api')
export class HealthController {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  @Get('health')
  healthCheck() {
    return { status: 'ok' };
  }

  @Get('metrics')
  async metrics() {
    const totalTxns = await this.transactionRepo.count();
    return { totalTxns };
  }
}
