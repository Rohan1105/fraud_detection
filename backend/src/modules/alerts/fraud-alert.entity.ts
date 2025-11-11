// src/modules/alerts/fraud-alert.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class FraudAlert {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  transactionId: string;

  @Column()
  ruleId: number;

  @Column()
  message: string;

  @Column()
  severity: 'low' | 'medium' | 'high';

  @Column({ default: false })
  read: boolean;

  @CreateDateColumn()
  timestamp: Date;
}
