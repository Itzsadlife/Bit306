import { Component} from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent{
  public errorMessage: string = '';
  constructor(private authService: AuthService, private router: Router) {}
  

  loginValidation(form: NgForm) {
    if (form.invalid) {
      return;
    }
  
    const email = form.value.email;
    const password = form.value.password;
  
    this.authService.userLogin(email, password).subscribe(
      response => {
        this.router.navigate(['']);
      },
      error => {
        if (error.status === 401) {
          // Try to authenticate as a merchant
          this.authService.merchantLogin(email, password).subscribe(
            merchantResponse => {
              this.router.navigate(['/home']);
            },
            merchantError => {
              if (merchantError.status === 401) {
                this.errorMessage = merchantError.error.message;
              } else {
                this.errorMessage = 'An unexpected error occurred.';
              }
            }
          );
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
      }
    );
    }   
}
