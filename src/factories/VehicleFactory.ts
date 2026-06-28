import { VehicleSize } from "../enums";
import { Bike, Car, Truck } from "../model";

// If a class extends NOTHING and has no properties → pure utility → can be static!
export class VehicleFactory {
  static createVehicle(vehicleNumber: string, size: VehicleSize) {
    switch (size) {
      case VehicleSize.SMALL:
        return new Bike(vehicleNumber, size);
      case VehicleSize.MEDIUM:
        return new Car(vehicleNumber, size);
      case VehicleSize.LARGE:
        return new Truck(vehicleNumber, size);
      default:
        throw new Error("Invalid vehicle size");
    }
  }
}
