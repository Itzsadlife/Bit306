import { Component, OnInit } from "@angular/core";
import { Merchant } from '../register.model';
import { MerchantService } from '../register.service';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';



@Component({
    selector: "review-register",
    templateUrl: "./reviewRegister.component.html",
    styleUrls: ['./reviewRegister.component.css']
})
export class MerchantListComponent implements OnInit {
    merchants: Merchant[] = [];
    private baseUrl = 'http://localhost:3000/api'; 
    isReviewed: boolean;

    constructor(private sanitizer: DomSanitizer, public merchantService: MerchantService, private http: HttpClient, private HttpService: HttpService) {}

    ngOnInit() {
        this.merchantService.getMerchants().subscribe(data => {
            this.merchants = data;
        });
    }
    openDocument(documentPath: string) {
  if (documentPath) {
    // This is the full URL to the document
      const fullUrl = `http://localhost:3000/uploads/${documentPath}`;
    window.open(fullUrl, '_blank');
  }
}


    acceptMerchant(_id: string) {
        this.merchantService.updateStatus(_id, 'Accepted').subscribe(() => {

            const merchant = this.merchants.find(m => m._id === _id);
            if (merchant) {
                merchant.isReviewed = true;
            }                
            if (merchant && merchant.email) {
                this.HttpService.sendEmail("http://localhost:3000/api/review-register/accepted/sendmail", { email: merchant.email }).subscribe(
                    data => {
                        let res: any = data;
                        console.log("Email sent successfully!", res);
                    },
                    error => {
                        console.error("Failed to send acceptance email", error);
                    }
                );
            } else {
                console.error(`Could not find merchant with _id: ${_id} or merchant does not have an email.`);
            }
    
            this.refreshMerchants();
    
        }, error => {
            console.error("Failed to update merchant status", error);
        });
    }
    

    rejectMerchant(_id: string) {
        this.merchantService.updateStatus(_id, 'Rejected').subscribe(() => {
            const merchant = this.merchants.find(m => m._id == _id);
            if (merchant) {
                merchant.isReviewed = true;
            }           

            if(merchant && merchant.email){
                this.HttpService.sendEmail("http://localhost:3000/api/review-request/rejected/sendmail",{email: merchant.email}).subscribe(
                    data =>{
                        let res: any=data;
                        console.log("Email sent successfully",res);
                    },
                    error => {
                        console.error("Failed to send rejection email",error);
                    }
                );
                }else{
                    console.error(`Could not find merchant with id: ${_id} or merchant does not have an email`);
                }
            this.refreshMerchants();  
            
        }, error =>{
            console.error("Failed to update merchant status", error);
        });
    }

    refreshMerchants() {
  this.merchantService.getMerchants().subscribe(data => {
      this.merchants = data.map(merchant => {
        merchant.isReviewed = merchant.status === 'Accepted' || merchant.status === 'Rejected';
      // The documentPath should be the filename only, as stored in the database
      if (merchant.documentPath) {
        // Construct the full URL for the document
        merchant.documentPath = `http://localhost:3000/uploads/${merchant.documentPath}`;
      }
      return merchant;
    });
  });
    }
    


}
