import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    lastLogin?: Date;
    createdAt: Date;
    isActive: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) { }

    getAllUsers(search?: string): Observable<any> {
        let url = `${this.apiUrl}/`;
        if (search) {
            url += `?search=${search}`;
        }
        return this.http.get(url);
    }

    getUserById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/${id}`);
    }

    blockUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }

    updateUserRole(id: string, role: string): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}/role`, { role });
    }
}
