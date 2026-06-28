import { ParkingTicket } from "../../model";

export interface FeeStrategy {
  calculateFee(ticket: ParkingTicket): number;
}
