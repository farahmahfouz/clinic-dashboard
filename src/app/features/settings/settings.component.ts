import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ControlComponent } from '../../shared/components/control/control.component';
import { BookingsService } from '../../core/services/bookings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [ReactiveFormsModule, ControlComponent],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  clinicForm!: FormGroup; 

  clinicId!: string;
  originalData!: any;

  constructor(
    private fb: FormBuilder,
    private bookingsService: BookingsService
  ) {
    this.clinicForm = this.fb.group({
      clinicName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],

      location: this.fb.group({
        address: ['', Validators.required],
        googleMapLink: ['', Validators.required],
      }),

      workingHours: this.fb.group({
        open: ['', Validators.required],
        close: ['', Validators.required],
      }),

      social: this.fb.group({
        facebook: [''],
        instagram: [''],
        tiktok: [''],
        whatsapp: [''],
      }),

      coverImage: [null],
      logo: [null],
    });
  }

  ngOnInit() {
    this.bookingsService.getSettings().subscribe(res => {
      const data = res[0];
  
      this.clinicId = data._id;
      this.originalData = data;
  
      this.clinicForm.patchValue({
        clinicName: data.clinicName,
        email: data.email,
        phone: data.phone,
  
        location: {
          address: data.location?.address,
          googleMapLink: data.location?.googleMapLink,
        },
  
        workingHours: {
          open: this.formatTime(data.workingHours?.open),
          close: this.formatTime(data.workingHours?.close),
        },
  
        social: {
          facebook: data.social?.facebook,
          instagram: data.social?.instagram,
          tiktok: data.social?.tiktok,
          whatsapp: data.social?.whatsapp,
        }
      });
    });
  }
  formatTime(time: string) {
    if (!time) return '';

    const [hourMin, period] = time.split(' ');
    let [hour, minute] = hourMin.split(':');

    if (period === 'PM' && hour !== '12') hour = (+hour + 12).toString();
    if (period === 'AM' && hour === '12') hour = '00';

    return `${hour.padStart(2, '0')}:${minute}`;
  }

  updateField(field: string) {
    const value = this.clinicForm.get(field)?.value;
    if (value === this.originalData[field]) return;

    this.bookingsService
      .updateSettings({ [field]: value }, this.clinicId)
      .subscribe(() => {
        this.originalData[field] = value;
      });
  }

  updateNestedField(group: string, field: string) {
    const value = this.clinicForm.get([group, field])?.value;

    if (value === this.originalData[group][field]) return;

    this.bookingsService
      .updateSettings(
        {
          [group]: {
            ...this.originalData[group],
            [field]: value
          }
        },
        this.clinicId
      )
      .subscribe(() => {
        this.originalData[group][field] = value;
      });
  }

  onFileSelect(event: any, controlName: string) {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(controlName, file);

    this.bookingsService
      .updateSettings(formData, this.clinicId)
      .subscribe();
  }
}
