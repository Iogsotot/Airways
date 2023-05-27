export interface FormDataModel<T> {
  roundedTrip: string | null;
  from: T | null;
  destination: T | null;
  dateStart: string | null;
  dateEnd: string | null;
  passengers: number | null;
  adult: number | null;
  child: number | null;
  infant: number | null;
}

export interface PointModel {
  title: string | null;
  code: string | null;
}

export const enum FlightDirection {
  DEPARTURE = 'departure',
  ARRIVAL = 'arrival',
}
