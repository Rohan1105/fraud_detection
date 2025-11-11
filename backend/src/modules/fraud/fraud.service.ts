import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../transactions/transaction.entity';
import { Rule } from '../rules/rules.entity';
import { evaluateRule } from '../rules/rules.evaluator';

@Injectable()
export class FraudService {
  constructor(
    @InjectRepository(Transaction)
    private readonly transactionRepo: Repository<Transaction>,
    @InjectRepository(Rule)
    private readonly ruleRepo: Repository<Rule>,  // <- dynamic rules from DB
  ) {}

  // ✅ Individual transaction fraud check using DB rules
  async checkTransaction(transaction: any) {
    const { txnId, id } = transaction;
    const triggeredRules: string[] = [];

    const rules = await this.ruleRepo.find(); // fetch all active rules
    for (const rule of rules) {
      const triggered = evaluateRule(rule, transaction);
      if (triggered) triggeredRules.push(rule.name);
    }

    const isFraudulent = triggeredRules.length > 0;
    return {
      transactionId: txnId,
      status: isFraudulent ? 'Fraudulent' : 'Legit',
      triggeredRules,
    };
  }

  // ✅ Dashboard summary
  async getSummary() {
    const transactions = await this.transactionRepo.find();
    const total = transactions.length;

    const fraudResults = await Promise.all(
      transactions.map((t) => this.checkTransaction(t))
    );

    const frauds = fraudResults.filter((f) => f.status === 'Fraudulent');

    const ruleCount: Record<string, number> = {};
    frauds.forEach((f) =>
      f.triggeredRules.forEach((r) => (ruleCount[r] = (ruleCount[r] || 0) + 1))
    );

    const topRules = Object.entries(ruleCount)
      .map(([rule, count]) => ({ rule, count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalTransactions: total,
      fraudCount: frauds.length,
      fraudPercentage: total ? (frauds.length / total) * 100 : 0,
      topRules,
    };
  }
}
