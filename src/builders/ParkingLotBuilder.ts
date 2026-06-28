import { VehicleSize } from "../enums";
import { ParkingFloor } from "../model";
import { ParkingLotSystem } from "../service/ParkingLotSystem";

/**Builder pattern separates the construction of a complex object from its representation, allowing the same construction process to create different configurations. */
//chain methods, hide complexity, clean API!
export class ParkingLotBuilder {
  private floors: ParkingFloor[] = [];
  private currentFloor: ParkingFloor | null = null;

  // Creates new floor, sets as current, returns this for chaining
  addFloor(floorNumber: number): ParkingLotBuilder {
    const newFloor = new ParkingFloor(floorNumber);
    this.floors.push(newFloor);
    this.currentFloor = newFloor;
    return this;
  }

  // Adds spot to current floor, returns this for chaining
  addSpot(spotId: string, size: VehicleSize): ParkingLotBuilder {
    if (!this.currentFloor) {
      throw new Error("Call addFloor() before addSpot()");
    }
    this.currentFloor.addSpot(spotId, size);
    return this;
  }

  // Adds all floors to the system
  buildAndAddTo(system: ParkingLotSystem): void {
    this.floors.forEach((floor) => system.addFloor(floor));
  }
}
