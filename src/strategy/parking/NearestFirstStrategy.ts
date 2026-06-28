import { ParkingFloor, ParkingSpot, Vehicle } from "../../model";
import { ParkingStrategy } from "./ParkingStrategy";

export class NearestFirstStrategy implements ParkingStrategy {
  findSpot(floors: ParkingFloor[], vehicle: Vehicle): ParkingSpot | null {
    for (const floor of floors) {
      for (const spot of floor.getSpots()) {
        if (spot.canFitVehicle(vehicle)) {
          return spot;
        }
      }
    }
    return null;
  }
}
