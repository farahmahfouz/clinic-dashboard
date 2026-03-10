import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() limit = 6;
  @Input() total = 100;

  @Output() pageChange = new EventEmitter<number>();

  get start() {
    return (this.page - 1) * this.limit + 1;
  }

  get end() {
    return Math.min(this.page * this.limit, this.total);
  }

  nextPage() {
    this.page++;
    this.pageChange.emit(this.page);
  }

  prevPage() {
    this.page--;
    this.pageChange.emit(this.page);
  }
}
