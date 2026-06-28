// Interface defines the CONTRACT. Each class implements it differently.

import { ParkingTicket } from "../../model";

export interface PaymentStrategy {
  pay(fee: number, ticket: ParkingTicket): boolean;
}
