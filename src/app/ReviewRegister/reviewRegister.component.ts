import { Component, OnInit } from "@angular/core";
import { Merchant } from '../register.model';
import { MerchantService } from '../register.service';
import { HttpService } from '../http.service';
import { HttpClient } from '@angular/common/http';


@Component({
    selector: "review-register",
    templateUrl: "./reviewRegister.component.html",
    styleUrls: ['./reviewRegister.component.css']
})
export class MerchantListComponent implements OnInit {
    merchants: Merchant[] = [];
    private baseUrl = 'http://localhost:3000/api'; 

    constructor(public merchantService: MerchantService, private http: HttpClient, private HttpService: HttpService) {}

    ngOnInit() {
        this.merchantService.getMerchants().subscribe(data => {
            this.merchants = data;
        });
    }

    acceptMerchant(_id: string) {
        this.merchantService.updateStatus(_id, 'Accepted').subscribe(() => {

            const merchant = this.merchants.find(m => m._id === _id);
            
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
            const merchant = this.merchants.find(m=>m._id == _id);

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
            this.merchants = data;
        });
    }
}
