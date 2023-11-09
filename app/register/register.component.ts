import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MerchantService } from '../register.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomerService } from '../customer.service';

@Component({
  selector: 'register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  selectedRole: string = 'merchant'; // default role
  
  constructor(
    public merchantService: MerchantService,
    private snackBar: MatSnackBar,
    public customerService: CustomerService,
  ) {}

  onRoleChange(event: any) {
    this.selectedRole = event.target.value;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
        return;
    }

    if (this.selectedRole === 'merchant') {
        this.merchantService.addMerchant(
            form.value.firstName, 
            form.value.lastName,
            form.value.email,
            form.value.contactNumber,
            form.value.description,
            form.value.password,
            form.value.isFirstLogin,
        ).subscribe(
            response => {
                console.log("Server Response:", response);
                this.snackBar.open('Registration Successful!', 'Close', {
                    duration: 2000,
                    horizontalPosition: 'right',
                    verticalPosition: 'top',
                }).afterDismissed().subscribe(() => {
                    this.snackBar.open('Please wait for officer to approve your registration.', 'Close', {
                        duration: 3000,
                        horizontalPosition: 'right',
                        verticalPosition: 'top',
                    });
                });
                        form.resetForm();
            },
            error => {
                 let errorMessage = 'Registration Failed! Please try again.';
                if (error.status === 401 && error.error.message) {
                    errorMessage = error.error.message;
                }
                else if (error.status == 500 && error.error.message) {
                    errorMessage = error.error.message;
                }
             this.snackBar.open(errorMessage, 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
            }
        );
    } else {this.customerService.addCustomer(
        form.value.firstName, 
        form.value.lastName,
        form.value.email,
        form.value.contactNumber,
        form.value.password
    ).subscribe(
        response => {
            this.snackBar.open('Registration Successful!', 'Close', {
                duration: 2000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        },
        error => {
            console.error('Error occurred:', error);
            this.snackBar.open('Registration Failed! Please try again.', 'Close', {
                duration: 3000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
            });
        }
    );
    
    }
}
  }