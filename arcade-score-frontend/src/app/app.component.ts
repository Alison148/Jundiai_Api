// src/app/app.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ CommonModule, HttpClientModule, RouterModule ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  ranking: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:5055/api/scores/ranking')
      .subscribe({
        next: dados => {
          // Ordena do maior para o menor
          this.ranking = dados.sort((a, b) => b.score - a.score);
        },
        error: err => console.error('Erro ao buscar ranking:', err)
      });
  }

  async adicionarJogador(): Promise<void> {
    const { value: nome } = await Swal.fire({
      title: 'Nome do jogador',
      input: 'text',
      inputLabel: 'Digite o nome do jogador',
      inputPlaceholder: 'Ex: João',
      confirmButtonText: 'Próximo',
      showCancelButton: true
    });

    if (!nome || nome.trim() === '') return;

    const { value: pontos } = await Swal.fire({
      title: 'Pontuação',
      input: 'number',
      inputLabel: 'Digite os pontos do jogador',
      inputPlaceholder: 'Ex: 1500',
      inputAttributes: { min: '0' },
      confirmButtonText: 'Salvar',
      showCancelButton: true
    });

    if (pontos === null || pontos === undefined || pontos < 0) return;

    const novo = { player: nome.trim(), score: +pontos, date: new Date() };

    this.http.post('http://localhost:5055/api/scores', novo).subscribe({
      next: () => {
        this.ranking.push(novo);
        this.ranking.sort((a, b) => b.score - a.score);
        Swal.fire('Sucesso!', 'Jogador adicionado ao ranking!', 'success');
      },
      error: () => Swal.fire('Erro!', 'Não foi possível adicionar o jogador.', 'error')
    });
  }
}
