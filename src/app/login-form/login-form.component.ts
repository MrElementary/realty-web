import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../services/AuthService.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {
  loginForm: FormGroup;
  isLoginMode = true;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginFormComponent>,
    private authService: AuthService,
    private toastrService: ToastrService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      if (this.isLoginMode) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find((user: any) => user.username === username && user.password === password);

        if (user) {
          this.authService.setUsername(username);
          this.toastrService.success(`User logged in: ${username}`);
        } else {
          this.toastrService.warning('Invalid username or password');
        }
      } else {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        this.toastrService.success(`User registered: ${username}`);
      }

      this.dialogRef.close(this.loginForm.value);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }

  switchMode() {
    this.isLoginMode = !this.isLoginMode;
  }
}