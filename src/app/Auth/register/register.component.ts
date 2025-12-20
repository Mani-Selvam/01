import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      user_name: ['', [Validators.required, Validators.minLength(3)]],
      company_name: ['', [Validators.required, Validators.minLength(2)]],
      emailId: ['', [Validators.required, Validators.email]],
      mobile_no: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      gst_no: [''],
      user_type: ['Staff', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup): {[key: string]: any} | null {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { 'passwordMismatch': true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.errorMessage = 'Please fill all required fields correctly';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registrationData = {
      user_name: this.registerForm.value.user_name,
      company_name: this.registerForm.value.company_name,
      emailId: this.registerForm.value.emailId,
      mobile_no: this.registerForm.value.mobile_no,
      password: this.registerForm.value.password,
      gst_no: this.registerForm.value.gst_no,
      user_type: this.registerForm.value.user_type
    };

    this.authService.register(registrationData).subscribe(
      response => {
        this.isLoading = false;
        console.log('Registration result:', response);
        if (response && response.success) {
          this.successMessage = 'Registration successful! Redirecting to login...';
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.errorMessage = response?.error || 'Registration failed. Please try again.';
        }
      },
      error => {
        this.isLoading = false;
        console.error('Registration error:', error);
        const errorMsg = error?.error?.message || error?.error?.error || 'An error occurred during registration.';
        this.errorMessage = errorMsg;
      }
    );
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
