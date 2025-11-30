import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardDataService } from '@data/dashboard/dashboard-data.service';
import * as echarts from 'echarts';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardService = inject(DashboardDataService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('chartProjetos') chartProjetos?: ElementRef<HTMLDivElement>;
  @ViewChild('chartSetores') chartSetores?: ElementRef<HTMLDivElement>;
  @ViewChild('chartPie') chartPie?: ElementRef<HTMLDivElement>;

  chartProj: any;
  chartSet: any;
  chartPieInst: any;

  isLoading = true;
  sub: any;

  dataProjetos: any[] = [];
  dataSetores: any[] = [];
  dataStatus: any[] = [];

  prorrogadasMes = 0;
  concluidas = 0;
  pendentes = 0;
  atrasadas = 0;
  paralisadas = 0;
  proximasVencimento = 0;

  ngOnInit() {
    this.loadDashboard();
  }

  ngOnDestroy() {
    if (this.chartProj) this.chartProj.dispose();
    if (this.chartSet) this.chartSet.dispose();
    if (this.chartPieInst) this.chartPieInst.dispose();
    if (this.sub) this.sub.unsubscribe();
  }

  private trimLabel(t: string, max: number) {
    return t.length > max ? t.substring(0, max) + '…' : t;
  }

  loadDashboard() {
    this.sub = this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dataProjetos = (data.distribuicaoProjetos ?? []).map(x => ({ name: x.name, value: x.count }));
        this.dataSetores = (data.distribuicaoSetores ?? []).map(x => ({ name: x.name, value: x.count }));

        const colors = ['#0D47A1', '#42A5F5', '#BB1333', '#6A1B9A', '#AB47BC', '#EF5350', '#E57373'];

        const rawStatus = (data.distribuicaoStatus ?? []).map((x, i) => ({
          name: x.label,
          value: x.count,
          color: colors[i % colors.length]
        }));

        const total = rawStatus.reduce((s, i) => s + i.value, 0);

        const formatName = (t: string) =>
          t
            .replace(/_/g, ' ')
            .toLowerCase()
            .replace(/(^\w|\s\w)/g, c => c.toUpperCase())
            .replace(/Em Andamento/i, 'Em Andamento');

        this.dataStatus = rawStatus.map(i => ({
          ...i,
          name: formatName(i.name),
          percent: total > 0 ? ((i.value / total) * 100).toFixed(1) : '0'
        }));

        this.prorrogadasMes = data.prorrogadasMes ?? 0;
        this.concluidas = data.concluidas ?? 0;
        this.pendentes = data.pendentes ?? 0;
        this.atrasadas = data.atrasadas ?? 0;
        this.paralisadas = data.paralisadas ?? 0;
        this.proximasVencimento = data.proximasVencimento ?? 0;

        this.isLoading = false;
        this.cdr.detectChanges();

        setTimeout(() => {
          this.renderProjetos();
          this.renderSetores();
          this.renderPie();
        }, 50);
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  renderProjetos() {
    if (!this.chartProjetos) return;
    this.chartProj = echarts.init(this.chartProjetos.nativeElement);
    this.chartProj.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} Tarefas' },
      grid: { top: 10, bottom: 10, left: 60, right: 20 },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: this.dataProjetos.map(i => this.trimLabel(i.name, 12)) },
      series: [{
        type: 'bar',
        data: this.dataProjetos.map(i => ({ name: i.name, value: i.value })),
        itemStyle: { borderRadius: [0, 6, 6, 0], color: '#2563eb' },
        barWidth: 28,
        barCategoryGap: '20%'
      }]
    });
  }

  renderSetores() {
    if (!this.chartSetores) return;
    this.chartSet = echarts.init(this.chartSetores.nativeElement);
    this.chartSet.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} Tarefas' },
      grid: { top: 10, bottom: 10, left: 60, right: 20 },
      xAxis: { type: 'value' },
      yAxis: { type: 'category', data: this.dataSetores.map(i => this.trimLabel(i.name, 10)) },
      series: [{
        type: 'bar',
        data: this.dataSetores.map(i => ({ name: i.name, value: i.value })),
        itemStyle: { borderRadius: [0, 6, 6, 0], color: '#7c3aed' },
        barWidth: 28,
        barCategoryGap: '20%'
      }]
    });
  }

  renderPie() {
    if (!this.chartPie) return;

    const total = this.dataStatus.reduce((sum, i) => sum + i.value, 0);

    this.dataStatus.forEach(i => {
      i.percent = total > 0 ? ((i.value / total) * 100).toFixed(1) : '0';
    });

    const dataForChart = this.dataStatus.map(i => ({
      name: i.name,
      value: i.value,
      itemStyle: { color: i.color }
    }));

    this.chartPieInst = echarts.init(this.chartPie.nativeElement);
    this.chartPieInst.setOption({
      tooltip: { trigger: 'item', formatter: '{b}: {c} Tarefas ({d}%)' },
      series: [{
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        label: { show: true, position: 'inside', formatter: '{c}' },
        data: dataForChart
      }]
    });
  }
}
