import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './layout/main/main.component';
import { LoginComponent } from './Auth/login/login.component';
import { UsersComponent } from './Master/users/users.component';
import { AuthGuard } from './Auth/auth.guard';
import { DashboardComponent } from './Master/dashboard/dashboard.component';
import { PlanComponent } from './Master/plan/plan.component';
import { CouponsComponent } from './Master/coupons/coupons.component';
import { AboutusComponent } from './Master/aboutus/aboutus.component';
import { TicketComponent } from './Master/ticket/ticket.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'main', component: MainComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UsersComponent, canActivate: [AuthGuard] },
  { path: 'plans', component: PlanComponent, canActivate: [AuthGuard] },
  { path: 'coupon', component: CouponsComponent, canActivate: [AuthGuard] },
  { path: 'aboutcontent', component: AboutusComponent, canActivate: [AuthGuard] },
  { path: 'ticket', component: TicketComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

