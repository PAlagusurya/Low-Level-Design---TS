import { PaymentMode, VehicleSize } from "./enums";
import { VehicleFactory } from "./factories";
import { ParkingLotSystem } from "./service/ParkingLotSystem";
import { FlexibleSpotStrategy } from "./strategy/parking";
import { HourlyFeeStrategy, FlatRateFeeStrategy } from "./strategy/fee";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const system = ParkingLotSystem.getInstance();

  // Setup floors and spots
  system
    .createBuilder()
    .addFloor(0)
    .addSpot("0-A", VehicleSize.SMALL)
    .addSpot("0-B", VehicleSize.MEDIUM)
    .addSpot("0-C", VehicleSize.LARGE)
    .addFloor(1)
    .addSpot("1-A", VehicleSize.MEDIUM)
    .addSpot("1-B", VehicleSize.SMALL)
    .buildAndAddTo(system);

  system.printFloors();

  // ─────────────────────────────────
  /* TESTCASE 1 — Basic parking */
  // ─────────────────────────────────
  console.log("\n--- TESTCASE 1: Basic Parking ---");
  const car = VehicleFactory.createVehicle("TN01", VehicleSize.MEDIUM);
  const bike = VehicleFactory.createVehicle("TN02", VehicleSize.SMALL);
  const truck = VehicleFactory.createVehicle("TN03", VehicleSize.LARGE);

  const ticket1 = system.parkVehicle(car);
  const ticket2 = system.parkVehicle(bike);
  const ticket3 = system.parkVehicle(truck);

  system.printFloors();

  console.log("\nWaiting 3 seconds...\n");
  await sleep(3000);

  if (ticket1) system.unParkVehicle(ticket1.ticketId, PaymentMode.CASH);
  if (ticket2) system.unParkVehicle(ticket2.ticketId, PaymentMode.CARD);
  if (ticket3) system.unParkVehicle(ticket3.ticketId, PaymentMode.CASH);

  system.printFloors();

  // ─────────────────────────────────
  /* TESTCASE 2 — Flexible spot sizing */
  // ─────────────────────────────────
  console.log("\n--- TESTCASE 2: Flexible Spot Strategy ---");
  system.setParkingStrategy(new FlexibleSpotStrategy());

  const car1 = VehicleFactory.createVehicle("TN04", VehicleSize.MEDIUM);
  const car2 = VehicleFactory.createVehicle("TN05", VehicleSize.MEDIUM);
  const car3 = VehicleFactory.createVehicle("TN06", VehicleSize.MEDIUM); // ← parks in LARGE!

  const t1 = system.parkVehicle(car1);
  const t2 = system.parkVehicle(car2);
  const t3 = system.parkVehicle(car3);

  system.printFloors();

  console.log("\nWaiting 3 seconds...\n");
  await sleep(3000);

  // ─────────────────────────────────
  /* TESTCASE 3 — Hourly fee */
  // ─────────────────────────────────
  console.log("\n--- TESTCASE 3: Hourly Fee Strategy ---");
  system.setFeeStrategy(new HourlyFeeStrategy(50));
  if (t1) system.unParkVehicle(t1.ticketId, PaymentMode.CASH);

  // ─────────────────────────────────
  /* TESTCASE 4 — Flat rate fee */
  // ─────────────────────────────────
  console.log("\n--- TESTCASE 4: Flat Rate Fee Strategy ---");
  system.setFeeStrategy(new FlatRateFeeStrategy(200));
  if (t2) system.unParkVehicle(t2.ticketId, PaymentMode.CARD);
  if (t3) system.unParkVehicle(t3.ticketId, PaymentMode.CASH);

  system.printFloors();
}

main();
