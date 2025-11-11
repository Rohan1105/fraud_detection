import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Rule } from '../rules/rules.entity';
import { FraudAlert } from '../alerts/fraud-alert.entity';
import { evaluateRule } from '../rules/rules.evaluator';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepo: Repository<Transaction>,
    @InjectRepository(Rule)
    private ruleRepo: Repository<Rule>,
    @InjectRepository(FraudAlert)
    private alertRepo: Repository<FraudAlert>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  // Ingest transaction with idempotency + fraud evaluation
  async ingestTransaction(dto: CreateTransactionDto, idempotencyKey: string) {
    // Check idempotency
    const existingKey = await this.cacheManager.get(idempotencyKey);
    if (existingKey) throw new ConflictException('Duplicate request');

    // Check duplicate transaction for same customer
    const existingTxn = await this.transactionRepo.findOne({
      where: { txnId: dto.txnId, customerId: Number(dto.customerId) },
    });
    if (existingTxn) throw new ConflictException('Transaction already exists');

    // Save transaction
    const txn = this.transactionRepo.create({ ...dto, customerId: Number(dto.customerId) });
    const savedTxn = await this.transactionRepo.save(txn);

    // Set idempotency cache (5 min)
    await this.cacheManager.set(idempotencyKey, '1', 300);

    // ✅ Evaluate rules
    const rules = await this.ruleRepo.find();
    const triggeredRules: string[] = [];

    for (const rule of rules) {
      const triggered = evaluateRule(rule, dto);
      if (triggered) {
        triggeredRules.push(rule.name);

        // Save alert
        const alert = this.alertRepo.create({
          transactionId: savedTxn.txnId,
          ruleId: rule.id,
          message: `Rule triggered: ${rule.name}`,
          severity: rule.params?.severity || 'medium',
        });
        await this.alertRepo.save(alert);
      }
    }

    return {
      transaction: savedTxn,
      fraudStatus: triggeredRules.length > 0 ? 'Fraudulent' : 'Clean',
      triggeredRules,
    };
  }

  async getAllTransactions() {
    const transactions = await this.transactionRepo.find({ order: { ts: 'DESC' } });
    return { transactions };
  }

  async getCustomerTransactions(customerId: number, from?: string, to?: string) {
    const qb = this.transactionRepo.createQueryBuilder('txn')
      .where('txn.customerId = :customerId', { customerId })
      .orderBy('txn.ts', 'DESC');

    if (from) qb.andWhere('txn.ts >= :from', { from });
    if (to) qb.andWhere('txn.ts <= :to', { to });

    const transactions = await qb.getMany();
    return { transactions };
  }

  // Optional: check fraud for existing transaction
  async checkFraud(txnId: string) {
    const txn = await this.transactionRepo.findOne({ where: { txnId } });
    if (!txn) return null;

    const rules = await this.ruleRepo.find();
    const triggeredRules: string[] = [];

    for (const rule of rules) {
      if (evaluateRule(rule, txn)) {
        triggeredRules.push(rule.name);

        // Save alert
        const alert = this.alertRepo.create({
          transactionId: txn.txnId,
          ruleId: rule.id,
          message: `Rule triggered: ${rule.name}`,
          severity: rule.params?.severity || 'medium',
        });
        await this.alertRepo.save(alert);
      }
    }

    return {
      transaction: txn,
      fraudStatus: triggeredRules.length > 0 ? 'Fraudulent' : 'Clean',
      triggeredRules,
    };
  }
}
