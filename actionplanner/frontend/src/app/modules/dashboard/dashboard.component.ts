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
  tempoMedio: number | null = null;

  // Paleta de cores baseada em #C51736
  private readonly COLORS = {
    primary: '#C51736',
    primaryLight: '#E63958',
    primaryDark: '#9E1229',
    secondary: '#8b5cf6',
    secondaryLight: '#a78bfa',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#C51736',
    info: '#3b82f6',
    neutral: '#6b7280',
    gradients: {
      primary: ['#C51736', '#E63958', '#9E1229'],
      secondary: ['#8b5cf6', '#a78bfa', '#c4b5fd'],
      multi: ['#C51736', '#E63958', '#f59e0b', '#8b5cf6', '#3b82f6', '#10b981', '#6b7280']
    }
  };

  ngOnInit() {
    this.loadDashboard();
  }

  ngOnDestroy() {
    if (this.chartProj) this.chartProj.dispose();
    if (this.chartSet) this.chartSet.dispose();
    if (this.chartPieInst) this.chartPieInst.dispose();
    if (this.sub) this.sub.unsubscribe();
  }

  private trimLabel(t: string, max: number): string {
    return t.length > max ? t.substring(0, max) + '…' : t;
  }

  loadDashboard() {
    this.sub = this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dataProjetos = (data.distribuicaoProjetos ?? [])
          .map(x => ({ name: x.name, value: x.count }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8); // Top 8 projetos

        this.dataSetores = (data.distribuicaoSetores ?? [])
          .map(x => ({ name: x.name, value: x.count }))
          .sort((a, b) => b.value - a.value)
          .slice(0, 8); // Top 8 setores

        const statusColorMap: Record<string, string> = {
          'CONCLUIDA': this.COLORS.success,
          'EM_ANDAMENTO': this.COLORS.info,
          'ABERTA': this.COLORS.secondary,
          'PENDENTE': this.COLORS.warning,
          'ATRASADA': this.COLORS.danger,
          'PARALISADA': this.COLORS.neutral,
          'CANCELADA': '#9ca3af'
        };

        const rawStatus = (data.distribuicaoStatus ?? []).map((x) => ({
          name: this.formatStatusName(x.label),
          value: x.count,
          color: statusColorMap[x.key] || this.COLORS.neutral,
          key: x.key
        }));

        const total = rawStatus.reduce((s, i) => s + i.value, 0);

        this.dataStatus = rawStatus.map(i => ({
          ...i,
          percent: total > 0 ? ((i.value / total) * 100).toFixed(1) : '0'
        }));

        this.prorrogadasMes = data.prorrogadasMes ?? 0;
        this.concluidas = data.concluidas ?? 0;
        this.pendentes = data.pendentes ?? 0;
        this.atrasadas = data.atrasadas ?? 0;
        this.paralisadas = data.paralisadas ?? 0;
        this.proximasVencimento = data.proximasVencimento ?? 0;
        this.tempoMedio = data.tempoMedio;

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

  private formatStatusName(status: string): string {
    return status
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(/(^\w|\s\w)/g, c => c.toUpperCase())
      .replace(/Em Andamento/i, 'Em Andamento');
  }

  renderProjetos() {
    if (!this.chartProjetos) return;
    
    this.chartProj = echarts.init(this.chartProjetos.nativeElement);
    
    const gradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: this.COLORS.primary },
      { offset: 1, color: this.COLORS.primaryLight }
    ]);

    this.chartProj.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: <strong>{c}</strong> tarefas',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 13 }
      },
      grid: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#f3f4f6', type: 'dashed' }
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'category',
        data: this.dataProjetos.map(i => this.trimLabel(i.name, 18)),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#374151',
          fontSize: 13,
          fontWeight: 500
        }
      },
      series: [{
        type: 'bar',
        data: this.dataProjetos.map(i => ({
          name: i.name,
          value: i.value,
          itemStyle: {
            borderRadius: [0, 8, 8, 0],
            color: gradient
          }
        })),
        barWidth: 24,
        barCategoryGap: '30%',
        label: {
          show: true,
          position: 'right',
          color: '#374151',
          fontWeight: 600,
          fontSize: 12,
          formatter: '{c}'
        }
      }]
    });
  }

  renderSetores() {
    if (!this.chartSetores) return;
    
    this.chartSet = echarts.init(this.chartSetores.nativeElement);
    
    const gradient = new echarts.graphic.LinearGradient(0, 0, 1, 0, [
      { offset: 0, color: this.COLORS.secondary },
      { offset: 1, color: this.COLORS.secondaryLight }
    ]);

    this.chartSet.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: '{b}: <strong>{c}</strong> tarefas',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 13 }
      },
      grid: {
        top: 20,
        bottom: 20,
        left: 20,
        right: 20,
        containLabel: true
      },
      xAxis: {
        type: 'value',
        axisLine: { show: false },
        axisTick: { show: false },
        splitLine: {
          lineStyle: { color: '#f3f4f6', type: 'dashed' }
        },
        axisLabel: {
          color: '#9ca3af',
          fontSize: 12
        }
      },
      yAxis: {
        type: 'category',
        data: this.dataSetores.map(i => this.trimLabel(i.name, 18)),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          color: '#374151',
          fontSize: 13,
          fontWeight: 500
        }
      },
      series: [{
        type: 'bar',
        data: this.dataSetores.map(i => ({
          name: i.name,
          value: i.value,
          itemStyle: {
            borderRadius: [0, 8, 8, 0],
            color: gradient
          }
        })),
        barWidth: 24,
        barCategoryGap: '30%',
        label: {
          show: true,
          position: 'right',
          color: '#374151',
          fontWeight: 600,
          fontSize: 12,
          formatter: '{c}'
        }
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
      itemStyle: { 
        color: i.color,
        borderWidth: 3,
        borderColor: '#fff'
      }
    }));

    this.chartPieInst = echarts.init(this.chartPie.nativeElement);
    this.chartPieInst.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '<strong>{b}</strong><br/>{c} tarefas ({d}%)',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'transparent',
        textStyle: { color: '#fff', fontSize: 13 }
      },
      series: [{
        type: 'pie',
        radius: ['45%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 8
        },
        label: {
          show: true,
          position: 'inside',
          formatter: '{c}',
          fontSize: 14,
          fontWeight: 700,
          color: '#fff'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 800
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: dataForChart
      }]
    });
  }
}