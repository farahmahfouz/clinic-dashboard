import { Component, Input, TemplateRef, ViewEncapsulation } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

export interface TableColumn {
  label: string;
  field: string;
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [NgTemplateOutlet],
  templateUrl: './table.component.html',
  styleUrl: './table.component.css',
  encapsulation: ViewEncapsulation.None
})
export class TableComponent {
  @Input() data: any[] = [];
  @Input() columns: TableColumn[] = [];
  @Input() rowTemplate!: TemplateRef<any>;
  @Input() loading = false;
  @Input() skeletonRows = 5;

  get skeletonRowIndices(): number[] {
    return Array.from({ length: this.skeletonRows }, (_, i) => i);
  }
}

