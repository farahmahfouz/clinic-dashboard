import { Component, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { ServicesService } from '../../core/services/services.service';
import { TableComponent } from "../../shared/components/table/table.component";
import { OperationIconComponent } from '../../shared/icons/operation-icon.component';
import { ButtonComponent } from "../../shared/components/button/button.component";
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { ClickOutSideDirective } from '../../shared/directives/click-out-side.directive';
import { ServiceFormComponent } from './service-form/service-form.component';
import { ServicesFiltersComponent } from './services-filters/services-filters.component';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from '../../core/services/toast.service';

export interface Service {
  _id: string;
  coverImage: string;
  name: string;
  description: string;
  ratingsAverage: number;
  createdAt: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    ClickOutSideDirective,
    TableComponent,
    DatePipe,
    AsyncPipe,
    OperationIconComponent,
    ButtonComponent,
    ModalComponent,
    ServiceFormComponent,
    ServicesFiltersComponent
  ],
  templateUrl: './services.component.html',
  styleUrl: './services.component.css'
})
export class ServicesComponent implements OnInit {
  services$!: Observable<Service[]>;
  searchValue = '';
  selectedSort: string = 'ratingsAverage';

  isModalOpen = false;
  isEditMode = false;
  selectedService: any = null;

  openIndex: number | null = null;
  isDeleteOpen = false;
  serviceToDelete: Service | null = null;

  loading$!: Observable<boolean>;

  constructor(
    private serviceService: ServicesService,
    private route: ActivatedRoute,
    private router: Router,
    private loadingService: LoadingService,
    private toast: ToastService
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  openDelete(service: Service) {
    this.serviceToDelete = service;
    this.isDeleteOpen = true;
    this.openIndex = null;
  }

  toggleMenu(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  openAdd() {
    this.isEditMode = false;
    this.selectedService = null;
    this.isModalOpen = true;
  }

  openEdit(service: any) {
    this.isEditMode = true;
    this.selectedService = service;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSubmit(data: any) {
    if (this.isEditMode && this.selectedService) {
      this.serviceService.editService(data, this.selectedService._id).subscribe({
        next: () => {
          this.toast.showSuccess('Service edited successfully');
        },
        error: () => {
          this.toast.showError('Faild to edit service')
        }
      });
    } else {
      this.serviceService.addService(data).subscribe({
        next: () => {
          this.toast.showSuccess('Service added successfully');
        },
        error: () => {
          this.toast.showError('Faild to add service')
        }
      });
    }

    this.closeModal();
  }

  columns = [
    { label: 'Image', field: 'coverImage' },
    { label: 'Name', field: 'name' },
    { label: 'Rating', field: 'ratingsAverage' },
    { label: 'Created At', field: 'createdAt' },
  ];

  ngOnInit() {
    this.services$ = this.serviceService.services$;

    this.route.queryParams.subscribe(params => {
      this.selectedSort = params['sort'] || 'ratingsAverage';
      this.searchValue = params['search'] || '';
      this.serviceService.loadServices(this.selectedSort, this.searchValue).subscribe();
    });
  }

  searchServices(search: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search },
      queryParamsHandling: 'merge'
    })
  }

  sortRatings(sort: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort },
      queryParamsHandling: 'merge'
    })
  }

  confirmDelete() {
    if (!this.serviceToDelete) return;

    this.serviceService.deleteService(this.serviceToDelete._id)
      .subscribe(() => {
        this.toast.showSuccess('Service deleted successfully');
        this.isDeleteOpen = false;
        this.serviceToDelete = null;
        this.serviceService.loadServices(this.selectedSort, this.searchValue).subscribe();
      })
  }
}
