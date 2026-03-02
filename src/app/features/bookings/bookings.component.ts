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
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.selectedStatus = params.get('status') ?? '';
      this.selectedSort = params.get('sort') ?? '-dateOfService';
      this.loadBookings();
    });
  }

  loadBookings(): void {
    this.bookingsService
      .getAllBookings({
        status: this.selectedStatus || undefined,
        sort: this.selectedSort,
      })
      .subscribe({
        next: (list) => (this.bookings = list),
        error: () => (this.bookings = []),
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
