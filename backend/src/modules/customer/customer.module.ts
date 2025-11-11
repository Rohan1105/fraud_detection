import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { SharedModule } from '../shared/shared.module';
import { TransactionsModule } from '../transactions/transactions.module';

@Module({
  imports: [SharedModule,TransactionsModule],
  controllers: [CustomerController],
  providers: [CustomerService]
})
export class CustomerModule {}
