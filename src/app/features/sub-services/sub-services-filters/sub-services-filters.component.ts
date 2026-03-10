import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sub-services-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sub-services-filters.component.html',
  styleUrl: './sub-services-filters.component.css'
})
export class SubServicesFiltersComponent {
  @Input() searchValue = '';
  @Input() selectedSort: string = 'createdAt';

  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSearchChange(value: string) {
    this.searchChange.emit(value);
  }

  onSortChange(value: string) {
    this.sortChange.emit(value);
  }
}
