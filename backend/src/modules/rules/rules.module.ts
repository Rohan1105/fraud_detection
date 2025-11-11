// src/modules/rules/rule.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rule } from './rules.entity';
import { RuleService } from './rules.service';
import { RuleController } from './rules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Rule])],
  providers: [RuleService],
  controllers: [RuleController],
})
export class RuleModule {}
