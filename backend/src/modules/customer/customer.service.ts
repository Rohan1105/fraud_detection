import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
  ) {}

  async getTransactions(
    customerId: number, 
    from?: string, 
    to?: string, 
    page = 1, 
    size = 50
  ) {
    if (!customerId || isNaN(customerId)) {
      throw new BadRequestException('Invalid customer ID');
    }

    const fromDate = from ? new Date(from) : new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const [transactions, total] = await this.transactionRepo.findAndCount({
      where: { customerId, ts: Between(fromDate, toDate) },
      order: { ts: 'DESC' },
      skip: (page - 1) * size,
      take: size,
    });

    // convert amount to number (in case transformer is not applied)
    const transactionsWithNumberAmount = transactions.map(txn => ({
      ...txn,
      amount: Number(txn.amount),
    }));

    return { total, page, size, transactions: transactionsWithNumberAmount };
  }
}
