import { Controller, Post, Body, Get } from '@nestjs/common';
import { FraudService } from './fraud.service';

@Controller('api/fraud')
export class FraudController {
  constructor(private readonly fraudService: FraudService) {}

  @Post('check')
  async checkTransaction(@Body() transaction: any) {
    return this.fraudService.checkTransaction(transaction);
  }

  @Get('summary')
  async getSummary() {
    return this.fraudService.getSummary();
  }
}
