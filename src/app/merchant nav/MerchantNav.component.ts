import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'merchant-navbar',
  templateUrl: './MerchantNav.component.html',
  styleUrls: ['./MerchantNav.component.css']
})
export class MerchantNavBar implements OnInit {
  isUser: boolean = false;
  isMerchant: boolean = false;
  isGuest: boolean = true; // Default to guest until we know otherwise


  constructor(private authService:AuthService) {
    }
 ngOnInit(): void {
    this.authService.getUserType().subscribe(userType => {
      // Update the flags based on the userType
      this.isUser = userType === 'user';
      this.isMerchant = userType === 'merchant';
      // If userType is neither 'user' nor 'merchant', default to 'guest'
      this.isGuest = !this.isUser && !this.isMerchant;

      console.log(`Current user type: ${userType}`);
    });
  }

  onLogout(){
    this.authService.logout();
  }

}
