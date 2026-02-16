import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

    // Create new job
    createJob(jobData: any): Observable<any> {
        return this.http.post(this.apiUrl, jobData);
    }

    // Get all jobs (with optional filters)
    getJobs(filters?: { status?: string; type?: string; location?: string; search?: string }): Observable<any> {
        let params: any = {};
        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key as keyof typeof filters]) {
                    params[key] = filters[key as keyof typeof filters];
                }
            });
        }
        return this.http.get(this.apiUrl, { params });
    }

    // Get single job by ID
    getJobById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    // Update job
    updateJob(id: string, jobData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, jobData);
    }

    // Delete job
    deleteJob(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    // Apply to job
    applyToJob(id: string, applicationData: { coverLetter?: string; resume?: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/${id}/apply`, applicationData);
    }

    // Get my posted jobs
    getMyPostedJobs(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my/posted`);
    }

    // Get my applications
    getMyApplications(): Observable<any> {
        return this.http.get(`${this.apiUrl}/my/applications`);
    }

    // Update application status (job owner or admin)
    updateApplicationStatus(jobId: string, userId: string, status: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${jobId}/applicants/${userId}`, { status });
    }
}
