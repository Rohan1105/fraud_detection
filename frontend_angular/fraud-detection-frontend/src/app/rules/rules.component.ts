// src/app/pages/rules/rules.component.ts
import { Component, OnInit } from '@angular/core';
import { RulesService } from '../../app/services/rules.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Rule { id: number; name: string; description: string; type: string; params: any; }

const RULE_TYPES: Record<string, { example: object }> = {
  amount_limit: { example: { maxAmount: 1000 } },
  merchant_blacklist: { example: { merchants: ["Merchant_86"] } },
  odd_hours: { example: { startHour: 0, endHour: 6 } },
};

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./rules.component.css']
})
export class RulesComponent implements OnInit {
  RULE_TYPES: any = {
    amount_limit: { example: { maxAmount: 1000 } },
    merchant_blacklist: { example: { merchants: ["Merchant_86"] } },
    odd_hours: { example: { startHour: 0, endHour: 6 } },
  };

  JSON = JSON;
  Object = Object;

  rules: Rule[] = [];
  loading = false;
  error: string | null = null;

  name = '';
  description = '';
  type = 'amount_limit';
  params = JSON.stringify(RULE_TYPES['amount_limit'].example);

  constructor(private rulesService: RulesService) { }

  ngOnInit() { this.fetchRules(); }

  async fetchRules() {
    try {
      this.loading = true;
      this.rules = await this.rulesService.getRules();
    } catch (err: any) {
      this.error = err.message || 'Failed';
    } finally {
      this.loading = false;
    }
  }

  validateJSON(input: string) {
    try { return JSON.parse(input); } catch { return null; }
  }

  async addRule() {
    const parsed = this.validateJSON(this.params);
    if (!parsed) { this.error = 'Params must be valid JSON'; return; }
    try {
      await this.rulesService.createRule({ name: this.name, description: this.description, type: this.type, params: parsed });
      this.name = ''; this.description = ''; this.type = 'amount_limit';
      this.params = JSON.stringify(RULE_TYPES['amount_limit'].example);
      this.fetchRules();
    } catch (err: any) {
      this.error = err.message || 'Failed';
    }
  }

  async deleteRule(id: number) {
    if (!confirm('Are you sure you want to delete this rule?')) return;
    try {
      await this.rulesService.deleteRule(id);
      this.fetchRules();
    } catch (err: any) {
      this.error = err.message || 'Delete failed';
    }
  }
}
