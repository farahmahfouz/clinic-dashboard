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

@Component({
  selector: 'app-sub-services',
  standalone: true,
  imports: [AsyncPipe, TableComponent, OperationIconComponent, DatePipe, ButtonComponent, ModalComponent, SubServicesFormComponent, ClickOutSideDirective],
  templateUrl: './sub-services.component.html',
  styleUrl: './sub-services.component.css'
})
export class SubServicesComponent implements OnInit {
  subServices$!: Observable<SubServices[]>;
  services$!: Observable<Service[]>;

  isEditMode = false;
  selectedSubService: any = null;
  isModalOpen = false;
  
  openIndex: number | null = null;
  isDeleteOpen = false;
  subServiceToDelete: SubServices | null = null

  columns = [
    { label: 'Name', field: 'name' },
    { label: 'Service', field: 'service' },
    { label: 'Created At', field: 'createdAt' },
  ];

  constructor(private subServicesService: SubServicesService, private servicesService: ServicesService) { }

  ngOnInit(): void {
    this.subServices$ = this.subServicesService.subServices$;
    this.subServicesService.loadSubServices().subscribe();

    this.services$ = this.servicesService.services$;
    this.servicesService.loadServices().subscribe();
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
        this.isDeleteOpen = false;
        this.subServiceToDelete = null;
      });
  }

  handleSubmit(data: any) {
    if (this.isEditMode) {
      this.subServicesService.editSubService(data, this.selectedSubService._id).subscribe(() => {
        this.closeModal();
      });
    } else {
      this.subServicesService
        .addSubService(data)
        .subscribe(() => this.closeModal());
    }
  }

}
