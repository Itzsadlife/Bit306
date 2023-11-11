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
    selectedFile: File = null;
    documentInvalid: boolean = false;
  
    constructor(
        public merchantService: MerchantService,
        private snackBar: MatSnackBar,
        public customerService: CustomerService,
    ) { }

    onRoleChange(event: any) {
        this.selectedRole = event.target.value;
    }

    onFileSelected(event): void {
        if (event.target.files.length > 0) {
            this.selectedFile = <File>event.target.files[0];
            this.documentInvalid = false;
        } else {
            this.documentInvalid = true;
        }
    }
onSubmit(form: NgForm): void {
  if(this.selectedRole === 'merchant') {
    if (!this.selectedFile) {
      this.documentInvalid = true;
      return;
    }

    const formData = new FormData();
    formData.append('firstName', form.value.firstName);
    formData.append('lastName', form.value.lastName);
    formData.append('email', form.value.email);
    formData.append('contactNumber', form.value.contactNumber);
    formData.append('description', form.value.description);
    formData.append('password', form.value.password);
    //formData.append('isFirstLogin', form.value.isFirstLogin);
    formData.append('document', this.selectedFile, this.selectedFile.name);

    // Now call the modified service method with formData
    this.merchantService.addMerchant(formData).subscribe(
      // Handle the response
      response => {
        console.log("Server Response:", response);
        this.snackBar.open('Registration Successful!', 'Close', {
            duration: 2000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
        // Reset the form on successful registration
            form.resetForm();
            this.selectedFile = null;
      },
      error => {
        // Handle errors here
        console.error('Error occurred:', error);
        this.snackBar.open('Registration Failed! Please try again.', 'Close', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
        });
      }
    );
            } else { // This else block handles customer registration
                this.customerService.addCustomer(
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
                        form.resetForm(); // Reset the form on successful registration
                    },
                    error => {
                        let errorMessage = 'Registration Failed! Please try again.';
                        // Check for specific error messages based on the status code
                        if (error.status === 401 && error.error.message) {
                            errorMessage = error.error.message;
                        }
                        else if (error.status === 409 && error.error.message) {
                            errorMessage = error.error.message;
                        }
                        else if (error.status === 500 && error.error.message) {
                            errorMessage = 'Internal Server Error during registration!';
                        }
                        console.error('Error occurred:', error);
                        this.snackBar.open(errorMessage, 'Close', {
                            duration: 3000,
                            horizontalPosition: 'right',
                            verticalPosition: 'top',
                        });
                    }
                );

            }
        }
    }