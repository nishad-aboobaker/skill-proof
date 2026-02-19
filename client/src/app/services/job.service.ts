import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// The shape of a job listing
export interface Job {
    _id: string;
    title: string;
    description: string;
    requirements: string;
    salary?: {
        min?: number;
        max?: number;
        currency?: string;
    };
    location: string;
    remote: boolean;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    skills?: string[];
    companyName?: string;
    companyLogo?: string;
    postedBy: any;
    applicants?: any[];
    status: 'active' | 'closed' | 'draft';
    createdAt: Date;
    updatedAt: Date;
}

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = environment.apiUrl + '/jobs';

    constructor(private http: HttpClient) { }

    // Create a new job posting
    createJob(jobData: any): Observable<any> {
        return this.http.post(this.apiUrl, jobData);
    }

    // Get all jobs (can filter by status, type, location, or search keyword)
    getJobs(filters?: { status?: string; type?: string; location?: string; search?: string }): Observable<any> {
        return this.http.get(this.apiUrl, { params: filters || {} });
    }

    // Get a single job by its ID
    getJobById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    // Update an existing job
    updateJob(id: string, jobData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, jobData);
    }

    // Delete a job
    deleteJob(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Apply to a job
    applyToJob(id: string, applicationData: { coverLetter?: string; resume?: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/apply`, applicationData);
    }

    // Get all jobs that the current user has posted
    getMyPostedJobs(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my/posted`);
    }

    // Get all jobs the current user has applied to
    getMyApplications(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my/applications`);
    }

    // Update the status of an applicant (e.g. shortlist or reject)
    updateApplicationStatus(jobId: string, userId: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${jobId}/applicants/${userId}`, { status });
    }
}
