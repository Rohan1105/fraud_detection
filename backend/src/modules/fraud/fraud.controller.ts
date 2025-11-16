import { Controller, Post, Body, Get,Param,Query } from '@nestjs/common';
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

  @Get('summary/daily-stats')
  async getSummaryDaily( 
    @Query('from') from?: string
  ){
    return this.fraudService.getSummaryDaily(from);
  }

  @Get('summary/mcc-stats')
  async getSummaryMcc( 
    @Query('mcc') mcc?: string
  ){
    return this.fraudService.getSummaryMcc(mcc);
  }

}
