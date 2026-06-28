import { VehicleSize } from "../../enums";
import { ParkingFloor, ParkingSpot, Vehicle } from "../../model";
import { ParkingStrategy } from "./ParkingStrategy";

const sizeOrder = {
  [VehicleSize.SMALL]: 1,
  [VehicleSize.MEDIUM]: 2,
  [VehicleSize.LARGE]: 3,
};

export class FlexibleSpotStrategy implements ParkingStrategy {
  findSpot(floors: ParkingFloor[], vehicle: Vehicle): ParkingSpot | null {
    // Pass 1 — look for exact size
    for (const floor of floors) {
      for (const spot of floor.getSpots()) {
        if (spot.canFitVehicle(vehicle)) return spot;
      }
    }

    // Pass 2 — look for larger size
    for (const floor of floors) {
      for (const spot of floor.getSpots()) {
        if (spot.canFitVehicleFlexible(vehicle)) {
          return spot;
        }
      }
    }

    return null;
  }
}
