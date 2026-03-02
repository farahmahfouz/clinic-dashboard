import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Service } from '../../services/services.component';
import { ButtonComponent } from '../../../shared/components/button/button.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sub-services-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent, CommonModule],
  templateUrl: './sub-services-form.component.html',
  styleUrl: './sub-services-form.component.css'
})
export class SubServicesFormComponent implements OnInit, OnChanges {
  @Input() services: Service[] | null = [];
  @Input() subService: any = null;

  @Output() submitForm = new EventEmitter<any>();

  form!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      service: ['', Validators.required],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.subService && this.form) {
      this.form.patchValue({
        name: this.subService.name,
        service: this.subService.service?._id || this.subService.service
      });
    }

    if (!this.subService && this.form) {
      this.form.reset();
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.submitForm.emit(this.form.value);
  }
}
