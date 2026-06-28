import { VehicleSize } from "../enums";
import { ParkingSpot } from "./ParkingSpot";

export class ParkingFloor {
  private spots: ParkingSpot[] = [];
  constructor(readonly floorNumber: number) {}

  addSpot(spotId: string, size: VehicleSize): void {
    const spot = new ParkingSpot(spotId, size);
    this.spots.push(spot);
  }

  getSpots(): ParkingSpot[] {
    return this.spots;
  }
}
