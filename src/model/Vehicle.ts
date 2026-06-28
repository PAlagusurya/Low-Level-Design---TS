import { VehicleSize } from "../enums";

// A vehicle's number plate and size never change after creation. readonly enforces that - Immutability.
// An abstract class is a partial blueprint that cannot be instantiated.
// It defines what all its children must have, and optionally enforces methods they must implement.
// It can only be a parent class, and cannot be instantiated directly. It can have abstract methods that must be implemented by its children.

export abstract class Vehicle {
  constructor(
    readonly vehicleNumber: string,
    readonly vehicleSize: VehicleSize,
  ) {}
}
