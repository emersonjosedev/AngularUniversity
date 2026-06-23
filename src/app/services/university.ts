import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { University, SearchHistory } from '../models/university';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private apiUrl = 'http://universities.hipolabs.com/search';

  constructor(private http: HttpClient) { }

  getUniversities(country: string): Observable<University[]> {
    return this.http.get<University[]>(`${this.apiUrl}?country=${country}`);
  }

  // --- LOCAL STORAGE: Favoritos ---
  getFavorites(): University[] {
    const favs = localStorage.getItem('favorites');
    return favs ? JSON.parse(favs) : [];
  }

  toggleFavorite(university: University): void {
    let favorites = this.getFavorites();
    const index = favorites.findIndex(f => f.name === university.name);
    
    if (index > -1) {
      favorites.splice(index, 1); // Remove se já existe
    } else {
      university.isFavorite = true;
      favorites.push(university); // Adiciona se não existe
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }

  // --- LOCAL STORAGE: Histórico ---
  getHistory(): SearchHistory[] {
    const history = localStorage.getItem('searchHistory');
    return history ? JSON.parse(history) : [];
  }

  addSearchHistory(country: string): void {
    let history = this.getHistory();
    const newEntry: SearchHistory = {
      date: new Date().toLocaleString(),
      country: country
    };
    history.unshift(newEntry); // Adiciona no início
    localStorage.setItem('searchHistory', JSON.stringify(history.slice(0, 10))); // Mantém os 10 últimos
  }
}