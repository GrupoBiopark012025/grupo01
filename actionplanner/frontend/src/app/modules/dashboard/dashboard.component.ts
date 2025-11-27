import { Component, OnInit, OnDestroy, ElementRef, ViewChild, inject, ChangeDetectorRef } from '@angular/core'
import { CommonModule } from '@angular/common'
import { DashboardDataService } from '@data/dashboard/dashboard-data.service'
import Chart from 'chart.js/auto'

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, OnDestroy {
  dashboardService = inject(DashboardDataService)
  private cdr = inject(ChangeDetectorRef)

  @ViewChild('statusChart') statusChart?: ElementRef<HTMLCanvasElement>
  @ViewChild('projectChart') projectChart?: ElementRef<HTMLCanvasElement>
  @ViewChild('sectorChart') sectorChart?: ElementRef<HTMLCanvasElement>

  statusLegend: { id: string; label: string; color: string }[] = []
  dataStatus: any[] = []
  dataProjetos: any[] = []
  dataSetores: any[] = []

  statusChartInstance: Chart | null = null
  projectChartInstance: Chart | null = null
  sectorChartInstance: Chart | null = null

  sub: any
  isLoading = true

  trackById(_: number, item: { id: string }) {
    return item.id
  }

  ngOnInit() {
    this.loadDashboard()
  }

  loadDashboard() {
    this.isLoading = true
    
    this.sub = this.dashboardService.getDashboard().subscribe({
      next: (data) => {
        this.dataStatus = (data.distribuicaoStatus ?? []).map((x: any, i: number) => ({
          ...x,
          label: String(x.label).replace(/_/g, ' '),
          id: `status-${i}-${x.label ?? ''}`
        }))
        this.dataProjetos = data.distribuicaoProjetos ?? []
        this.dataSetores = data.distribuicaoSetores ?? []
        
        this.buildStatusLegend()
        this.isLoading = false
        
        this.cdr.detectChanges()
        
        setTimeout(() => this.renderCharts(), 100)
      },
      error: (err) => {
        this.isLoading = false
      }
    })
  }

  ngOnDestroy() {
    this.destroyCharts()
    if (this.sub) this.sub.unsubscribe()
  }

  destroyCharts() {
    if (this.statusChartInstance) {
      this.statusChartInstance.destroy()
      this.statusChartInstance = null
    }
    if (this.projectChartInstance) {
      this.projectChartInstance.destroy()
      this.projectChartInstance = null
    }
    if (this.sectorChartInstance) {
      this.sectorChartInstance.destroy()
      this.sectorChartInstance = null
    }
  }

  buildStatusLegend() {
    const labels = this.dataStatus.map(x => x.label)
    const colors = ['#0D47A1', '#42A5F5', '#BB1333', '#6A1B9A', '#AB47BC', '#EF5350', '#E57373']
    this.statusLegend = labels.map((l, i) => ({
      id: `legend-${i}-${l ?? ''}`,
      label: l,
      color: colors[i % colors.length]
    }))
  }

  renderCharts() {
    this.destroyCharts()

    if (this.dataStatus.length > 0 && this.statusChart?.nativeElement) {
      const canvas = this.statusChart.nativeElement
      const container = canvas.parentElement
      
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
      
      const labels = this.dataStatus.map(x => x.label)
      const values = this.dataStatus.map(x => x.count)
      const colors = this.statusLegend.map(x => x.color)
      
      try {
        this.statusChartInstance = new Chart(canvas, {
          type: 'doughnut',
          data: { labels, datasets: [{ data: values, backgroundColor: colors }] },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            cutout: '65%', 
            plugins: { legend: { display: false } } 
          }
        })
      } catch (err) {
      }
    }

    if (this.dataProjetos.length > 0 && this.projectChart?.nativeElement) {
      const canvas = this.projectChart.nativeElement
      const container = canvas.parentElement
      
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
      
      const labels = this.dataProjetos.map(x => x.name)
      const values = this.dataProjetos.map(x => x.count)
      
      try {
        this.projectChartInstance = new Chart(canvas, {
          type: 'bar',
          data: { labels, datasets: [{ label: '', data: values, backgroundColor: '#42A5F5' }] },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } }, 
            scales: { y: { beginAtZero: true } } 
          }
        })
      } catch (err) {
      }
    }

    if (this.dataSetores.length > 0 && this.sectorChart?.nativeElement) {
      const canvas = this.sectorChart.nativeElement
      const container = canvas.parentElement
      
      if (container) {
        canvas.width = container.clientWidth
        canvas.height = container.clientHeight
      }
      
      const labels = this.dataSetores.map(x => x.name)
      const values = this.dataSetores.map(x => x.count)
      
      try {
        this.sectorChartInstance = new Chart(canvas, {
          type: 'bar',
          data: { labels, datasets: [{ label: '', data: values, backgroundColor: '#6A1B9A' }] },
          options: { 
            responsive: true, 
            maintainAspectRatio: false, 
            plugins: { legend: { display: false } }, 
            scales: { y: { beginAtZero: true } } 
          }
        })
      } catch (err) {
      }
    }
  }
}