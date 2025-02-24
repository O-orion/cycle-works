import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ControlComponent } from './pages/control/control.component';
import { ProductsComponent } from './pages/products/products.component';
import { EmployeesComponent } from './pages/employees/employees.component';
import { RolesComponent } from './pages/roles/roles.component';
import { ReportsComponent } from './pages/reports/reports.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'control', component: ControlComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'employees', component: EmployeesComponent },
  { path: 'roles', component: RolesComponent },
  { path: 'reports', component: ReportsComponent },
  { path: '**', redirectTo: '/login' }
];
