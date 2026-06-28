import { VehicleSize } from "../enums";
import { Vehicle } from "./Vehicle";

export class Car extends Vehicle {
  constructor(vehicleNumber: string, vehicleSize: VehicleSize) {
    super(vehicleNumber, vehicleSize);
  }
}
