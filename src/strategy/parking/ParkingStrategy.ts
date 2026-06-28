import { ParkingSpot, Vehicle, ParkingFloor } from "../../model";

export interface ParkingStrategy {
  findSpot(floors: ParkingFloor[], vehicle: Vehicle): ParkingSpot | null;
}
