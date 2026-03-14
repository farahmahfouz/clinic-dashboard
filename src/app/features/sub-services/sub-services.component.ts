import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { SubServices, SubServicesService } from '../../core/services/sub-services.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { TableComponent } from '../../shared/components/table/table.component';
import { OperationIconComponent } from '../../shared/icons/operation-icon.component';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { SubServicesFormComponent } from './sub-services-form/sub-services-form.component';
import { Service } from '../services/services.component';
import { ServicesService } from '../../core/services/services.service';
import { ClickOutSideDirective } from '../../shared/directives/click-out-side.directive';
import { SubServicesFiltersComponent } from './sub-services-filters/sub-services-filters.component';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '../../core/services/loading.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-sub-services',
  standalone: true,
  imports: [
    AsyncPipe,
    TableComponent,
    OperationIconComponent,
    DatePipe,
    ButtonComponent,
    ModalComponent,
    SubServicesFormComponent,
    ClickOutSideDirective,
    SubServicesFiltersComponent,
  ],
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css'
})
export class SubServicesComponent implements OnInit {
  subServices$!: Observable<SubServices[]>;
  services$!: Observable<Service[]>;

  searchValue = '';
  selectedSort: string = 'createdAt';

  isEditMode = false;
  selectedSubService: any = null;
  isModalOpen = false;

  openIndex: number | null = null;
  isDeleteOpen = false;
  subServiceToDelete: SubServices | null = null;

  loading$!: Observable<boolean>;

  columns = [
    { label: 'Name', field: 'name' },
    { label: 'Service', field: 'service' },
    { label: 'Created At', field: 'createdAt' },
  ];

  constructor(
    private subServicesService: SubServicesService,
    private servicesService: ServicesService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private toast: ToastService
  ) {
    this.loading$ = this.loadingService.loading$
  }

  ngOnInit(): void {
    this.subServices$ = this.subServicesService.subServices$;

    this.route.queryParams.subscribe(params => {
      this.selectedSort = params['sort'] || 'createdAt';
      this.searchValue = params['search'] || '';
      this.subServicesService.loadSubServices(this.selectedSort, this.searchValue).subscribe();
      this.servicesService.loadServices(this.selectedSort, this.searchValue).subscribe();
    });
  }

  openAdd() {
    this.isEditMode = false;
    this.selectedSubService = null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toggleMenu(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  openEdit(service: any) {
    this.isEditMode = true;
    this.selectedSubService = service;
    this.isModalOpen = true;
  }

  openDelete(subService: SubServices) {
    this.subServiceToDelete = subService;
    this.isDeleteOpen = true;
    this.openIndex = null;
  }

  confirmDelete() {
    if (!this.subServiceToDelete) return;

    this.subServicesService.deleteSubService(this.subServiceToDelete._id)
      .subscribe(() => {
        this.toast.showSuccess('Subservice deleted successfully')
        this.isDeleteOpen = false;
        this.subServiceToDelete = null;
      });
  }

  handleSubmit(data: any) {
    if (this.isEditMode) {
      this.subServicesService.editSubService(data, this.selectedSubService._id).subscribe(() => {
        this.toast.showSuccess('Subservice edited successfully')
        this.closeModal();
      });
    } else {
      this.subServicesService
        .addSubService(data)
        .subscribe(() => {
          this.toast.showSuccess('Subservice added successfully')
          this.closeModal()
        });
    }
  }

  searchSubServices(search: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search },
      queryParamsHandling: 'merge'
    })
  }

  sortSubServices(sort: string) {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { sort },
      queryParamsHandling: 'merge'
    })
  }
}
