import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-services-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './services-filters.component.html',
  styleUrl: './services-filters.component.css'
})
export class ServicesFiltersComponent {
  @Input() searchValue = '';
  @Input() selectedSort: string = 'ratingsAverage';

  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSearchChange(value: string) {
    this.searchChange.emit(value);
  }

  onSortChange(value: string) {
    this.sortChange.emit(value);
  }
}

