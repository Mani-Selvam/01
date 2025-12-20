import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { MainComponent } from './layout/main/main.component';
import { LoginComponent } from './Auth/login/login.component';
import { RegisterComponent } from './Auth/register/register.component';
import { DashboardComponent } from './Master/dashboard/dashboard.component';
import { UsersComponent } from './Master/users/users.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { DynamicDialogConfig, DynamicDialogModule, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PlanComponent } from './Master/plan/plan.component';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { CouponsComponent } from './Master/coupons/coupons.component';
import { CalendarModule } from 'primeng/calendar';
import { DatePipe } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { AboutusComponent } from './Master/aboutus/aboutus.component';
import { DropdownModule } from 'primeng/dropdown';
import { TicketComponent } from './Master/ticket/ticket.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    MainComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    UsersComponent,
    PlanComponent,
    CouponsComponent,
    AboutusComponent,
    TicketComponent
  ],
  imports: [
    BrowserModule,CalendarModule,ToastModule,ConfirmDialogModule,DropdownModule,
    AppRoutingModule,  HttpClientModule, DynamicDialogModule,BrowserAnimationsModule,
    ReactiveFormsModule,TableModule, FormsModule, CommonModule, ButtonModule, DialogModule, ReactiveFormsModule
  ],
  providers: [
    MessageService, ConfirmationService,DatePipe,
  
    DynamicDialogRef, DynamicDialogConfig,
    // {
    //     provide: SwRegistrationOptions,
    //     useFactory: () => ({ enabled: false }),
    // },
],
  bootstrap: [AppComponent]
})
export class AppModule { }
