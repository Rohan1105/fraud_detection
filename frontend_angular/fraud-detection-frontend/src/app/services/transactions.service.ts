// src/app/services/transactions.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async getAllTransactions() {
    return firstValueFrom(this.http.get<any>(`${this.base}/transactions/all`));
  }

  async getCustomerTransactions(customerId: string, from?: string, to?: string) {
    const qs = new URLSearchParams();
    if (from) qs.set('from', from);
    if (to) qs.set('to', to);
    return firstValueFrom(this.http.get<any>(`${this.base}/customer/${customerId}/transactions?${qs.toString()}`));
  }

  async ingestTransaction(payload: any, idempotencyKey?: string) {
    const headers: any = {};
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;
    return firstValueFrom(this.http.post<any>(`${this.base}/ingest/transactions`, payload, { headers }));
  }

  async checkFraud(txnIdOrPayload: any) {
    // backend accepts { txnId } or transaction object per your API; keep consistent with backend
    return firstValueFrom(this.http.post<any>(`${this.base}/fraud/check`, txnIdOrPayload));
  }

  exportUrl() {
    return `${this.base}/export`;
  }
}
