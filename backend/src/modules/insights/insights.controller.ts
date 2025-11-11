import { Controller, Get, Param } from '@nestjs/common';
import { InsightsService } from './insights.service';

@Controller('api/insights')
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get(':customerId/summary')
  async getSummary(@Param('customerId') customerId: string) {
    return this.insightsService.getCustomerInsights(customerId);
  }
}
