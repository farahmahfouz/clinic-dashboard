import { Component } from '@angular/core';
import { EyeIconComponent } from "../../shared/icons/eye-icon.component";
import { EyeLashIconComponent } from "../../shared/icons/eye-lash-icon.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { UsersService } from '../../core/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [EyeIconComponent, EyeLashIconComponent, ReactiveFormsModule, NgIf],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {
  showPassword = false;
  isLoading = false;
  apiError: string | null = null;

  constructor(private userService: UsersService, private router: Router) { }

  togglePassword() {
    this.showPassword = !this.showPassword
  }

  form = new FormGroup({
    email: new FormControl('admin@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('test12345', [Validators.required, Validators.minLength(8)]),
  })

  get emailErrors() {
    const control = this.form.controls.email;
    return (control.touched || control.dirty || control.errors?.['server']) ? control.errors : null;
  }

  get passwordErrors() {
    const control = this.form.controls.password;
    return (control.touched || control.dirty || control.errors?.['server']) ? control.errors : null;
  }

  onSubmit() {
    if (this.form.invalid) return;

    this.isLoading = true;
    this.apiError = null;
    this.userService.login(this.form.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard'], { replaceUrl: true })
      },
      error: (err) => {
        this.isLoading = false;
        const message = err?.error?.message || 'Something went wrong';

        // Map backend error to the correct form control
        if (typeof message === 'string') {
          const lower = message.toLowerCase();
          if (lower.includes('email')) {
            this.form.controls.email.setErrors({ server: message });
          } else {
            this.apiError = message;
          }
        } else {
          // fallback if message is object or array
          this.apiError = JSON.stringify(message);
        }
      }
    })

  }
}
