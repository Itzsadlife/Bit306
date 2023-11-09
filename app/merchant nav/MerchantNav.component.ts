import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'merchant-navbar',
  templateUrl: './MerchantNav.component.html',
  styleUrls: ['./MerchantNav.component.css']
})
export class MerchantNavBar implements OnInit {
  public isUser: boolean = false;
  public isMerchant: boolean = false;
  public isGuest: boolean = false;

  constructor(private authService:AuthService) {
    this.authService.isUserLoggedIn().subscribe(status=>{
      this.isUser = status;
    })
    this.authService.isMerchantLoggedIn().subscribe(status=>{
      this.isMerchant=status;
    })
    this.authService.isGuestModeActive().subscribe(status=>{
      this.isGuest = status;
    })
    }
  ngOnInit(): void {
    
  }

  onLogout(){
    this.authService.logout();
  }

}
