import { ParkingTicket } from "../../model";
import { FeeStrategy } from "./FeeStrategy";

export class HourlyFeeStrategy implements FeeStrategy {
  constructor(private readonly hourlyRate: number) {}

  calculateFee(ticket: ParkingTicket): number {
    const hours = Math.ceil(ticket.getDurationInHours());
    return Math.max(1, hours) * this.hourlyRate;
  }
}
