import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';


import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',


})
export class LoginComponent {
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) { }
  name = new FormControl('');
  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],

    });

  }

  onSubmit() {
    // Handle login logic here, e.g., call a service to authenticate user
    this.authService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe(data => {
      if (data) {
        console.log("login success", data);
        this.router.navigate(['/dashboard']);
      }
      else {
        // this.router.navigate(['/login'])
        console.log("login failed", data);
      }
    })

  }
}
