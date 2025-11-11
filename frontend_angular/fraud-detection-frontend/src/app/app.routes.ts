import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RulesComponent } from './rules/rules.component';
import { TransactionsComponent } from './transactions/transactions.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'rules', component: RulesComponent },
  { path: 'transactions', component: TransactionsComponent },
];
