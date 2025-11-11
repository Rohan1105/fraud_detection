// src/app/pages/transactions/transactions.component.ts
import { Component, OnInit } from '@angular/core';
import { TransactionsService } from '../../app/services/transactions.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: number;
  txnId: string;
  amount: number;
  merchant: string;
  mcc: string;
  ts: string;
}

interface FraudResult {
  transaction: Transaction;
  fraudStatus: 'Fraudulent' | 'Clean';
  triggeredRules: string[];
}

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  imports: [CommonModule,FormsModule],
  styleUrls: ['./transactions.component.css']
})
export class TransactionsComponent implements OnInit {
  transactions: Transaction[] = [];
  fraudResults: Record<string, FraudResult> = {};
  loading = false;
  error: string | null = null;

  customerId = '877';
  from = '2025-01-01';
  to = '2025-02-01';

  constructor(private txService: TransactionsService) {}

  ngOnInit() { this.fetchTransactions(); }

  async fetchTransactions() {
    try {
      this.loading = true;
      this.error = null;
      const data = await this.txService.getCustomerTransactions(this.customerId, this.from, this.to);
      this.transactions = data.transactions || [];
    } catch (err: any) {
      this.error = err.message || 'Failed';
      this.transactions = [];
    } finally {
      this.loading = false;
    }
  }

  async fetchAllTransactions() {
    try {
      this.loading = true;
      this.error = null;
      const data = await this.txService.getAllTransactions();
      this.transactions = data.transactions || [];
    } catch (err: any) {
      this.error = err.message || 'Failed';
      this.transactions = [];
    } finally {
      this.loading = false;
    }
  }

  exportToExcel() {
    window.open(this.txService.exportUrl(), '_blank');
  }

  async checkFraud(txn: Transaction) {
    try {
      const data = await this.txService.checkFraud({ txnId: txn.txnId });
      if (data) this.fraudResults[txn.txnId] = data;
    } catch (err) {
      console.error(err);
    }
  }

  async checkAllFraud() {
    for (const t of this.transactions) {
      if (!this.fraudResults[t.txnId]) {
        await this.checkFraud(t);
      }
    }
  }
}
