// src/app/services/fraud.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FraudService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async getSummary() {
    return firstValueFrom(this.http.get<any>(`${this.base}/fraud/summary`));
  }

  async checkTransaction(txn: any) {
    return firstValueFrom(this.http.post<any>(`${this.base}/fraud/check`, txn));
  }
}
