// src/modules/rules/rule.entity.ts
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Rule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  type: string; // e.g., "amount_limit", "merchant_blacklist"

  @Column('jsonb', { nullable: true })
  params: any; // e.g., { maxAmount: 1000 } or { merchants: ["Merchant_86"] }
}
