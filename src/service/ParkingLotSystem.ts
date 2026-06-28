/**
Vehicle enters → find spot → create ticket → store ticket
Vehicle exits  → validate ticket → calculate fee → process payment → free spot 
*/

import { PaymentMode } from "../enums";
import { InvalidTicketException, PaymentFailedException } from "../exceptions";
import { PaymentFactory } from "../factories";
import { ParkingFloor, ParkingTicket, Vehicle } from "../model";
import { FeeStrategy, HourlyFeeStrategy } from "../strategy/fee";
import { NearestFirstStrategy } from "../strategy/parking/NearestFirstStrategy";
import { ParkingStrategy } from "../strategy/parking/ParkingStrategy";
import { PaymentService } from "./PaymentService";
import { ParkingLotBuilder } from "../builders";

//Ensure a class has only one instance and provide a global point of access to it.
/**
 *     STATIC: belongs to CLASS itself
       not to any object!
 */

export class ParkingLotSystem {
  // 1. Store the one instance
  private static instance: ParkingLotSystem;

  private floors: ParkingFloor[] = [];
  private activeTickets: Map<string, ParkingTicket> = new Map();

  private feeStrategy: FeeStrategy = new HourlyFeeStrategy(50);
  private parkingStrategy: ParkingStrategy = new NearestFirstStrategy();

  // 2. Private constructor — nobody can do new ParkingLotSystem()!
  private constructor() {}

  createBuilder(): ParkingLotBuilder {
    return new ParkingLotBuilder();
  }

  static getInstance(): ParkingLotSystem {
    if (!this.instance) {
      this.instance = new ParkingLotSystem();
    }
    return this.instance;
  }

  addFloor(floor: ParkingFloor): void {
    this.floors.push(floor);
  }

  setParkingStrategy(strategy: ParkingStrategy): void {
    this.parkingStrategy = strategy;
  }

  setFeeStrategy(strategy: FeeStrategy): void {
    this.feeStrategy = strategy;
  }

  printFloors(): void {
    console.log("=========================");
    for (const floor of this.floors) {
      console.log(`Floor ${floor.floorNumber}`);
      for (const spot of floor.getSpots()) {
        console.log(
          `${spot.spotId} ${spot.spotSize} ${spot.getIsOccupied() ? "Occupied" : "Free"}`,
        );
      }
    }
    console.log("=========================");
  }

  parkVehicle(vehicle: Vehicle): ParkingTicket | null {
    const spot = this.parkingStrategy.findSpot(this.floors, vehicle);
    if (!spot) {
      return null;
    }
    const ticket = spot.parkVehicle(vehicle);
    if (!ticket) {
      console.log(`Spot taken, retrying...`);
      return this.parkVehicle(vehicle);
    }
    this.activeTickets.set(ticket.ticketId, ticket);
    console.log(
      `Vehicle ${vehicle.vehicleNumber} parked! Ticket: ${ticket.ticketId}`,
    );
    return ticket;
  }

  unParkVehicle(ticketId: string, paymentMode: PaymentMode) {
    const ticket = this.activeTickets.get(ticketId);
    if (!ticket) throw new InvalidTicketException(ticketId);

    ticket.setEndTime();

    const fee = this.feeStrategy.calculateFee(ticket);
    console.log(
      `Fee for ${ticket.getDurationInHours().toFixed(2)} hours: ₹${fee}`,
    );

    const strategy = PaymentFactory.getStrategy(paymentMode);
    const paymentService = new PaymentService(strategy);
    const success = paymentService.pay(fee, ticket);

    if (!success) throw new PaymentFailedException(ticketId);

    ticket.spot.unParkVehicle();
    this.activeTickets.delete(ticketId);

    console.log(`Vehicle exited.Fee charged:₹${fee} `);
  }
}
