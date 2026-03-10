import { Component, OnInit } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { Booking, BookingsService } from '../../core/services/bookings.service';
import { OperationIconComponent } from '../../shared/icons/operation-icon.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ClickOutSideDirective } from '../../shared/directives/click-out-side.directive';
import { BookingsFiltersComponent } from './bookings-filters/bookings-filters.component';
import { PaginationComponent } from '../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [
    DatePipe,
    NgClass,
    BookingsFiltersComponent,
    TableComponent,
    OperationIconComponent,
    ModalComponent,
    ButtonComponent,
    ClickOutSideDirective,
    PaginationComponent,
  ],
  templateUrl: './bookings.component.html',
  styleUrl: './bookings.component.css'
})
export class BookingsComponent implements OnInit {
  bookings: Booking[] = [];
  selectedStatus = '';
  selectedSort = '-dateOfService';
  openIndex: number | null = null;
  isCancelModalOpen = false;
  bookingToCancel: Booking | null = null;

  page = 1;
  limit = 6;
  total = 0 ;

  columns: TableColumn[] = [
    { label: 'Patient', field: 'user' },
    { label: 'Phone', field: 'phone' },
    { label: 'Doctor', field: 'doctor' },
    { label: 'Date', field: 'dateOfService' },
    { label: 'Time', field: 'timeSlot' },
    { label: 'Total', field: 'totalPrice' },
    { label: 'Status', field: 'status' },
  ];

  constructor(
    private bookingsService: BookingsService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {    
    this.route.queryParamMap.subscribe((params) => {
      this.selectedStatus = params.get('status') ?? '';
      this.selectedSort = params.get('sort') ?? '-dateOfService';
      this.page = Number(params.get('page')) || 1;
      this.limit = Number(params.get('limit')) || 6;
      this.loadBookings();
    });
  }

  loadBookings(): void {
    this.bookingsService
      .getAllBookings({
        status: this.selectedStatus || undefined,
        sort: this.selectedSort,
        page: this.page,
        limit: this.limit,
      })
      .subscribe({
        next: (res) => {
          this.bookings = res.bookings;
          this.total = res.total;
        },
        error: () => {
          this.bookings = [];
          this.total = 0;
        },
      });
  }

  onFilterChange(status: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { status: status || null },
      queryParamsHandling: 'merge',
    });
  }

  onSortChange(sort: string): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort: sort || null },
      queryParamsHandling: 'merge',
    });
  }

  changePage(page: number) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  toggleMenu(index: number): void {
    this.openIndex = this.openIndex === index ? null : index;
  }

  setStatus(booking: Booking, status: 'completed' | 'confirmed'): void {
    this.openIndex = null;
    this.bookingsService.updateBooking(booking._id, { status }).subscribe({
      next: () => this.loadBookings(),
    });
  }

  openCancelModal(booking: Booking): void {
    this.openIndex = null;
    this.bookingToCancel = booking;
    this.isCancelModalOpen = true;
  }

  closeCancelModal(): void {
    this.isCancelModalOpen = false;
    this.bookingToCancel = null;
  }

  confirmCancel(): void {
    if (!this.bookingToCancel) return;
    this.bookingsService.cancelBooking(this.bookingToCancel._id).subscribe({
      next: () => {
        this.closeCancelModal();
        this.loadBookings();
      },
    });
  }
}
