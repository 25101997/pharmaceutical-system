import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  readonly apiStatus = signal('Consultando API...');

  constructor(private readonly http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<{ status: string; database: string }>('/api/health').subscribe({
      next: (response) => this.apiStatus.set(`API: ${response.status} | Oracle: ${response.database}`),
      error: () => this.apiStatus.set('API no disponible')
    });
  }
}
