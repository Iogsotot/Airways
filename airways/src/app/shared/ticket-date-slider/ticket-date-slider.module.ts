import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TicketDateCardComponent } from './ticket-date-card/ticket-date-card.component';
import { TicketDateSliderComponent } from './ticket-date-slider.component';
import { DateFormatPipe } from '../../core/pipes/date-format.pipe';
import { CustomCurrencyPipe } from '../../booking/pipe/custom-currency.pipe';

@NgModule({
  declarations: [
    TicketDateCardComponent,
    TicketDateSliderComponent,
    DateFormatPipe,
    CustomCurrencyPipe,
  ],
  imports: [CommonModule, MatIconModule],
  exports: [TicketDateSliderComponent, CustomCurrencyPipe],
})
export class TicketDateSliderModule {}
