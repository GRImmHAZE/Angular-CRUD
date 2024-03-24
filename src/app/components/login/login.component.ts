import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ApiServiceService } from 'src/app/shared/api-service.service';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiServiceService,
    private router: Router,
    private authService: AuthService,
    private _snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', Validators.required],
      remember: [''],
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) this.router.navigate(['dashboard']);
  }

  loginFormSubmit() {
    if (this.loginForm.valid) {
      let params: any = {
        username: this.loginForm.value.username,
        password: this.loginForm.value.password,
      };
      console.log('Login form submitted:', this.loginForm.value);
      this.apiService.login(params).pipe(catchError((error) => {
          console.log(error);
          this._snackBar.open('Invalid credentials', 'Ok', {
            duration: 3000,
            panelClass: ['snakbar-red'],
          });
          return of(null);
        })
      ).subscribe((res: any) => {
        if (res && res.token) {
          this.authService.logIn(res.token);
          if (this.loginForm.value.remember) {
            localStorage.setItem('token', res.token);
          } else {
            sessionStorage.setItem('token', res.token);
          }
          this.router.navigate(['dashboard']);
        }
      });
    } else {
      console.log('Form is invalid. Please check the fields.');
    }
  }

  getFormControl(controlName: string): FormControl | null {
    return this.loginForm.get(controlName) as FormControl | null;
  }
}
