import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TranslationTask, TranslationStats } from '../models/translation-task.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslationTaskService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getStats(): Observable<TranslationStats> {
    return this.http.get<TranslationStats>(`${this.api}/admin/translations/tasks/stats`);
  }

  getPendingTasks(): Observable<TranslationTask[]> {
    return this.http.get<TranslationTask[]>(`${this.api}/admin/translations/tasks`, { params: { status: 'PENDING' } });
  }

  getAllTasks(): Observable<TranslationTask[]> {
    return this.http.get<TranslationTask[]>(`${this.api}/admin/translations/tasks`);
  }

  updateStatus(taskId: number, status: string): Observable<TranslationTask> {
    return this.http.patch<TranslationTask>(`${this.api}/admin/translations/tasks/${taskId}/status`, { status });
  }
}
