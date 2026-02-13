import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class NewsletterService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  subscribe(email: string): Observable<any> {
    return this.http.post(`${this.api}/public/newsletter`, { email });
  }
}
