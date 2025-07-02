import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  jogadores: any[] = [];
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5055/api/jogadores')
      .subscribe({
        next: data => this.jogadores = data,
        error: err => console.error('Erro ao buscar jogadores:', err)
      });
  }
}