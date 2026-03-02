import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

export const BOOKING_STATUS_OPTIONS = [
  { value: '', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'confirmed', label: 'Confirmed' },
  { value: 'completed', label: 'Completed' },
  { value: 'cancelled', label: 'Cancelled' },
];

@Component({
  selector: 'app-bookings-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './bookings-filters.component.html',
})
export class BookingsFiltersComponent {
  readonly statusOptions = BOOKING_STATUS_OPTIONS;

  @Input() selectedStatus = '';
  @Input() selectedSort = '-dateOfService';

  @Output() statusChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onStatusChange(value: string): void {
    this.statusChange.emit(value);
  }

  onSortChange(value: string): void {
    this.sortChange.emit(value);
  }
}
