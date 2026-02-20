import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

declare var lucide: any;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements AfterViewInit {
  constructor(private authService: AuthService, private router: Router) { }

  ngAfterViewInit() {
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }
    this.initChart();
  }

  initChart() {
    const options = {
      series: [{
        name: 'Applied',
        data: [31, 40, 28, 51, 42, 109, 100, 120, 80]
      }, {
        name: 'Hired',
        data: [11, 32, 45, 32, 34, 52, 41, 60, 45]
      }, {
        name: 'Rejected',
        data: [15, 11, 32, 18, 9, 24, 11, 20, 15]
      }],
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
      colors: ['#4f46e5', '#10b981', 'red'], // Indigo, Emerald, Slate
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
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
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

    const chart = new (window as any).ApexCharts(document.querySelector("#applicationChart"), options);
    chart.render();
  }

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}
