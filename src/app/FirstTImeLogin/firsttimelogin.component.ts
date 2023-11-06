import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MerchantService } from '../register.service';

@Component({
  selector: 'FirstTimeLogin',
  templateUrl: './firsttimelogin.component.html',
  styleUrls: ['./firsttimelogin.component.css']
})
export class FirstTimeLoginComponent {
    newPassword: string = '';
    confirmPassword: string = '';

  constructor(private merchantService: MerchantService, public dialogRef: MatDialogRef<FirstTimeLoginComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  changePassword() {
    if (this.newPassword === this.confirmPassword && this.newPassword) {
      const merchantId = this.merchantService.currentMerchantId; 
      this.merchantService.changePassword(merchantId, this.newPassword).subscribe(success => {
        if (success) {
          this.dialogRef.close();
        } else {
          // Handle error
        }
      });
    } else {
      // Passwords do not match or are empty
    }
}

}
