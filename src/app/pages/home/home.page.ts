import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UniversityService } from '../../services/university';
import { SearchHistory } from '../../models/university';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  searchTerm: string = '';
  history: SearchHistory[] = [];

  constructor(private router: Router, private uniService: UniversityService) {}

  ngOnInit() {
    this.loadHistory();
  }

  ionViewWillEnter() {
    this.loadHistory();
  }

  loadHistory() {
    this.history = this.uniService.getHistory();
  }

  searchCountry() {
    if (this.searchTerm.trim() !== '') {
      this.uniService.addSearchHistory(this.searchTerm);
      this.router.navigate(['/results'], { queryParams: { country: this.searchTerm } });
    }
  }

  searchFromHistory(country: string) {
    this.searchTerm = country;
    this.searchCountry();
  }
}