import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FraudService } from './fraud.service';
import { FraudController } from './fraud.controller';
import { Transaction } from '../transactions/transaction.entity';  // ✅ Import the entity
import { Rule } from '../rules/rules.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Transaction,Rule]),  // ✅ Register entity here
  ],
  controllers: [FraudController],
  providers: [FraudService],
})
export class FraudModule {}
