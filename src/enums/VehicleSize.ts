/**
 * ENUM: VehicleSize
 *
 * WHY: We need a fixed set of vehicle sizes in our system.
 * Using an enum instead of plain strings prevents typos,
 * makes code self-documenting, and lets TypeScript catch
 * wrong values at compile time (before the code even runs).
 *
 * SCALABILITY: To add a new size (e.g. EXTRA_LARGE),
 * you add one line here and TypeScript will tell you
 * everywhere in the codebase that needs to handle it.
 */

export enum VehicleSize {
  SMALL = "SMALL", // e.g. Bike
  MEDIUM = "MEDIUM", // e.g. Car
  LARGE = "LARGE", // e.g. Truck
}
