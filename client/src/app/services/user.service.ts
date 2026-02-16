import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    // Update own profile
    updateProfile(profileData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, profileData);
    }

    // Get own profile
    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`);
    }

    // Admin: Get all users
    getAllUsers(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    // Admin: Get user by ID
    getUserById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    // Admin: Delete user
    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
