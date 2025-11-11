// src/app/services/rules.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class RulesService {
  private base = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  async getRules() {
    return firstValueFrom(this.http.get<any>(`${this.base}/rules`));
  }

  async createRule(payload: any) {
    return firstValueFrom(this.http.post<any>(`${this.base}/rules`, payload));
  }

  async deleteRule(id: number) {
    return firstValueFrom(this.http.delete<any>(`${this.base}/rules/${id}`));
  }
}
