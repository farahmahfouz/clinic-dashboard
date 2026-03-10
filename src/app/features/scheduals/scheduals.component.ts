import { Component } from '@angular/core';
import { TableColumn, TableComponent } from "../../shared/components/table/table.component";
import { DoctorSchedualService } from '../../core/services/doctor-schedual.service';
import { map, Observable } from 'rxjs';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { OperationIconComponent } from '../../shared/icons/operation-icon.component';
import { AsyncPipe, DatePipe, NgFor } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { ScheduleFormComponent } from './schedule-form/schedule-form.component';
import { SchedualsFiltersComponent } from './scheduals-filters/scheduals-filters.component';

@Component({
  selector: 'app-scheduals',
  standalone: true,
  imports: [TableComponent, ModalComponent, OperationIconComponent, DatePipe, AsyncPipe, NgFor, ButtonComponent, ScheduleFormComponent, SchedualsFiltersComponent],
  templateUrl: './scheduals.component.html',
  styleUrl: './scheduals.component.css'
})
export class SchedualsComponent {
  schedules$!: Observable<any[]>;

  // filters
  searchValue = '';
  selectedSort = '-createdAt';

  // table menu
  openIndex: number | null = null;

  // modal
  isModalOpen = false;
  isEditMode = false;
  selectedSchedule: any = null;

  isDeleteOpen = false;
  scheduleToDelete: any = null;

  columns: TableColumn[] = [
    { label: 'Doctor', field: 'doctor' },
    { label: 'Days Off', field: 'daysOff' },
    { label: 'Availability', field: 'availability' },
    { label: 'Active', field: 'isActive' },
    { label: 'Created At', field: 'createdAt' },
  ];

  constructor(private schedulesService: DoctorSchedualService) {}

  ngOnInit() {
    this.loadSchedules();
  }

  loadSchedules() {
    this.schedules$ = this.schedulesService
      .getSchedules({
        search: this.searchValue || undefined,
        sort: this.selectedSort || undefined,
      })
      .pipe(map(res => res.data?.schedules ?? []));
  }

  toggleMenu(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }

  // --------- Search ---------
  searchSchedules(value: string) {
    this.searchValue = value;
    this.loadSchedules();
  }

  // --------- Sort ---------
  sortSchedules(value: string) {
    this.selectedSort = value;
    this.loadSchedules();
  }

  // --------- Add ---------
  openAdd() {
    this.isEditMode = false;
    this.selectedSchedule = null;
    this.isModalOpen = true;
  }

  // --------- Edit ---------
  openEdit(schedule: any) {
    this.isEditMode = true;
    this.selectedSchedule = schedule;
    this.isModalOpen = true;
    this.openIndex = null;
  }

  // --------- Delete ---------
  openDelete(schedule: any) {
    this.scheduleToDelete = schedule;
    this.isDeleteOpen = true;
    this.openIndex = null;
  }

  confirmDelete() {
    if (!this.scheduleToDelete) return;

    this.schedulesService.deleteSchedule(this.scheduleToDelete._id)
      .subscribe(() => {
        this.loadSchedules();
        this.isDeleteOpen = false;
      });
  }

  closeModal() {
    this.isModalOpen = false;
  }

  handleSubmit(data: any) {
    if (this.isEditMode) {
      this.schedulesService.updateSchedule(this.selectedSchedule._id, data)
        .subscribe(() => {
          this.loadSchedules();
          this.closeModal();
        });
    } else {
      this.schedulesService.addSchedule(data)
        .subscribe(() => {
          this.loadSchedules();
          this.closeModal();
        });
    }
  }
}
