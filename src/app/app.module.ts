import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { NavbarComponent } from './navbar/navbar.component';
import { TablesComponent } from './tables/tables.component';
import { DashboardOrdersComponent } from './dashboard-orders/dashboard-orders.component';
import { DashboardTablesComponent } from './dashboard-tables/dashboard-tables.component';
import { StatsComponent } from './stats/stats.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NewOrderAlertComponent } from './new-order-alert/new-order-alert.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    NavbarComponent,
    TablesComponent,
    DashboardOrdersComponent,
    DashboardTablesComponent,
    StatsComponent,
    LoginComponent,
    NewOrderAlertComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  exports: [],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
