import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class PlatformService {
    private apiUrl = environment.apiUrl + '/admin';

    constructor(private http: HttpClient) { }

    getMaintenanceStatus(): Observable<any> {
        return this.http.get(`${this.apiUrl}/maintenance-status`);
    }
}
