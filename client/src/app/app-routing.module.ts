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
import { AssessmentComponent } from './components/assessment/assessment.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { ManageJobComponent } from './components/manage-job/manage-job.component';

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
  { path: 'jobs/:id', component: JobDetailComponent, canActivate: [AuthGuard] },
  { path: 'manage-job/:id', component: ManageJobComponent, canActivate: [AuthGuard] },
  { path: 'assessment/:jobId', component: AssessmentComponent, canActivate: [AuthGuard] },

  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
