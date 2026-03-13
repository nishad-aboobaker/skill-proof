import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JobsComponent } from './components/jobs/jobs.component';
import { EmployerDashboardComponent } from './components/employer-dashboard/employer-dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PostJobComponent } from './components/post-job/post-job.component';
import { ContactUsComponent } from './components/contact-us/contact-us.component';
import { AssessmentComponent } from './components/assessment/assessment.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { ManageJobComponent } from './components/manage-job/manage-job.component';
import { MyPostedJobsComponent } from './components/my-posted-jobs/my-posted-jobs.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    JobsComponent,
    EmployerDashboardComponent,
    FooterComponent,
    ProfileComponent,
    PostJobComponent,
    ContactUsComponent,
    AssessmentComponent,
    JobDetailComponent,
    ManageJobComponent,
    MyPostedJobsComponent,
    MyApplicationsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    // MonacoEditorModule.forRoot({ baseUrl: 'assets' })  
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
