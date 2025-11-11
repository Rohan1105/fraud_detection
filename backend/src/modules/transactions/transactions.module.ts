import { Module} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionsService } from './transactions.service';
import { TransactionsController } from './transactions.controller';
import { Transaction } from './transaction.entity';
import { Rule } from '../rules/rules.entity';
import { FraudAlert } from '../alerts/fraud-alert.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction, Rule, FraudAlert]), // <-- include all repositories needed by TransactionsService
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService],
  exports: [TransactionsService],
})
export class TransactionsModule {}
