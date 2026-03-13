import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AssessmentAiService {
  constructor(private http: HttpClient) {}
  private baseurl = environment.apiUrl + '/assessment';

  generateQuestion(jobId: string): Observable<{ success: boolean; question: string }> {
    return this.http.get<{ success: boolean; question: string }>(
      `${this.baseurl}/generate/${jobId}`
    );
  }
}