// src/modules/rules/rule-evaluator.ts
import { Rule } from './rules.entity';

export function evaluateRule(rule: Rule, transaction: any): boolean {
  switch (rule.type) {
    case 'amount_limit':
      return transaction.amount > rule.params.maxAmount;
    case 'merchant_blacklist':
      return rule.params.merchants.includes(transaction.merchant);
    case 'odd_hours':
      const hour = new Date(transaction.timestamp).getHours();
      return hour >= rule.params.startHour && hour <= rule.params.endHour;
    default:
      return false;
  }
}
