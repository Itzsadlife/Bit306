import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MerchantListComponent } from './ReviewRegister/reviewRegister.component';
import { RegisterComponent } from './register/register.component';
import { EditProductComponent } from './edit-product/edit-product.component';
import { AddProductComponent } from './add-product/add-product.component';
import { HomeComponent } from './home/home.component';
// import { PurchasingComponent } from './purchasing/purchasing.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { AnalyticsOfficerComponent } from './analyticsOfficer/analyticsOfficer.component';
// import { ReviewComponent } from './review/review.component';
import { MenuComponent } from './menu/menu.component';


const routes: Routes = [
  { path: '', component: MenuComponent },
  { path: 'review-register', component: MerchantListComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'edit-product', component: EditProductComponent },
  { path: 'login',component:LoginComponent},
  { path: 'add-product',component:AddProductComponent},
  { path: 'home',component:HomeComponent},
  // { path: 'purchase',component:PurchasingComponent},
  { path: 'view-analytics',component:AnalyticsComponent},
  { path: 'officer-view-analytics',component:AnalyticsOfficerComponent},
  // { path: 'review',component:ReviewComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
