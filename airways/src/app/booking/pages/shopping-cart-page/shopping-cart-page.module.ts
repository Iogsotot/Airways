import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { ShoppingCartPageComponent } from './shopping-cart-page.component';
import { ShoppingCartTableComponent } from '../../components/shopping-cart-table/shopping-cart-table.component';
import { RoundedTripPipe } from '../../pipe/rounded-trip.pipe';
import { UserAccountPageComponent } from '../user-account-page/user-account-page.component';
import { UserAccountTableComponent } from '../../components/user-account-table/user-account-table.component';
import { TicketDateSliderModule } from '../../../shared/ticket-date-slider/ticket-date-slider.module';

@NgModule({
  declarations: [
    ShoppingCartPageComponent,
    ShoppingCartTableComponent,
    UserAccountPageComponent,
    UserAccountTableComponent,
    RoundedTripPipe,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatMenuModule,
    MatInputModule,
    RouterModule,
    TicketDateSliderModule,
  ],
})
export class ShoppingCartPageModule {}
