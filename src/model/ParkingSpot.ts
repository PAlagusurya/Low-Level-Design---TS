/**If a value is always the same at creation → initialize inline, not in constructor
If a value comes from the caller → put it in constructor.


Our current implementation is safe for single-threaded Node.js. 
If we introduced worker threads, we'd need a mutex lock around parkVehicle to prevent two threads from claiming the same spot simultaneously.
 */

import { VehicleSize } from "../enums";
import { ParkingTicket } from "./ParkingTicket";
import { Vehicle } from "./Vehicle";

const sizeOrder = {
  [VehicleSize.SMALL]: 1,
  [VehicleSize.MEDIUM]: 2,
  [VehicleSize.LARGE]: 3,
};

export class ParkingSpot {
  private isOccupied: boolean = false;
  private parkedVehicle: Vehicle | null = null;

  constructor(
    readonly spotId: string,
    readonly spotSize: VehicleSize,
  ) {}

  // canFitVehicle — used by NearestFirstStrategy (exact match)
  canFitVehicle(vehicle: Vehicle): boolean {
    return !this.isOccupied && this.spotSize === vehicle.vehicleSize;
  }

  // canFitVehicleFlexible — used by FlexibleSpotStrategy (larger allowed)
  canFitVehicleFlexible(vehicle: Vehicle): boolean {
    return (
      !this.isOccupied &&
      sizeOrder[this.spotSize] >= sizeOrder[vehicle.vehicleSize]
    );
  }

  parkVehicle(vehicle: Vehicle): ParkingTicket | null {
    if (this.isOccupied === true) return null;
    this.isOccupied = true;
    this.parkedVehicle = vehicle;
    return new ParkingTicket(vehicle, this);
  }

  unParkVehicle(): void {
    this.isOccupied = false;
    this.parkedVehicle = null;
  }

  getIsOccupied(): boolean {
    return this.isOccupied;
  }
}
