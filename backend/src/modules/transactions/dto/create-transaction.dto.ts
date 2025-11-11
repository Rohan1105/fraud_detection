// src/modules/transactions/dto/create-transaction.dto.ts
export class CreateTransactionDto {
  customerId: string; // string from request
  txnId: string;
  amount: number;
  merchant: string;
  mcc: string;
  ts: Date;
}
