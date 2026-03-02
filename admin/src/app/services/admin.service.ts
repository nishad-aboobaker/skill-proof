import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = 'http://localhost:5000/admin';

    constructor(private http: HttpClient) { }

    getDashboardStats(): Observable<any> {
        return this.http.get(`${this.apiUrl}/stats`, { withCredentials: true }).pipe(
            map((res: any) => res.data)
        );
    }

    getSettings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/settings`, { withCredentials: true }).pipe(
            map((res: any) => res.data)
        );
    }

    updateProfile(data: { name: string; email: string; phone: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/settings/profile`, data, { withCredentials: true });
    }

    updatePassword(data: { currentPassword: string; newPassword: string }): Observable<any> {
        return this.http.put(`${this.apiUrl}/settings/password`, data, { withCredentials: true });
    }

    getPlatformSettings(): Observable<any> {
        return this.http.get(`${this.apiUrl}/platform-settings`, { withCredentials: true }).pipe(
            map((res: any) => res.data)
        );
    }

    updatePlatformSettings(data: {
        maintenanceMode?: boolean;
        maintenanceMessage?: string;
        announcement?: { enabled: boolean; message: string }
    }): Observable<any> {
        return this.http.put(`${this.apiUrl}/platform-settings`, data, { withCredentials: true });
    }
}

