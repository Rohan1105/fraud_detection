import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from '../transactions/transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  exports: [TypeOrmModule], // export repository to other modules
})
export class SharedModule {}