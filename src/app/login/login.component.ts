import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  public errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) { }
  

  loginValidation(form: NgForm) {
    if (form.invalid) {
      return;
    }
  
    const email = form.value.email;
    const password = form.value.password;
      
    this.authService.userLogin(email, password).subscribe(
      response => {
        // If user login is successful, navigate to the user home page
        this.router.navigate(['/user-home']);
      },
      error => {
        if (error.status === 401) {
          // If user login fails, try to authenticate as a merchant
          this.authService.merchantLogin(email, password).subscribe(
            merchantResponse => {
              // If merchant login is successful, navigate to the merchant home page
              this.router.navigate(['/merchant-home']);
            },
            merchantError => {
              if (merchantError.status === 401) {
                // If merchant login fails, try to authenticate as an admin
                this.authService.adminLogin(email, password).subscribe(
                  adminResponse => {
                    // If admin login is successful, navigate to the admin review page
                    this.router.navigate(['/review-register']);
                  },
                  adminError => {
                    if (adminError.status === 401) {
                      // If admin login also fails, show an error message
                      this.errorMessage = 'Login failed for all roles. Please check your credentials.';
                    } else {
                      this.errorMessage = 'An unexpected error occurred during admin login.';
                    }
                  }
                );
              } else {
                this.errorMessage = 'An unexpected error occurred during merchant login.';
              }
            }
          );
        } else {
          this.errorMessage = 'An unexpected error occurred during user login.';
        }
      }
    );
  }
}