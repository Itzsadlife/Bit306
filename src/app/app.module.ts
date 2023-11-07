import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { NavbarComponent } from './sharepages/navbar/navbar.component';
import { navComponent } from './register/login nav/nav.component';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MerchantListComponent } from './ReviewRegister/reviewRegister.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { RouterModule } from '@angular/router';
import { EditProductComponent } from './edit-product/edit-product.component';
import { MerchantNavBar } from './merchant nav/MerchantNav.component';
import { AddProductComponent } from './add-product/add-product.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { PurchasingComponent } from './purchasing/purchasing.component';
import { AnalyticsOfficerComponent } from './analyticsOfficer/analyticsOfficer.component';
import { ReviewComponent } from './review/review.component';
import { MenuComponent } from './menu/menu.component';
import { officerNavBar } from './officer-nav/officer-nav.component';
import {HttpClientModule} from '@angular/common/http';
import { FirstTimeLoginComponent } from './FirstTImeLogin/firsttimelogin.component';
import { MatDialogModule } from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    NavbarComponent,
    navComponent,
    MerchantListComponent,
    LoginComponent,
    HomeComponent,
    EditProductComponent,
    MerchantNavBar,
    AddProductComponent,
    AnalyticsComponent,
    PurchasingComponent,
    AnalyticsOfficerComponent,
    ReviewComponent,
    MenuComponent,
    officerNavBar,
    FirstTimeLoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatExpansionModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterModule,
    HttpClientModule,
    MatDialogModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
