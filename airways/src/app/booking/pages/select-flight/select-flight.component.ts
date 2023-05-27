import { Component, OnInit, Output } from '@angular/core';
import { Observable, forkJoin, from, mergeMap, tap, Subject } from 'rxjs';

import dayjs from 'dayjs';
import { IFlightDetails } from '../../models/flight-details.interface';
import { FlightsDataService } from '../../services/flightsData.service';
import { FormDataService } from '../../services/form-data.service';
import { PointModel, FormDataModel, FlightDirection } from '../../models/form-data.model';
import { ECurrency } from '../../../core/models/currency.interface';
import { HeaderDataService } from '../../../core/services/header-data.service';

@Component({
  selector: 'app-select-flight',
  templateUrl: './select-flight.component.html',
  styleUrls: ['./select-flight.component.scss'],
  providers: [FlightsDataService],
})
export class SelectFlightComponent implements OnInit {
  private departureDateSubject: Subject<string> = new Subject<string>();

  private returnDateSubject: Subject<string> = new Subject<string>();

  private previousDepartureDate: string;

  private previousReturnDate: string;

  private previousArrivalCode: string;

  private previousDepartureCode: string;

  flightData$: Observable<FormDataModel<PointModel>>;

  flightsDetailsDepart$!: Observable<IFlightDetails[]>;

  departure: PointModel = { title: '', code: '' };

  currency$: Observable<ECurrency>;

  currency!: ECurrency;

  ticketsDataDepart: { date: string; cost: string }[] = [];

  flightsDetailsReturn$!: Observable<IFlightDetails[]>;

  arrival: PointModel = { title: '', code: '' };

  ticketsDataReturn: { date: string; cost: string }[] = [];

  flightDepartureCurrency!: ECurrency;

  flightReturnCurrency!: ECurrency;

  @Output() departureDate: string = '';

  @Output() returnDate: string = '';

  constructor(
    private flightsDataService: FlightsDataService,
    private formDataService: FormDataService,
    private headerDataService: HeaderDataService
  ) {
    this.flightData$ = this.formDataService.getObservableMainFormData();

    this.currency$ = this.headerDataService.currentCurrency$;

    this.flightData$.subscribe((formData: FormDataModel<PointModel>) => {
      this.departure =
        formData.from === null
          ? { title: '', code: '' }
          : { title: formData.from.title, code: formData.from.code };
      this.arrival =
        formData.destination === null
          ? { title: '', code: '' }
          : { title: formData.destination.title, code: formData.destination.code };

      this.departureDate = dayjs(formData?.dateStart).format('YYYY-MM-DD').toString() ?? '';
      this.returnDate = dayjs(formData?.dateEnd).format('YYYY-MM-DD').toString() ?? '';
    });

    this.previousDepartureDate = '';
    this.previousReturnDate = '';
    this.previousArrivalCode = '';
    this.previousDepartureCode = '';
  }

  ngOnInit(): void {
    this.formDataService.flightData$.subscribe((flightData) => {
      this.departureDate = dayjs(flightData?.dateStart).format('YYYY-MM-DD').toString() ?? '';
      this.returnDate = dayjs(flightData?.dateEnd).format('YYYY-MM-DD').toString() ?? '';
      this.fetchFlightsData();
    });

    this.headerDataService.currentCurrency$.subscribe((currency) => {
      this.currency = currency;
      this.fetchFlightsData();
    });

    this.fetchFlightsData();
  }

  private fetchFlightsData(): void {
    if (
      this.departureDate !== this.previousDepartureDate ||
      this.previousArrivalCode !== this.arrival.code ||
      this.previousDepartureCode !== this.departure.code
    ) {
      const departureDates = [
        dayjs(this.departureDate).subtract(2, 'day').format('YYYY-MM-DD'),
        dayjs(this.departureDate).subtract(1, 'day').format('YYYY-MM-DD'),
        this.departureDate,
        dayjs(this.departureDate).add(1, 'day').format('YYYY-MM-DD'),
        dayjs(this.departureDate).add(2, 'day').format('YYYY-MM-DD'),
      ];

      const flightDepartureRequests = departureDates.map((departureDate) =>
        this.flightsDataService.getFlightsData(
          this.departure.code ?? '',
          this.arrival.code ?? '',
          departureDate,
          this.currency,
          true
        )
      );

      forkJoin(flightDepartureRequests).subscribe((responses: IFlightDetails[][]) => {
        const ticketsDataDepart$ = responses?.map((flightsData) =>
          flightsData.map((flight) => ({
            date: dayjs(flight.departure_at).format('YYYY-MM-DD'),
            cost: flight.price.toString(),
          }))
        );

        this.ticketsDataDepart = [];

        from(ticketsDataDepart$)
          .pipe(
            mergeMap((ticketsData$) => ticketsData$),
            tap((ticketsData) => this.ticketsDataDepart.push(ticketsData))
          )
          .subscribe({
            complete: () => {
              this.flightsDetailsDepart$ = this.flightsDataService.getFlightsData(
                this.departure.code ?? '',
                this.arrival.code ?? '',
                this.departureDate,
                this.currency,
                true
              );
            },
          });
      });
      this.flightDepartureCurrency = this.currency;
    }

    if (
      this.returnDate !== this.previousReturnDate ||
      this.previousArrivalCode !== this.arrival.code ||
      this.previousDepartureCode !== this.departure.code
    ) {
      const returnDates = [
        dayjs(this.returnDate).subtract(2, 'day').format('YYYY-MM-DD'),
        dayjs(this.returnDate).subtract(1, 'day').format('YYYY-MM-DD'),
        this.returnDate,
        dayjs(this.returnDate).add(1, 'day').format('YYYY-MM-DD'),
        dayjs(this.returnDate).add(2, 'day').format('YYYY-MM-DD'),
      ];
      const flightReturnRequests = returnDates.map((returnDate) =>
        this.flightsDataService.getFlightsData(
          this.arrival.code ?? '',
          this.departure.code ?? '',
          returnDate,
          this.currency,
          true
        )
      );
      forkJoin(flightReturnRequests).subscribe((responses: IFlightDetails[][]) => {
        const ticketsDataReturn$ = responses?.map((flightsData) =>
          flightsData.map((flight) => ({
            date: dayjs(flight.departure_at).format('YYYY-MM-DD'),
            cost: flight.price.toString(),
          }))
        );
        this.ticketsDataReturn = [];
        from(ticketsDataReturn$)
          .pipe(
            mergeMap((ticketsData$) => ticketsData$),
            tap((ticketsData) => this.ticketsDataReturn.push(ticketsData))
          )
          .subscribe({
            complete: () => {
              this.flightsDetailsReturn$ = this.flightsDataService.getFlightsData(
                this.arrival.code ?? '',
                this.departure.code ?? '',
                this.returnDate,
                this.currency,
                true
              );
            },
          });
      });

      this.flightReturnCurrency = this.currency;
    }

    this.previousDepartureDate = this.departureDate;
    this.previousReturnDate = this.returnDate;
    this.previousArrivalCode = this.arrival.code ?? '';
    this.previousDepartureCode = this.departure.code ?? '';
  }

  handleClickOnNextArrivalDate(): void {
    const nextDate = dayjs(this.returnDate).add(1, 'day').format('YYYY-MM-DD');
    this.returnDateSubject.next(nextDate);
    if (nextDate < this.departureDate) {
      this.departureDateSubject.next(nextDate);
    }
    this.formDataService.setFlightDataDate(dayjs(nextDate).toString(), FlightDirection.ARRIVAL);
  }

  handleClickOnPrevArrivalDate(): void {
    const prevDate = dayjs(this.returnDate).subtract(1, 'day').format('YYYY-MM-DD');
    this.returnDateSubject.next(prevDate);
    if (prevDate < this.departureDate) {
      this.departureDateSubject.next(prevDate);
    }
    this.formDataService.setFlightDataDate(dayjs(prevDate).toString(), FlightDirection.ARRIVAL);
  }

  handleClickOnNextDepartureDate(): void {
    const nextDate = dayjs(this.departureDate).add(1, 'day').format('YYYY-MM-DD');
    this.departureDateSubject.next(nextDate);
    if (nextDate > this.returnDate) {
      this.returnDateSubject.next(nextDate);
    }
    this.formDataService.setFlightDataDate(dayjs(nextDate).toString(), FlightDirection.DEPARTURE);
  }

  handleClickOnPrevDepartureDate(): void {
    const prevDate = dayjs(this.departureDate).subtract(1, 'day').format('YYYY-MM-DD');
    this.departureDateSubject.next(prevDate);
    if (prevDate > this.returnDate) {
      this.returnDateSubject.next(prevDate);
    }
    this.formDataService.setFlightDataDate(dayjs(prevDate).toString(), FlightDirection.DEPARTURE);
  }
}
