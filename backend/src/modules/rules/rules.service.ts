// src/modules/rules/rule.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rule } from './rules.entity';

@Injectable()
export class RuleService {
  constructor(
    @InjectRepository(Rule)
    private ruleRepo: Repository<Rule>,
  ) {}

  async getRules(): Promise<Rule[]> {
    return this.ruleRepo.find();
  }

  async getRuleById(id: number): Promise<Rule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) throw new NotFoundException('Rule not found');
    return rule;
  }

  async createRule(ruleData: Partial<Rule>): Promise<Rule> {
    const rule = this.ruleRepo.create(ruleData);
    return this.ruleRepo.save(rule);
  }

  async updateRule(id: number, ruleData: Partial<Rule>): Promise<Rule> {
    const rule = await this.getRuleById(id);
    Object.assign(rule, ruleData);
    return this.ruleRepo.save(rule);
  }

  async deleteRule(id: number): Promise<void> {
    const rule = await this.getRuleById(id);
    await this.ruleRepo.remove(rule);
  }
}
