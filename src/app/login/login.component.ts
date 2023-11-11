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

  // Try logging in (the server decides the role)
  this.authService.login(email, password).subscribe(
    response => {
      // The server should return the role in the response if successful
      const role = response.role;
      switch (role) {
        case 'admin':
          this.router.navigate(['/review-register']);
          break;
        case 'merchant':
          this.router.navigate(['/home']);
          break;
        case 'user':
          this.router.navigate(['/home']);
          break;
        default:
          this.errorMessage = 'Login successful, but the role is unrecognized.';
      }
    },
    error => {
      // Now, set the error message based on the server's response
      if (error.status === 401) {
        // Handle different error messages here
        this.errorMessage = error.error.message;
      } else {
        // If there's an unexpected error, handle it here
        this.errorMessage = 'An unexpected error occurred. Please try again later.';
      }
    }
  );
}
}