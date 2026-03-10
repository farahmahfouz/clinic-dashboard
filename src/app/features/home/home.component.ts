import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartData,
  ChartOptions,
  ChartType,
  registerables,
} from 'chart.js';
import {
  Booking,
  BookingsService,
} from '../../core/services/bookings.service';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  // UI state
  isLoading = true;
  error: string | null = null;

  // Monthly bookings (current year)
  readonly monthLabels = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  monthlyChartType: ChartType = 'bar';
  monthlyChartData: ChartData<'bar'> = {
    labels: this.monthLabels,
    datasets: [
      {
        label: 'Number of bookings',
        data: Array(12).fill(0),
        backgroundColor: '#4f46e5',
        borderRadius: 8,
      },
    ],
  };

  monthlyChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'system-ui' },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => ` ${context.parsed.y} booking`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
        },
      },
    },
  };

  // Status distribution
  statusChartType: ChartType = 'doughnut';
  statusChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: ['#4f46e5', '#14b8a6', '#f59e0b', '#ef4444'],
      },
    ],
  };

  statusChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  totalBookings = 0;
  completedBookings = 0;
  cancelledBookings = 0;

  constructor(private bookingsService: BookingsService) { }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.bookingsService.getAllBookings({ sort: 'dateOfService' }).subscribe({
      next: (res) => {
        const bookings = res.bookings;
        this.buildMonthlyData(bookings);
        this.buildStatusData(bookings);
        this.buildSummary(bookings);
        this.isLoading = false;
      },
      error: () => {
        this.error = 'An error occurred while loading the data, please try again later.';
        this.isLoading = false;
      },
    });
  }

  private buildMonthlyData(bookings: Booking[]): void {
    const counts = Array(12).fill(0);
    const currentYear = new Date().getFullYear();

    bookings.forEach((b) => {
      const d = new Date(b.dateOfService || b.createdAt);
      if (!isNaN(d.getTime()) && d.getFullYear() === currentYear) {
        const monthIndex = d.getMonth();
        counts[monthIndex] = (counts[monthIndex] || 0) + 1;
      }
    });

    this.monthlyChartData = {
      ...this.monthlyChartData,
      datasets: [
        {
          ...(this.monthlyChartData.datasets[0] || {}),
          data: counts,
        },
      ],
    };
  }

  private buildStatusData(bookings: Booking[]): void {
    const statusCounts: Record<string, number> = {};

    bookings.forEach((b) => {
      const key = b.status || 'not defined';
      statusCounts[key] = (statusCounts[key] || 0) + 1;
    });

    const labels = Object.keys(statusCounts);
    const data = labels.map((l) => statusCounts[l]);

    this.statusChartData = {
      labels,
      datasets: [
        {
          ...(this.statusChartData.datasets[0] || {}),
          data,
        },
      ],
    };
  }

  private buildSummary(bookings: Booking[]): void {
    this.totalBookings = bookings.length;
    this.completedBookings = bookings.filter(
      (b) => b.status === 'completed'
    ).length;
    this.cancelledBookings = bookings.filter(
      (b) => b.status === 'cancelled'
    ).length;
  }
}
