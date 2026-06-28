import { ParkingTicket } from "../../model";
import { FeeStrategy } from "./FeeStrategy";

export class FlatRateFeeStrategy implements FeeStrategy {
  constructor(private readonly flatRate: number) {}

  calculateFee(ticket: ParkingTicket): number {
    const hours = ticket.getDurationInHours();
    return Math.max(1, Math.ceil(hours / 24)) * this.flatRate;
  }
}
