import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-schedule-form',
  standalone: true,
  imports: [FormsModule, NgFor, ReactiveFormsModule],
  templateUrl: './schedule-form.component.html'
})
export class ScheduleFormComponent implements OnInit {

  @Input() initialData: any = null;
  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      doctor: ['', Validators.required],
      daysOff: [[]],
      availability: this.fb.array([])
    });

    if (this.initialData) {
      this.patchForm();
    }
  }

  get availability(): FormArray {
    return this.form.get('availability') as FormArray;
  }

  createDayGroup(day: string = ''): FormGroup {
    return this.fb.group({
      day: [day, Validators.required],
      slots: this.fb.array([])
    });
  }

  createSlotGroup(): FormGroup {
    return this.fb.group({
      start: ['', Validators.required],
      end: ['', Validators.required]
    });
  }

  isDayOffSelected(day: string): boolean {
    const daysOff = this.form.get('daysOff')?.value || [];
    return daysOff.includes(day);
  }

  toggleDayOff(day: string) {
    const daysOff = this.form.get('daysOff')?.value || [];

    if (daysOff.includes(day)) {
      this.form.patchValue({
        daysOff: daysOff.filter((d: string) => d !== day)
      });
    } else {
      this.form.patchValue({
        daysOff: [...daysOff, day]
      });
    }
  }

  addDay() {
    this.availability.push(this.createDayGroup());
  }

  removeDay(index: number) {
    this.availability.removeAt(index);
  }

  getSlots(dayIndex: number) {
    return (this.availability.at(dayIndex).get('slots') as any).controls;
  }

  addSlot(dayIndex: number) {
    const slots = this.availability.at(dayIndex).get('slots') as FormArray;
    slots.push(this.createSlotGroup());
  }

  removeSlot(dayIndex: number, slotIndex: number) {
    const slots = this.availability.at(dayIndex).get('slots') as FormArray;
    slots.removeAt(slotIndex);
  }

  patchForm() {
    this.form.patchValue({
      doctor: this.initialData.doctor?._id,
      daysOff: this.initialData.daysOff
    });

    this.initialData.availability.forEach((day: any) => {
      const dayGroup = this.createDayGroup(day.day);
      const slotsArray = dayGroup.get('slots') as FormArray;

      day.slots.forEach((slot: any) => {
        slotsArray.push(this.fb.group({
          start: slot.start,
          end: slot.end
        }));
      });

      this.availability.push(dayGroup);
    });
  }

  onSubmit() {
    if (this.form.invalid) return;
    this.submitForm.emit(this.form.value);
  }
}