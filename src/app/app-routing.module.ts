import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TablesComponent } from './tables/tables.component';
import { StatsComponent } from './stats/stats.component';
import { LoginComponent } from './login/login.component';
import { OrderComponent } from './order/order.component';
import { NewUserComponent } from './new-user/new-user.component';

const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tables/:id', component: TablesComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'order/:id', component: OrderComponent },
  { path: 'users', component: NewUserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
