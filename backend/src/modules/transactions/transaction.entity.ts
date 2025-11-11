// src/modules/transactions/transaction.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Transaction {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  customerId: number;

  @Column({ unique: true })
  txnId: string;

  @Column({ 
    type: 'decimal', 
    transformer: { 
      to: (value: number) => value, 
      from: (value: string) => parseFloat(value) 
    } 
  })
  amount: number;

  @Column()
  merchant: string;

  @Column()
  mcc: string;

  @Column()
  ts: Date;
}
