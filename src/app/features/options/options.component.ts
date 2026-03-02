import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, Observable, take } from 'rxjs';
import { FilterComponent } from '../../shared/components/filter/filter.component';
import { TableComponent, TableColumn } from '../../shared/components/table/table.component';
import { SubServicesOptionsService, ServiceOption } from '../../core/services/sub-services-options.service';
import { SubServicesService, SubServices } from '../../core/services/sub-services.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-options',
  standalone: true,
  imports: [AsyncPipe, TableComponent],
  templateUrl: './options.component.html',
  styleUrl: './options.component.css'
})
export class OptionsComponent implements OnInit {
  options: ServiceOption[] = [];
  subServices$!: Observable<SubServices[]>;
  selectedSlug: string | null = null;

  columns: TableColumn[] = [
    { label: 'Name', field: 'name' },
    { label: 'Type', field: 'type' },
    { label: 'Price', field: 'price' },
    { label: 'Notes', field: 'note' },
  ];

  constructor(
    private optionsService: SubServicesOptionsService,
    private subServicesService: SubServicesService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subServices$ = this.subServicesService.subServices$;
  }

  ngOnInit(): void {
    this.subServicesService.loadSubServices().subscribe();

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      this.selectedSlug = slug;
      if (slug) {
        this.loadOptions(slug);
      } else {
        // Default slug: pick first sub-service once loaded
        this.options = [];
        this.subServices$
          .pipe(
            filter((list) => list.length > 0),
            take(1)
          )
          .subscribe((list) => {
            const defaultSlug = this.getSlug(list[0]);
            this.router.navigate(['/options', defaultSlug], { replaceUrl: true });
          });
      }
    });
  }

  loadOptions(slug: string): void {
    this.optionsService.getOptionsBySlug(slug).subscribe({
      next: (options) => (this.options = options),
      error: () => (this.options = []),
    });
  }

  getSlug(subService: SubServices): string {
    if (subService.slug) return subService.slug;
    return (subService.name ?? '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '') || subService._id;
  }

  onSubServiceChange(slug: string): void {
    if (!slug) {
      this.router.navigate(['/options']);
      this.options = [];
      return;
    }
    this.router.navigate(['/options', slug]);
  }
}
