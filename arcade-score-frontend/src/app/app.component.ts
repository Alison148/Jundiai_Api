import { Component, OnInit } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
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

  gerarCertificadoCampeao(): void {
    const campeao = this.ranking[0];
    if (!campeao) return;

    const dataFormatada = new Date(campeao.date).toLocaleString('pt-BR');

    const certificadoHTML = `
      <html>
        <head>
          <title>Certificado de Mérito</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background: #fdfdfd;
            }
            .certificado {
              border: 5px solid gold;
              padding: 40px;
              border-radius: 20px;
              max-width: 800px;
              margin: auto;
              background: #fffbe6;
            }
            h1 {
              color: #c59d00;
              font-size: 36px;
            }
            .premio {
              font-size: 24px;
              margin: 20px 0;
              color: green;
            }
            .nome {
              font-weight: bold;
              font-size: 28px;
              margin: 20px 0;
              color: #333;
            }
            .data {
              color: #777;
              margin-top: 30px;
              font-size: 16px;
            }
          </style>
        </head>
       <body onload="window.print()">
          <div class="certificado">
            <h1>🏅 Certificado de Mérito</h1>
            <p class="nome">${campeao.player}</p>
            <p>Foi consagrado(a) como</p>
            <h2>🏆 CAMPEÃO DO RANKING</h2>
            <p class="premio">Premiação: <strong>R$ 1.000.000,00</strong></p>
            <p class="data">Emitido em: ${dataFormatada}</p>
          </div>
        </body>
      </html>
    `;

    const janela = window.open('', '_blank');
    if (janela) {
      janela.document.write(certificadoHTML);
      janela.document.close();
    }
  }
}
