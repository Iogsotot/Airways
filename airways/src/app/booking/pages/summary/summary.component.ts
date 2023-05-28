import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IPassengerDetails } from '../../models/passenger.interface';
import { FormDataService } from '../../services/form-data.service';
import { FormDataModel, PointModel } from '../../models/form-data.model';
import { PassengersDataService } from '../../services/passengers-data.service';
import { EPassenger } from '../../models/passengers-data.interface';
import { TripDataService } from '../../services/trip-data.service';
import { TicketsDataService } from '../../services/tickets-data.service';
import { IFlightDetails } from '../../models/flight-details.interface';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  passengersInfo!: IPassengerDetails[];

  flightDetails!: FormDataModel<PointModel>;  

  passengersNumber = { 'adult': 0, 'child': 0, 'infant': 0 };

  ticketPrice: number;

  tickets: IFlightDetails[];

  constructor(
    private passengersService: PassengersDataService,
    private dataService: FormDataService,
    private router: Router,
    private tripData: TripDataService,
    private ticketDataService: TicketsDataService,
  ) {
    this.passengersInfo = this.passengersService.getPassengersData().passengers;
    this.flightDetails = this.dataService.getMainFormData();
    this.tickets = this.ticketDataService.getTickets();

    this.ticketPrice = 167;
    console.log('flightDetails: ', this.flightDetails);
    console.log('tickets: ', this.tickets);
  }

  ngOnInit(): void {
    this.passengersInfo.forEach(person => {
      if (person.category === EPassenger.ADULT) {
        this.passengersNumber.adult += 1;
        return;
      }

      if (person.category === EPassenger.CHILD) {
        this.passengersNumber.child += 1;
        return;
      }
      this.passengersNumber.infant += 1;
    });
    console.log(this.passengersNumber);
  }

  onBuy(): void {
    this.router.navigateByUrl('/shopping-card');
  }

  addToCart(): void {
    this.tripData.addTripToStack();
  }
}
