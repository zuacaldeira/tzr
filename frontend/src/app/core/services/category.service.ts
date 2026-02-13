import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category, CategoryCreate } from '../models/category.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private http = inject(HttpClient);
  private api = environment.apiUrl;

  // Public endpoints
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/public/categories`);
  }

  getCategoryBySlug(slug: string): Observable<Category> {
    return this.http.get<Category>(`${this.api}/public/categories/${slug}`);
  }

  // Admin endpoints
  getAdminCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/admin/categories`);
  }

  getAdminCategory(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.api}/admin/categories/${id}`);
  }

  createCategory(category: CategoryCreate): Observable<Category> {
    return this.http.post<Category>(`${this.api}/admin/categories`, category);
  }

  updateCategory(id: number, category: CategoryCreate): Observable<Category> {
    return this.http.put<Category>(`${this.api}/admin/categories/${id}`, category);
  }

  deleteCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/categories/${id}`);
  }

  reorder(orderedIds: number[]): Observable<void> {
    return this.http.put<void>(`${this.api}/admin/categories/reorder`, { orderedIds });
  }
}
