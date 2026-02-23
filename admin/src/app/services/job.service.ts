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
        min: number;
        max: number;
        currency: string;
    };
    location: string;
    remote: boolean;
    type: 'full-time' | 'part-time' | 'contract' | 'internship';
    skills: string[];
    postedBy: any;
    companyName: string;
    companyLogo?: string;
    status: 'active' | 'closed' | 'draft';
    createdAt: Date;
    updatedAt: Date;
    applicants: any[];
}

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private apiUrl = `${environment.apiUrl}/jobs`;

    constructor(private http: HttpClient) { }

    getAllJobs(search?: string, showAll: boolean = true): Observable<any> {
        let params: string[] = [];
        if (showAll) params.push(`showAll=true`);
        if (search) params.push(`search=${search}`);

        const queryString = params.length > 0 ? `?${params.join('&')}` : '';
        return this.http.get(`${this.apiUrl}/${queryString}`);
    }

    getJobById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    updateJob(id: string, jobData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, jobData);
    }

    deleteJob(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
