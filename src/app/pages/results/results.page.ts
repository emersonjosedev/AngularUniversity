import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UniversityService } from '../../services/university';
import { University } from '../../models/university';

@Component({
  selector: 'app-results',
  templateUrl: './results.page.html',
  styleUrls: ['./results.page.scss'],
  standalone: false
})
export class ResultsPage implements OnInit {
  country: string = '';
  allUniversities: University[] = [];
  filteredUniversities: University[] = [];
  
  // Dashboard
  totalUniversities: number = 0;
  uniqueDomains: number = 0;
  totalFavorites: number = 0;

  // Filtros
  localSearch: string = '';
  sortOrder: string = 'asc';

  constructor(private route: ActivatedRoute, private uniService: UniversityService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['country']) {
        this.country = params['country'];
        this.loadUniversities();
      }
    });
  }

  loadUniversities() {
    this.uniService.getUniversities(this.country).subscribe(data => {
      const favorites = this.uniService.getFavorites();
      
      this.allUniversities = data.map(uni => ({
        ...uni,
        isFavorite: favorites.some(f => f.name === uni.name)
      }));
      
      this.filteredUniversities = [...this.allUniversities];
      this.updateDashboard();
      this.sortData();
    });
  }

  updateDashboard() {
    this.totalUniversities = this.allUniversities.length;
    
    // Substituímos o flatMap por um reduce, que não dá erro de TypeScript
    const allDomains = this.allUniversities.reduce((acc, curr) => {
      return acc.concat(curr.domains);
    }, [] as string[]);
    
    const domains = new Set(allDomains);
    this.uniqueDomains = domains.size;
    this.totalFavorites = this.uniService.getFavorites().length;
  }

  filterLocal() {
    if (this.localSearch.trim() === '') {
      this.filteredUniversities = [...this.allUniversities];
    } else {
      const term = this.localSearch.toLowerCase();
      this.filteredUniversities = this.allUniversities.filter(u => 
        u.name.toLowerCase().includes(term)
      );
    }
    this.sortData();
  }

  sortData() {
    this.filteredUniversities.sort((a, b) => {
      if (this.sortOrder === 'asc') {
        return a.name.localeCompare(b.name);
      } else {
        return b.name.localeCompare(a.name);
      }
    });
  }

  toggleFav(uni: University) {
    this.uniService.toggleFavorite(uni);
    uni.isFavorite = !uni.isFavorite;
    this.updateDashboard();
  }
}