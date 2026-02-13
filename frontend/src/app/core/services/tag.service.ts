import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TagService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  getAllTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${this.api}/admin/tags`);
  }

  createTag(name: string): Observable<Tag> {
    return this.http.post<Tag>(`${this.api}/admin/tags`, { name });
  }

  updateTag(id: number, name: string): Observable<Tag> {
    return this.http.put<Tag>(`${this.api}/admin/tags/${id}`, { name });
  }

  deleteTag(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/tags/${id}`);
  }

  mergeTags(sourceId: number, targetId: number): Observable<void> {
    return this.http.post<void>(`${this.api}/admin/tags/merge`, { sourceId, targetId });
  }
}
