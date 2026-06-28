import { VehicleSize } from "../enums";
import { Vehicle } from "./Vehicle";

export class Bike extends Vehicle {
  constructor(vehicleNumber: string, vehicleSize: VehicleSize) {
    super(vehicleNumber, vehicleSize);
  }
}
