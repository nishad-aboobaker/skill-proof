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

    // Update the current user's profile
    updateProfile(profileData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/profile`, profileData);
    }

    // Get the current user's profile
    getProfile(): Observable<any> {
        return this.http.get(`${this.apiUrl}/profile`);
    }

    // Admin only: get all users
    getAllUsers(): Observable<any> {
        return this.http.get(this.apiUrl);
    }

    // Admin only: get a single user by their ID
    getUserById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    // Admin only: delete a user by their ID
    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}
