// src/modules/rules/rule.controller.ts
import { Controller, Get, Post, Patch, Delete, Body, Param, ParseIntPipe } from '@nestjs/common';
import { RuleService } from './rules.service';
import { Rule } from './rules.entity';

@Controller('api/rules')
export class RuleController {
  constructor(private readonly ruleService: RuleService) {}

  @Get()
  async getRules(): Promise<Rule[]> {
    return this.ruleService.getRules();
  }

  @Get(':id')
  async getRule(@Param('id', ParseIntPipe) id: number): Promise<Rule> {
    return this.ruleService.getRuleById(id);
  }

  @Post()
  async createRule(@Body() ruleData: Partial<Rule>): Promise<Rule> {
    return this.ruleService.createRule(ruleData);
  }

  @Patch(':id')
  async updateRule(
    @Param('id', ParseIntPipe) id: number,
    @Body() ruleData: Partial<Rule>,
  ): Promise<Rule> {
    return this.ruleService.updateRule(id, ruleData);
  }

  @Delete(':id')
  async deleteRule(@Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    await this.ruleService.deleteRule(id);
    return { message: 'Rule deleted successfully' };
  }
}
