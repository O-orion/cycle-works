import { Component, OnInit, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Chart from 'chart.js/auto';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  isDarkMode = true;
  isAdmin = false;
  stockItems = [
    { name: 'Produto A', phase: 'Entrada', quantity: 50, description: 'Entrou hoje.', lastMovement: '01/03/2025', trend: 10, x: 150, y: 30, phaseColor: 'rgba(212, 175, 55, 0.2)', icon: '/carrinho.png', action: 'monitorar', actionLabel: 'Monitorar' },
    { name: 'Produto B', phase: 'Uso', quantity: 8, description: 'Em uso ativo.', lastMovement: '28/02/2025', trend: -5, x: 270, y: 150, phaseColor: 'rgba(76, 175, 80, 0.2)', icon: '/cartao.png', action: 'reabastecer', actionLabel: 'Reabastecer' },
    { name: 'Produto C', phase: 'Reaproveitamento', quantity: 15, description: 'Redistribuído.', lastMovement: '25/02/2025', trend: 3, x: 150, y: 270, phaseColor: 'rgba(165, 214, 167, 0.2)', icon: '/produto2.png', action: 'redistribuir', actionLabel: 'Redistribuir' },
    { name: 'Produto D', phase: 'Descarte', quantity: 5, description: 'Pronto pra reciclar.', lastMovement: '20/02/2025', trend: -2, x: 30, y: 150, phaseColor: 'rgba(212, 175, 55, 0.3)', icon: '/produtos.png', action: 'reciclar', actionLabel: 'Reciclar' }
  ];
  selectedItem: any = null;
  suggestion: any = null;

  totalStock = 0;
  reaproveitamentoPercent = 0;
  criticalItems = 0;
  efficiencyPercent = 0;

  private ecoGreen = '#4CAF50';
  private lightGreen = '#A5D6A7';
  private cycleGold = '#D4AF37';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('isDarkMode');
      this.isDarkMode = savedTheme ? JSON.parse(savedTheme) : true;
      document.body.classList.toggle('dark-mode', this.isDarkMode);

      const savedAdmin = localStorage.getItem('isAdmin');
      this.isAdmin = savedAdmin ? JSON.parse(savedAdmin) : false;
    }

    this.selectedItem = this.stockItems[0];
    this.calculateStats();
    this.checkSuggestions();
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.updateCharts();
    }
  }

  selectItem(item: any) {
    this.selectedItem = item;
    if (isPlatformBrowser(this.platformId)) {
      this.updateCharts();
    }
    this.checkSuggestions();
  }

  calculateStats() {
    this.totalStock = this.stockItems.reduce((sum, item) => sum + item.quantity, 0);
    const reaproveitado = this.stockItems
      .filter(item => item.phase === 'Reaproveitamento')
      .reduce((sum, item) => sum + item.quantity, 0);
    this.reaproveitamentoPercent = this.totalStock > 0 ? Math.round((reaproveitado / this.totalStock) * 100) : 0;
    this.criticalItems = this.stockItems.filter(item => item.quantity < 10 && item.phase === 'Uso').length;
    const descartado = this.stockItems
      .filter(item => item.phase === 'Descarte')
      .reduce((sum, item) => sum + item.quantity, 0);
    this.efficiencyPercent = this.totalStock > 0 ? Math.round(((this.totalStock - descartado) / this.totalStock) * 100) : 0;
  }

  checkSuggestions() {
    if (this.selectedItem.quantity < 10 && this.selectedItem.phase === 'Uso') {
      this.suggestion = { message: `${this.selectedItem.name} está com estoque baixo.`, action: 'reabastecer', actionLabel: 'Reabastecer' };
    } else if (this.selectedItem.phase === 'Reaproveitamento') {
      this.suggestion = { message: `${this.selectedItem.name} pode ser redistribuído.`, action: 'redistribuir', actionLabel: 'Redistribuir' };
    } else if (this.selectedItem.phase === 'Descarte') {
      this.suggestion = { message: `${this.selectedItem.name} está pronto pra reciclagem.`, action: 'reciclar', actionLabel: 'Reciclar' };
    } else {
      this.suggestion = null;
    }
  }

  takeAction(action: string) {
    console.log(`Ação tomada: ${action} para ${this.selectedItem.name}`);
  }

  updateCharts() {
    this.updateItemChart();
    this.updatePhaseChart();
    this.updateTrendChart();
    this.updateCriticalChart();
  }

  updateItemChart() {
    const ctx = document.getElementById('itemChart') as HTMLCanvasElement;
    if (ctx && this.selectedItem) {
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Quantidade Atual', 'Tendência (30 dias)'],
          datasets: [{
            label: this.selectedItem.phase,
            data: [this.selectedItem.quantity, this.selectedItem.trend],
            backgroundColor: [this.isDarkMode ? this.ecoGreen : this.lightGreen, this.isDarkMode ? this.cycleGold : this.cycleGold],
            borderColor: this.cycleGold,
            borderWidth: 2
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 50, ticks: { color: this.isDarkMode ? this.textLight : this.textDark } },
            x: { ticks: { color: this.isDarkMode ? this.textLight : this.textDark } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  updatePhaseChart() {
    const ctx = document.getElementById('phaseChart') as HTMLCanvasElement;
    if (ctx) {
      const phaseData = {
        'Entrada': this.stockItems.filter(i => i.phase === 'Entrada').reduce((sum, i) => sum + i.quantity, 0),
        'Uso': this.stockItems.filter(i => i.phase === 'Uso').reduce((sum, i) => sum + i.quantity, 0),
        'Reaproveitamento': this.stockItems.filter(i => i.phase === 'Reaproveitamento').reduce((sum, i) => sum + i.quantity, 0),
        'Descarte': this.stockItems.filter(i => i.phase === 'Descarte').reduce((sum, i) => sum + i.quantity, 0)
      };
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: Object.keys(phaseData),
          datasets: [{
            data: Object.values(phaseData),
            backgroundColor: [this.cycleGold, this.ecoGreen, this.lightGreen, this.isDarkMode ? '#FFD700' : '#D4AF37'],
            borderColor: this.cycleGold,
            borderWidth: 1
          }]
        },
        options: {
          plugins: { legend: { position: 'bottom', labels: { color: this.isDarkMode ? this.textLight : this.textDark } } }
        }
      });
    }
  }

  updateTrendChart() {
    const ctx = document.getElementById('trendChart') as HTMLCanvasElement;
    if (ctx) {
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
          datasets: [{
            label: 'Tendência Geral',
            data: [5, -2, 3, this.stockItems.reduce((sum, i) => sum + i.trend, 0) / 4],
            borderColor: this.cycleGold,
            backgroundColor: this.isDarkMode ? this.ecoGreen : this.lightGreen,
            fill: false,
            tension: 0.4
          }]
        },
        options: {
          scales: {
            y: { ticks: { color: this.isDarkMode ? this.textLight : this.textDark } },
            x: { ticks: { color: this.isDarkMode ? this.textLight : this.textDark } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  updateCriticalChart() {
    const ctx = document.getElementById('criticalChart') as HTMLCanvasElement;
    if (ctx) {
      const critical = this.stockItems.filter(i => i.quantity < 10 && i.phase === 'Uso');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: critical.map(i => i.name),
          datasets: [{
            label: 'Itens Críticos',
            data: critical.map(i => i.quantity),
            backgroundColor: '#e63946',
            borderColor: this.cycleGold,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: { beginAtZero: true, max: 10, ticks: { color: this.isDarkMode ? this.textLight : this.textDark } },
            x: { ticks: { color: this.isDarkMode ? this.textLight : this.textDark } }
          },
          plugins: { legend: { display: false } }
        }
      });
    }
  }

  private get textLight() { return '#E0E0E0'; }
  private get textDark() { return '#2E2E2E'; }
}
