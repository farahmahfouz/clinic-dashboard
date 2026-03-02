import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '../../../shared/components/button/button.component';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './service-form.component.html'
})
export class ServiceFormComponent {

  @Input() initialData: any;
  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;
  selectedFile!: File;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: [''],
      description: [''],
      coverImage: ['']
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['initialData'] && this.initialData) {
      this.form.patchValue({
        name: this.initialData.name,
        description: this.initialData.description
      });
    }

    if (!this.initialData) {
      this.form.reset();
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  submit() {
    const formData = new FormData();
    if(!formData) return;

    formData.append('name', this.form.value.name);
    formData.append('description', this.form.value.description)

    if (this.selectedFile) {
      formData.append('coverImage', this.selectedFile);
    }

    this.submitForm.emit(formData);
  }
}