import { ParkingSpot } from "./ParkingSpot";
import { Vehicle } from "./Vehicle";

export class ParkingTicket {
  private endTime: Date | null = null;
  readonly ticketId: string;
  readonly startTime: Date;

  constructor(
    readonly vehicle: Vehicle,
    readonly spot: ParkingSpot,
  ) {
    this.ticketId = crypto.randomUUID();
    this.startTime = new Date();
  }

  //   This is called encapsulation — hiding data and only exposing controlled ways to change it.
  setEndTime() {
    this.endTime = new Date();
  }

  getDurationInHours() {
    const endTime = this.endTime || new Date();
    const durationMs = endTime.getTime() - this.startTime.getTime();
    return durationMs / (1000 * 60 * 60);
  }
}
