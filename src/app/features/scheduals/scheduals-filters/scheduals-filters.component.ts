import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-scheduals-filters',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './scheduals-filters.component.html',
  styleUrl: './scheduals-filters.component.css'
})
export class SchedualsFiltersComponent {
  @Input() searchValue = '';
  @Input() selectedSort = '-createdAt';

  @Output() searchChange = new EventEmitter<string>();
  @Output() sortChange = new EventEmitter<string>();

  onSearchChange(value: string): void {
    this.searchChange.emit(value);
  }

  onSortChange(value: string): void {
    this.sortChange.emit(value);
  }
}
