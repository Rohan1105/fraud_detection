// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { FraudService } from '../../app/services/fraud.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface FraudStats {
  totalTransactions: number;
  fraudCount: number;
  fraudPercentage: number;
  topRules: { rule: string; count: number }[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule,FormsModule],
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stats: FraudStats | null = null;
  loading = false;
  error: string | null = null;

  constructor(private fraudService: FraudService) {}

  ngOnInit() { this.fetchDashboardData(); }

  async fetchDashboardData() {
    try {
      this.loading = true;
      this.error = null;
      const data = await this.fraudService.getSummary();
      this.stats = data;
    } catch (err: any) {
      this.error = err.message || 'Failed to fetch';
    } finally {
      this.loading = false;
    }
  }
}
