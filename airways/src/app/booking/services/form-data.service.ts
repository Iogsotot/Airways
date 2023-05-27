/* eslint-disable class-methods-use-this */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { FlightDirection, FormDataModel, PointModel } from '../models/form-data.model';

const initialFormDataValues: FormDataModel<PointModel> = {
  roundedTrip: null,
  from: null,
  destination: null,
  dateStart: null,
  dateEnd: null,
  passengers: 1,
  adult: 1,
  child: 0,
  infant: 0,
};

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
  private flightData: FormDataModel<PointModel> = initialFormDataValues;

  private flightDataSubject: BehaviorSubject<FormDataModel<PointModel>> = new BehaviorSubject<
    FormDataModel<PointModel>
  >(initialFormDataValues);

  public flightData$ = this.flightDataSubject.asObservable();

  private getCityAndCodeFromString = (combinedString: string | null): PointModel => {
    if (combinedString === null)
      return {
        title: null,
        code: null,
      };

    const cityCodeArray = combinedString.split(' ');
    const code = cityCodeArray.pop() || null;
    const title = cityCodeArray.join(' ') || null;

    return { title, code };
  };

  getObservableMainFormData(): Observable<FormDataModel<PointModel>> {
    return this.flightData$;
  }

  setMainFormData(mainFormData: FormDataModel<string>): void {
    this.flightData = {
      ...mainFormData,
      from: this.getCityAndCodeFromString(mainFormData.from),
      destination: this.getCityAndCodeFromString(mainFormData.destination),
    };

    this.flightDataSubject.next(this.flightData);
  }

  getMainFormData(): FormDataModel<PointModel> {
    return this.flightData;
  }

  setFlightDataDate(date: string, direction: FlightDirection): void {
    const currentFlightDataState: FormDataModel<PointModel> = this.flightData;
    const newFlightDataState: FormDataModel<PointModel> = { ...currentFlightDataState };
    if (direction === FlightDirection.DEPARTURE) {
      newFlightDataState.dateStart = date;
      newFlightDataState.dateEnd =
        currentFlightDataState.dateEnd !== null && date >= currentFlightDataState.dateEnd
          ? date
          : currentFlightDataState.dateEnd;
    }
    if (direction === FlightDirection.ARRIVAL) {
      newFlightDataState.dateEnd = date;
      newFlightDataState.dateStart =
        currentFlightDataState.dateStart !== null && date <= currentFlightDataState.dateStart
          ? date
          : currentFlightDataState.dateStart;
    }
    this.flightData = newFlightDataState;
    this.flightDataSubject.next(newFlightDataState);
  }
}
