// src/app/pages/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { FraudService } from '../../app/services/fraud.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Chart from 'chart.js/auto';

// Global Chart Theme
Chart.defaults.color = "#d1d5db";
Chart.defaults.borderColor = "rgba(255,255,255,0.08)";
Chart.defaults.font.family = "Inter, sans-serif";
Chart.defaults.plugins.legend.labels.usePointStyle = true;
Chart.defaults.plugins.legend.labels.boxWidth = 8;

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  imports: [CommonModule, FormsModule],
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  
  stats: any;
  dailyStats: any;
  mccStats: any;

  selectedDate = "";
  selectedMcc = "MCC1055";
  mccList = ["MCC1055", "MCC1052", "MCC1056", "MCC1053"];
  cleanRatio = "";

  // Charts
  mainChart: Chart | null = null;
  fraudRatioChart: Chart | null = null;

  // Which data to display in main chart
  activeChart: 'daily' | 'mcc' = 'daily';

  loading = false;
  error: string | null = null;

  constructor(private fraudService: FraudService) {}

  ngOnInit() {
    this.selectedDate = new Date().toISOString().split("T")[0];
    this.fetchDashboardData();
  }

  // Fetch everything on load
  async fetchDashboardData() {
    try {
      this.loading = true;

      this.stats = await this.fraudService.getSummary();
      this.dailyStats = await this.fraudService.getDailyStats(this.selectedDate);
      this.mccStats = await this.fraudService.getMccStats(this.selectedMcc);
      this.cleanRatio = (((this.stats.totalTransactions - this.stats.fraudCount)/this.stats.totalTransactions)*100).toFixed(2);
      this.renderFraudRatioChart();
      this.renderMainChart();

    } catch (err) {
      this.error = "Failed to load dashboard";
    } finally {
      this.loading = false;
    }
  }

  // When user changes date
  async reloadDailyStats() {
    this.activeChart = 'daily';
    this.dailyStats = await this.fraudService.getDailyStats(this.selectedDate);
    this.renderMainChart();
  }

  // When user changes MCC
  async reloadMccStats() {
    this.activeChart = 'mcc';
    this.mccStats = await this.fraudService.getMccStats(this.selectedMcc);
    this.renderMainChart();
  }

  // Single main chart (daily or mcc)
  renderMainChart() {
    if (this.mainChart) this.mainChart.destroy();

    const isDaily = this.activeChart === 'daily';
    const source = isDaily ? this.dailyStats : this.mccStats;

    const title = isDaily
      ? `Daily Stats (${source.date})`
      : `MCC Stats (${source.mcc})`;

    this.mainChart = new Chart("mainChart", {
      type: "bar",
      data: {
        labels: ["Total Transactions", "Fraud Transactions"],
        datasets: [{
          label: title,
          data: [source.totalTransactions, source.fraudCount],
          backgroundColor: ["#3b82f6", "#ef4444"],
          borderRadius: 12,
          barThickness: 45
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: "rgba(255,255,255,0.08)" }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }

  // Donut chart
  renderFraudRatioChart() {
    if (this.fraudRatioChart) this.fraudRatioChart.destroy();

    this.fraudRatioChart = new Chart("fraudRatioChart", {
      type: "doughnut",
      data: {
        labels: ["Clean Transactions","Fraud Transactions"],
        datasets: [{
          data: [
            this.stats.totalTransactions - this.stats.fraudCount,
            this.stats.fraudCount
          ],
          backgroundColor: ["#22c55e","#ef4444"],
          borderWidth: 2,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "64%",
      }
    });
  }
}
