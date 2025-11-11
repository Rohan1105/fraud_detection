import { Body, Controller, Post, Get, Param, Query, Headers, Res } from '@nestjs/common';
import type { Response } from 'express';
import * as XLSX from 'xlsx';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('api')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('ingest/transactions')
  async ingestTransaction(
    @Body() dto: CreateTransactionDto,
    @Headers('Idempotency-Key') idempotencyKey: string
  ) {
    return this.transactionsService.ingestTransaction(dto, idempotencyKey);
  }

  @Get('transactions/all')
  async getAllTransactions() {
    return this.transactionsService.getAllTransactions();
  }

  @Get('customer/:id/transactions')
  async getCustomerTransactions(
    @Param('id') id: number,
    @Query('from') from?: string,
    @Query('to') to?: string
  ) {
    return this.transactionsService.getCustomerTransactions(id, from, to);
  }

 @Get('export')
async exportTransactions(@Res() res: Response) {
  const { transactions } = await this.transactionsService.getAllTransactions();

  // For each transaction, also check fraud
  const transactionsWithFraud = await Promise.all(
    transactions.map(async (txn) => {
      const fraud = await this.transactionsService.checkFraud(txn.txnId);
      return {
        ...txn,
        fraudStatus: fraud?.fraudStatus || 'Clean',
        triggeredRules: fraud?.triggeredRules.join(', ') || '',
      };
    })
  );

  // Convert to Excel sheet
  const ws = XLSX.utils.json_to_sheet(transactionsWithFraud);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Disposition', 'attachment; filename=transactions.xlsx');
  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  res.send(buffer);
}


  // ✅ Check fraud for a transaction (for frontend "Check Fraud" button)
  @Post('fraud/check')
  async checkFraud(@Body() txn: CreateTransactionDto) {
    return this.transactionsService.checkFraud(txn.txnId);
  }
}
