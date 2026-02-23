import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { EmployerDashboardComponent } from './components/employer-dashboard/employer-dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';

import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobsComponent, canActivate: [AuthGuard] },
  { path: 'dashboard', component: EmployerDashboardComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'post-job', component: PostJobComponent, canActivate: [AuthGuard] },
  { path: 'contact', component: ContactUsComponent },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
