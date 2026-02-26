import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

declare var lucide: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit {
  stats: any = {
    totalUsers: 0,
    totalJobs: 0,
    totalApplicants: 0
  };
  loading = true;

  constructor(
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.fetchStats();
  }

  ngAfterViewInit() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
  }

  fetchStats() {
    this.adminService.getDashboardStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        // Small delay to ensure DOM is ready for chart
        setTimeout(() => this.initChart(data.chartData), 100);
      },
      error: (err) => {
        console.error('Error fetching dashboard stats:', err);
        this.loading = false;
      }
    });
  }

  initChart(chartData: any) {
    if (!chartData) return;

    const options = {
      series: chartData.series,
      chart: {
        type: 'area',
        height: 380,
        toolbar: {
          show: false
        },
        fontFamily: 'Inter, sans-serif',
        zoom: {
          enabled: false
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800
        }
      },
      colors: ['#4f46e5', '#10b981', 'red'], // Indigo, Emerald, Red
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'smooth',
        width: 2.5
      },
      fill: {
        type: 'gradient',
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.15,
          opacityTo: 0.02,
          stops: [0, 90, 100]
        }
      },
      xaxis: {
        categories: chartData.months,
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px',
            fontWeight: 500
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: '#64748b',
            fontSize: '11px',
            fontWeight: 500
          },
          formatter: (val: any) => val.toFixed(0)
        }
      },
      grid: {
        borderColor: '#f1f5f9',
        strokeDashArray: 3,
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 10
        }
      },
      markers: {
        size: 0,
        strokeWidth: 2,
        hover: {
          size: 5,
          strokeWidth: 2
        }
      },
      legend: {
        show: false
      },
      tooltip: {
        theme: 'light',
        shared: true,
        intersect: false,
        y: {
          formatter: (val: any) => val + " candidates"
        }
      }
    };

    const container = document.querySelector("#applicationChart");
    if (container) {
      container.innerHTML = ''; // Clear previous chart if any
      const chart = new (window as any).ApexCharts(container, options);
      chart.render();
    }
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
