import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdiniComponent } from './ordini/ordini.component';
import { TablesComponent } from './tables/tables.component';

const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'tables/:id', component: TablesComponent },
  { path: 'ordini', component: OrdiniComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
