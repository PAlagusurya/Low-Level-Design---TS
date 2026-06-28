# 🅿️ Parking Lot System — Low-Level Design (LLD)

> A production-quality TypeScript implementation of a Parking Lot System built from scratch using real-world design patterns and SOLID principles. Built as both a learning resource and an interview reference.

---

## Table of Contents

1. [What Is This Project?](#1-what-is-this-project)
2. [Why Is This a Classic Interview Problem?](#2-why-is-this-a-classic-interview-problem)
3. [Requirements](#3-requirements)
4. [Actors in the System](#4-actors-in-the-system)
5. [Core Entities](#5-core-entities)
6. [Complete System Flow](#6-complete-system-flow)
7. [UML Class Diagram](#7-uml-class-diagram)
8. [Project Structure](#8-project-structure)
9. [Design Patterns Used](#9-design-patterns-used)
10. [SOLID Principles Applied](#10-solid-principles-applied)
11. [OOP Concepts Demonstrated](#11-oop-concepts-demonstrated)
12. [Key Design Decisions](#12-key-design-decisions)
13. [Interview Questions & Answers](#13-interview-questions--answers)
14. [Bonus Features](#14-bonus-features)
15. [How to Run](#15-how-to-run)
16. [Key Learnings](#16-key-learnings)
17. [Future Improvements](#17-future-improvements)

---

## 1. What Is This Project?

A **Parking Lot System** manages the entry, parking, payment, and exit of vehicles across multiple floors and spots.

### Real-world problem it solves:

- Assign the right spot to the right vehicle automatically
- Track which vehicle is parked where and for how long
- Calculate fees based on duration
- Support multiple payment methods
- Prevent two vehicles from claiming the same spot

### High-level workflow:

```
Vehicle arrives
      ↓
System finds available spot (matching size)
      ↓
Issues a ticket (vehicle + spot + entry time)
      ↓
Vehicle parks
      ↓
Vehicle exits → ticket scanned
      ↓
Fee calculated (hourly or flat rate)
      ↓
Payment processed (cash or card)
      ↓
Spot freed for next vehicle
```

---

## 2. Why Is This a Classic Interview Problem?

Interviewers love this problem because it tests:

| What They're Testing | How This Problem Tests It                           |
| -------------------- | --------------------------------------------------- |
| OOP design           | Vehicle hierarchy, abstract classes                 |
| SOLID principles     | Strategy, Open/Closed, Single Responsibility        |
| Design patterns      | Singleton, Builder, Factory, Strategy               |
| Concurrency thinking | Two vehicles racing for same spot                   |
| Extensibility        | Adding new vehicle types, fee models, payment modes |
| Domain modeling      | Translating real world into classes                 |

If you can design and explain this system confidently — you can handle most LLD interviews.

---

## 3. Requirements

### Functional Requirements

1. Support multiple floors, each with multiple spots
2. Each spot supports a specific vehicle size (SMALL / MEDIUM / LARGE)
3. System assigns the nearest available spot to an incoming vehicle
4. System issues a unique ticket on entry (vehicle + spot + timestamp)
5. Fee calculated based on duration (hourly or flat rate)
6. Support multiple payment methods (Cash, Card)
7. Spot is freed only after successful payment
8. No same spot assigned to two vehicles simultaneously

### Non-Functional Requirements

- Thread-safe spot assignment (no double booking)
- Easily extensible (new vehicle types, fee models, payment modes)
- Single parking lot instance system-wide (Singleton)

### Assumptions

- One parking lot (one system instance)
- Admin sets up floors and spots before operation begins
- Payment always succeeds in this demo (can be extended)
- No reservations or pre-booking

### Out of Scope

- UI / API layer
- Database persistence
- Real payment gateway integration
- Vehicle reservations

---

## 4. Actors in the System

**Actors** are the entities that interact with the system.

| Actor                        | Role                                               |
| ---------------------------- | -------------------------------------------------- |
| **Customer / Driver**        | Enters with vehicle, gets ticket, pays and exits   |
| **Admin**                    | Sets up floors, spots, and configures strategies   |
| **Parking Attendant**        | (represented by ParkingLotSystem) assigns spots    |
| **External Payment Gateway** | (represented by PaymentStrategy) processes payment |

> In an interview: _"Identifying actors helps decide which methods are public, how the API is structured, and which flows to sequence diagram."_

---

## 5. Core Entities

> **Rule:** Look for nouns in the requirements. Each noun is a potential entity (class).

| Entity               | What It Represents                      |
| -------------------- | --------------------------------------- |
| `ParkingLotSystem`   | The brain — coordinates everything      |
| `ParkingFloor`       | One floor with multiple spots           |
| `ParkingSpot`        | One physical parking space              |
| `ParkingTicket`      | Receipt linking vehicle, spot, and time |
| `Vehicle`            | Abstract concept — Car, Bike, or Truck  |
| `Car / Bike / Truck` | Concrete vehicle types                  |

---

## 6. Complete System Flow

### Vehicle Entry (parkVehicle)

```
1. Customer drives in with Car (MEDIUM)
2. ParkingLotSystem.parkVehicle(car) called
3. ParkingStrategy.findSpot(floors, car)
      → loops floors → loops spots
      → finds first free MEDIUM spot
4. spot.parkVehicle(car)
      → marks spot as occupied
      → creates ParkingTicket(car, spot)
      → startTime = now
5. ticket stored in activeTickets map
6. Ticket handed to customer
```

### Vehicle Exit (unParkVehicle)

```
1. Customer presents ticket at exit
2. ParkingLotSystem.unParkVehicle(ticketId, CASH)
3. ticket found in activeTickets ✅
4. ticket.setEndTime() → captures exit time
5. FeeStrategy.calculateFee(ticket)
      → getDurationInHours() → e.g. 2.5 hrs
      → Math.ceil(2.5) = 3 hrs × ₹50 = ₹150
6. PaymentFactory.getStrategy(CASH) → CashPaymentStrategy
7. PaymentService.pay(150, ticket)
      → CashPaymentStrategy.pay() → returns true
8. spot.unParkVehicle() → isOccupied = false
9. activeTickets.delete(ticketId)
10. Spot now available for next vehicle ✅
```

---

## 7. UML Class Diagram

```
                    ┌─────────────────────────────┐
                    │      ParkingLotSystem        │
                    │ <<Singleton>>                │
                    │─────────────────────────────│
                    │ -instance: ParkingLotSystem  │
                    │ -floors: ParkingFloor[]      │
                    │ -activeTickets: Map<>        │
                    │ -parkingStrategy: Parking    │
                    │ -feeStrategy: FeeStrategy    │
                    │─────────────────────────────│
                    │ +getInstance()               │
                    │ +parkVehicle()               │
                    │ +unParkVehicle()             │
                    │ +setParkingStrategy()        │
                    │ +setFeeStrategy()            │
                    └──────────────┬──────────────┘
                                   │ uses
              ┌────────────────────┼─────────────────────┐
              │                    │                      │
    ┌─────────▼────────┐  ┌───────▼───────┐   ┌────────▼────────┐
    │   ParkingFloor   │  │ ParkingTicket │   │  PaymentService │
    │──────────────────│  │───────────────│   │─────────────────│
    │ -floorNumber     │  │ -ticketId     │   │ -strategy       │
    │ -spots[]         │  │ -vehicle      │   │─────────────────│
    │──────────────────│  │ -spot         │   │ +pay()          │
    │ +addSpot()       │  │ -startTime    │   └────────┬────────┘
    │ +getSpots()      │  │ -endTime      │            │ uses
    └─────────┬────────┘  │───────────────│   ┌────────▼────────────┐
              │           │ +setEndTime() │   │  <<interface>>      │
              │ has       │ +getDuration()│   │  PaymentStrategy    │
    ┌─────────▼────────┐  └───────────────┘   │─────────────────────│
    │   ParkingSpot    │                       │ +pay(fee, ticket)   │
    │──────────────────│                       └──────────┬──────────┘
    │ -spotId          │                                   │ implements
    │ -spotSize        │              ┌────────────────────┴──────────────────┐
    │ -isOccupied      │              │                                       │
    │ -parkedVehicle   │   ┌──────────▼──────────┐           ┌───────────────▼──────┐
    │──────────────────│   │ CashPaymentStrategy  │           │ CardPaymentStrategy   │
    │ +canFitVehicle() │   └─────────────────────┘           └──────────────────────┘
    │ +parkVehicle()   │
    │ +unParkVehicle() │   ┌──────────────────────────────────────────────────────┐
    └──────────────────┘   │             <<interface>> FeeStrategy                │
                           │──────────────────────────────────────────────────────│
                           │ +calculateFee(ticket): number                        │
                           └───────────────────┬──────────────────────────────────┘
                                               │ implements
                              ┌────────────────┴────────────────┐
                              │                                  │
                   ┌──────────▼──────────┐          ┌──────────▼──────────┐
                   │  HourlyFeeStrategy  │          │ FlatRateFeeStrategy  │
                   │  ₹X per hour        │          │  ₹Y per day          │
                   └─────────────────────┘          └─────────────────────┘

                   ┌──────────────────────────────────────────────────────┐
                   │           <<interface>> ParkingStrategy              │
                   │──────────────────────────────────────────────────────│
                   │ +findSpot(floors, vehicle): ParkingSpot | null       │
                   └───────────────────┬──────────────────────────────────┘
                                       │ implements
                      ┌────────────────┴────────────────┐
                      │                                  │
           ┌──────────▼──────────┐          ┌──────────▼──────────┐
           │ NearestFirstStrategy│          │ FlexibleSpotStrategy │
           │ exact size match    │          │ larger spot if needed│
           └─────────────────────┘          └─────────────────────┘

                           ┌──────────────────────┐
                           │  <<abstract>> Vehicle │
                           │──────────────────────│
                           │ -vehicleNumber        │
                           │ -vehicleSize          │
                           └──────────┬───────────┘
                                      │ extends
                         ┌────────────┼───────────┐
                         │            │            │
                      ┌──▼──┐     ┌──▼──┐     ┌──▼───┐
                      │ Car │     │Bike │     │Truck │
                      └─────┘     └─────┘     └──────┘
```

### UML Relationship Legend

```
──────►  Association (uses/has)
◆──────  Composition (owns, lifecycle dependent)
△──────  Inheritance (extends)
- - -►  Dependency (uses temporarily)
<<I>>   Interface
```

---

## 8. Project Structure

```
parking-lot/
├── src/
│   ├── enums/
│   │   ├── VehicleSize.ts
│   │   ├── PaymentMode.ts
│   │   └── index.ts
│   │
│   ├── exceptions/
│   │   ├── InvalidTicketException.ts
│   │   ├── PaymentFailedException.ts
│   │   └── index.ts
│   │
│   ├── model/
│   │   ├── Vehicle.ts
│   │   ├── Car.ts
│   │   ├── Bike.ts
│   │   ├── Truck.ts
│   │   ├── ParkingSpot.ts
│   │   ├── ParkingTicket.ts
│   │   ├── ParkingFloor.ts
│   │   └── index.ts
│   │
│   ├── strategy/
│   │   ├── fee/
│   │   │   ├── FeeStrategy.ts
│   │   │   ├── HourlyFeeStrategy.ts
│   │   │   ├── FlatRateFeeStrategy.ts
│   │   │   └── index.ts
│   │   ├── parking/
│   │   │   ├── ParkingStrategy.ts
│   │   │   ├── NearestFirstStrategy.ts
│   │   │   ├── FlexibleSpotStrategy.ts
│   │   │   └── index.ts
│   │   └── payment/
│   │       ├── PaymentStrategy.ts
│   │       ├── CashPaymentStrategy.ts
│   │       ├── CardPaymentStrategy.ts
│   │       └── index.ts
│   │
│   ├── factories/
│   │   ├── VehicleFactory.ts
│   │   ├── PaymentFactory.ts
│   │   └── index.ts
│   │
│   ├── builders/
│   │   ├── ParkingLotBuilder.ts
│   │   └── index.ts
│   │
│   ├── service/
│   │   ├── ParkingLotSystem.ts
│   │   ├── PaymentService.ts
│   │   └── index.ts
│   │
│   └── index.ts              ← demo entry point
│
├── tsconfig.json
├── package.json
└── README.md
```

### Why This Folder Structure?

Each folder owns **one responsibility**. This is [SOLID-S] in action at the folder level:

| Folder        | Owns                | Why Separate?                                   |
| ------------- | ------------------- | ----------------------------------------------- |
| `enums/`      | Fixed value sets    | Prevents typos, used everywhere                 |
| `exceptions/` | Error types         | Clean error boundaries                          |
| `model/`      | Domain objects      | Core business entities                          |
| `strategy/`   | Swappable behaviors | Add new behavior without touching existing code |
| `factories/`  | Object creation     | One place to create objects                     |
| `builders/`   | Complex setup       | Fluent API for lot configuration                |
| `service/`    | Coordination        | Ties everything together                        |

---

## 9. Design Patterns Used

### 🔷 Singleton — ParkingLotSystem

**Problem:** We need exactly ONE parking lot system. Two instances = data inconsistency.

```typescript
class ParkingLotSystem {
  private static instance: ParkingLotSystem; // stored on CLASS
  private constructor() {} // nobody can do new ParkingLotSystem()

  static getInstance(): ParkingLotSystem {
    if (!this.instance) {
      this.instance = new ParkingLotSystem(); // created only ONCE
    }
    return this.instance; // always same object
  }
}
```

**Interview point:** _"Singleton uses a private constructor + static factory method to ensure only one instance exists globally."_

---

### 🔷 Factory — VehicleFactory, PaymentFactory

**Problem:** Caller shouldn't need to know which class to instantiate.

```typescript
// Without Factory — caller knows too much
if (size === VehicleSize.MEDIUM) new Car(...)
else if (size === VehicleSize.LARGE) new Truck(...)

// With Factory — one place, clean
VehicleFactory.createVehicle("TN01", VehicleSize.MEDIUM) // returns Car
```

**Interview point:** _"Factory centralises object creation. Adding a new vehicle type only requires one new class + one case in the factory."_

---

### 🔷 Builder — ParkingLotBuilder

**Problem:** Setting up floors and spots is repetitive and exposes internals.

```typescript
// Without Builder — messy
const floor = new ParkingFloor(0);
floor.addSpot("0-A", VehicleSize.MEDIUM);
system.addFloor(floor);

// With Builder — fluent and clean
system
  .createBuilder()
  .addFloor(0)
  .addSpot("0-A", VehicleSize.MEDIUM)
  .buildAndAddTo(system);
```

`return this` on each method enables **method chaining**.

**Interview point:** _"Builder separates construction from representation. The caller doesn't need to know about ParkingFloor or ParkingSpot — just the builder API."_

---

### 🔷 Strategy — Fee, Parking, Payment

**Problem:** Multiple interchangeable algorithms — swap without changing the system.

```typescript
// Swap fee strategy at runtime — system never changes
system.setFeeStrategy(new HourlyFeeStrategy(50));
system.setFeeStrategy(new FlatRateFeeStrategy(200));

// Swap parking strategy
system.setParkingStrategy(new NearestFirstStrategy());
system.setParkingStrategy(new FlexibleSpotStrategy());
```

**Interview point:** _"Strategy pattern makes ParkingLotSystem follow Open/Closed Principle — open for extension (new strategy), closed for modification (system unchanged)."_

---

## 10. SOLID Principles Applied

### S — Single Responsibility

> Every class has ONE reason to change.

| Class                  | Its One Job               |
| ---------------------- | ------------------------- |
| `ParkingSpot`          | Manage one physical space |
| `ParkingTicket`        | Track one parking session |
| `NearestFirstStrategy` | Find the nearest spot     |
| `HourlyFeeStrategy`    | Calculate hourly fee      |
| `PaymentService`       | Process one payment       |

### O — Open/Closed

> Open for extension, closed for modification.

```
New payment type (UPI)?
→ Add UPIPaymentStrategy.ts
→ Add case in PaymentFactory
→ ParkingLotSystem UNCHANGED ✅

New fee model?
→ Add PeakHourFeeStrategy.ts
→ ParkingLotSystem UNCHANGED ✅
```

### L — Liskov Substitution

> Child classes can replace parent anywhere.

```typescript
// ParkingLotSystem accepts any Vehicle
parkVehicle(vehicle: Vehicle): ParkingTicket | null

// Car, Bike, Truck all extend Vehicle — all work! ✅
system.parkVehicle(new Car(...))
system.parkVehicle(new Bike(...))
system.parkVehicle(new Truck(...))
```

### I — Interface Segregation

> Keep interfaces small and focused.

Each strategy interface has exactly ONE method:

- `FeeStrategy` → `calculateFee()`
- `ParkingStrategy` → `findSpot()`
- `PaymentStrategy` → `pay()`

No class is forced to implement methods it doesn't need.

### D — Dependency Inversion

> Depend on interfaces, not concrete classes.

```typescript
// ParkingLotSystem depends on INTERFACE — not implementation
private parkingStrategy: ParkingStrategy      // interface ✅
private feeStrategy: FeeStrategy              // interface ✅

// NOT:
private parkingStrategy: NearestFirstStrategy // concrete ❌
```

---

## 11. OOP Concepts Demonstrated

### Abstraction — `abstract class Vehicle`

`Vehicle` is a concept, not a real thing. You always park a specific type.

```typescript
abstract class Vehicle {}
new Vehicle()  // ❌ TypeScript error — cannot instantiate abstract class
new Car(...)   // ✅ correct
```

### Encapsulation — `ParkingSpot`

Internal state (`isOccupied`, `parkedVehicle`) is `private`. Only exposed through controlled methods.

```typescript
// ❌ blocked — private
spot.isOccupied = true;

// ✅ allowed — controlled method
spot.parkVehicle(vehicle); // sets isOccupied internally
spot.getIsOccupied(); // read-only access
```

### Inheritance — `Car extends Vehicle`

Common properties (`vehicleNumber`, `vehicleSize`) defined once in parent. All children inherit for free.

### Polymorphism — Strategy Pattern

Same method call, different behavior depending on which strategy is injected.

```typescript
this.feeStrategy.calculateFee(ticket);
// Behaves differently based on which strategy is set:
// HourlyFeeStrategy  → charges per hour
// FlatRateFeeStrategy → charges per day
```

### `readonly` — Immutability

Properties that never change after creation are marked `readonly`.

```typescript
constructor(
  readonly vehicleNumber: string,  // never changes
  readonly vehicleSize: VehicleSize // never changes
) {}
```

### `static` — Class-level vs Instance-level

Static methods belong to the CLASS, not an instance. Used when no object data is needed.

```typescript
VehicleFactory.createVehicle(...)  // no instance needed
ParkingLotSystem.getInstance()     // returns the one instance
```

---

## 12. Key Design Decisions

### Decision 1: Why `Map` for activeTickets instead of Array?

```typescript
// Array — O(n) search every time
tickets.find((t) => t.ticketId === id);

// Map — O(1) instant lookup
activeTickets.get(ticketId);
```

In a busy parking lot with thousands of active tickets — Map is significantly faster.

---

### Decision 2: Why does `ParkingSpot.parkVehicle` not check size?

Originally `parkVehicle` checked exact size match. This broke `FlexibleSpotStrategy` which intentionally parks a MEDIUM car in a LARGE spot.

**Decision:** Size validation belongs to the **Strategy** (business rule), not the **Spot** (physical object).

```
ParkingStrategy → decides WHICH spot fits WHICH vehicle (business rule)
ParkingSpot     → just parks when told to (physical action)
```

This respects [SOLID-S] — each class has one responsibility.

---

### Decision 3: Why `abstract class Vehicle` instead of `interface`?

An interface can't have a constructor or shared implementation. An abstract class can:

```typescript
abstract class Vehicle {
  constructor(
    // shared implementation
    readonly vehicleNumber: string,
    readonly vehicleSize: VehicleSize,
  ) {}
}
// Car, Bike, Truck get this for free!
```

With an interface, we'd repeat the constructor in every subclass. That violates [DRY].

---

### Decision 4: Why `private constructor` in Singleton?

Without it, anyone can bypass `getInstance()`:

```typescript
const system1 = new ParkingLotSystem(); // bypasses Singleton!
const system2 = new ParkingLotSystem(); // two instances — chaos!
```

`private constructor` makes this a TypeScript compile error.

---

### Decision 5: Why `return this` in Builder?

Each builder method returns `this` (the builder object itself) — enabling method chaining:

```typescript
builder
  .addFloor(0) // returns this
  .addSpot("0-A", VehicleSize.MEDIUM) // returns this
  .addSpot("0-B", VehicleSize.SMALL) // returns this
  .buildAndAddTo(system);
```

Without `return this`, each call would need a separate line with the variable.

---

### Decision 6: Thread Safety — Why No Mutex in Node.js?

**The concern:** What if two vehicles claim the same spot simultaneously?

**In Java** — genuinely possible (multiple threads):

```java
// Java needs synchronized block
public synchronized ParkingTicket parkVehicle(Vehicle vehicle) {
  // only one thread enters at a time
}
```

**In Node.js** — single-threaded event loop:

JavaScript processes ONE operation at a time. No two operations ever run at the exact same millisecond. Our boolean check is sufficient.

**BUT — if Node.js Worker Threads are used:**

```typescript
// Worker threads CAN run simultaneously — boolean check not enough!
// Thread 1: isOccupied? → false ✅
// Thread 2: isOccupied? → false ✅ ← both pass! double booking! 😱

// Fix — use mutex lock:
import { Mutex } from "async-mutex";

export class ParkingSpot {
  private mutex = new Mutex();

  async parkVehicle(vehicle: Vehicle): Promise<ParkingTicket | null> {
    return await this.mutex.runExclusive(() => {
      if (this.isOccupied) return null;
      this.isOccupied = true;
      this.parkedVehicle = vehicle;
      return new ParkingTicket(vehicle, this);
    });
  }
}
```

`mutex.runExclusive` = only ONE thread enters this block at a time.

**Interview answer:**

> _"Our current implementation is safe for single-threaded Node.js. The event loop guarantees sequential execution. However, if we introduced Worker Threads, we'd need a mutex lock around `parkVehicle` to prevent two threads from claiming the same spot simultaneously — similar to Java's `synchronized` keyword."_

| Environment            | Double check enough? | Need mutex? |
| ---------------------- | -------------------- | ----------- |
| Node.js single thread  | ✅ Yes               | ❌ No       |
| Node.js worker threads | ❌ No                | ✅ Yes      |
| Java multiple threads  | ❌ No                | ✅ Yes      |

**Q: Is your Node.js implementation truly thread-safe?**

> For standard Node.js — yes. JavaScript's single-threaded event loop ensures only one operation runs at a time. However, if Worker Threads are introduced, two threads could simultaneously pass the `isOccupied` check before either sets it to `true` — resulting in double booking. The fix is a mutex lock (`async-mutex` library) around `parkVehicle`, ensuring only one thread can enter the critical section at a time. This is equivalent to Java's `synchronized` keyword.

---

## 13. Interview Questions & Answers

**Q: Why is Singleton used for ParkingLotSystem?**

> A parking lot is a single physical entity. All floors, spots, and tickets must be managed from one place. Two instances would mean split data — vehicles could be double-booked across instances. Singleton ensures one source of truth system-wide.

---

**Q: What happens if two vehicles try to park in the same spot simultaneously?**

> In Node.js (single-threaded), this can't truly happen simultaneously — JavaScript's event loop processes one operation at a time. However, we still guard in `parkVehicle` — if the strategy finds a spot but it's taken before we commit, `parkVehicle` returns `null` and the system retries. In a multi-threaded environment (Java), we'd use a `synchronized` block or mutex lock.

---

**Q: How would you add a new vehicle type, say Electric Van?**

> 1. Add `ELECTRIC_VAN` to `VehicleSize` enum
> 2. Create `ElectricVan.ts` extending `Vehicle`
> 3. Add a case in `VehicleFactory`
> 4. No other files change — [SOLID-O] respected

---

**Q: How would you add UPI payment?**

> 1. Create `UPIPaymentStrategy.ts` implementing `PaymentStrategy`
> 2. Add `UPI` to `PaymentMode` enum
> 3. Add a case in `PaymentFactory`
> 4. `ParkingLotSystem` and `PaymentService` unchanged — [SOLID-O] respected

---

**Q: Why Strategy Pattern over if/else for fee calculation?**

> With if/else, adding a new fee model requires modifying the existing `unParkVehicle` method — risking breaking existing logic. With Strategy, we create a new class in a new file. Existing code is never touched. This is the Open/Closed Principle in practice.

---

**Q: What is the difference between Factory and Builder here?**

> **Factory** creates a single object — `VehicleFactory.createVehicle()` creates one vehicle. **Builder** constructs a complex structure step by step — `ParkingLotBuilder` builds an entire floor-and-spot configuration through chained calls. Factory = one object, Builder = complex assembly.

---

**Q: Why use `readonly` on properties?**

> `readonly` enforces immutability — once set in the constructor, the value can never change. A vehicle's number plate never changes. A ticket's start time never changes. `readonly` makes these constraints explicit and prevents accidental mutation.

---

**Q: What is the purpose of `index.ts` barrel files?**

> Barrel files re-export everything from a folder in one place. Instead of importing from 4 different paths, consumers import from the folder: `import { Vehicle, ParkingSpot } from "../model"`. This is [DRY] — the import path is defined once. If a file moves, only `index.ts` needs updating.

---

**Q: Why does `ParkingTicket` generate its own `ticketId` and `startTime`?**

> The caller should never decide the ticket ID or entry time — these are the ticket's own responsibility. Using `crypto.randomUUID()` and `new Date()` inside the constructor ensures the ticket is always created with correct, tamper-proof values. This is [OOP - Encapsulation].

---

## 14. Bonus Features

### Flexible Spot Sizing

When no exact-size spot is available, `FlexibleSpotStrategy` parks the vehicle in the next larger spot.

```
Car (MEDIUM) arrives, all MEDIUM spots full
  → FlexibleSpotStrategy checks LARGE spots
  → Parks car in LARGE spot ✅
```

```typescript
// sizeOrder enables numeric comparison of enum values
const sizeOrder = { SMALL: 1, MEDIUM: 2, LARGE: 3 };

// Pass 2 — find larger spot
if (
  !spot.getIsOccupied() &&
  sizeOrder[spot.spotSize] > sizeOrder[vehicle.vehicleSize]
) {
  return spot;
}
```

### Two Fee Strategies

**HourlyFeeStrategy** — minimum 1 hour, rounded up:

```
2.5 hours × ₹50 = Math.ceil(2.5) × 50 = 3 × 50 = ₹150
```

**FlatRateFeeStrategy** — minimum 1 day, rounded up:

```
25 hours × ₹200 = Math.ceil(25/24) × 200 = 2 × 200 = ₹400
```

| Duration | Hourly (₹50/hr) | FlatRate (₹200/day) |
| -------- | --------------- | ------------------- |
| 30 mins  | ₹50 (min 1 hr)  | ₹200 (min 1 day)    |
| 2.5 hrs  | ₹150            | ₹200                |
| 25 hrs   | ₹1300           | ₹400                |
| 49 hrs   | ₹2500           | ₹600                |

---

## 15. How to Run

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone <your-repo-url>
cd parking-lot
npm install
npm install typescript ts-node --save-dev
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "verbatimModuleSyntax": false
  }
}
```

### Run

```bash
npx ts-node src/index.ts
```

### Build

```bash
npx tsc
node dist/index.js
```

### Expected Output

```
=========================
Floor 0
0-A SMALL Free
0-B MEDIUM Free
0-C LARGE Free
Floor 1
1-A MEDIUM Free
1-B SMALL Free
=========================
Vehicle TN01 parked! Ticket: <uuid>
Vehicle TN02 parked! Ticket: <uuid>
Vehicle TN03 parked! Ticket: <uuid>
=========================
Floor 0
0-A SMALL Occupied
0-B MEDIUM Occupied
0-C LARGE Occupied
=========================
Fee for 0.00 hours: ₹50
Processing cash payment of ₹50 for ticket ID: <uuid>
Vehicle exited. Fee charged: ₹50
=========================
Floor 0
0-A SMALL Free
0-B MEDIUM Free
0-C LARGE Free
=========================
```

---

## 16. Key Learnings

After building this project, you will confidently understand:

| Concept               | Where You See It                                    |
| --------------------- | --------------------------------------------------- |
| Abstract classes      | `Vehicle`                                           |
| Interfaces            | `FeeStrategy`, `ParkingStrategy`, `PaymentStrategy` |
| Readonly & private    | `ParkingSpot`, `ParkingTicket`                      |
| Static methods        | `VehicleFactory`, `ParkingLotSystem.getInstance()`  |
| Method chaining       | `ParkingLotBuilder`                                 |
| Singleton pattern     | `ParkingLotSystem`                                  |
| Factory pattern       | `VehicleFactory`, `PaymentFactory`                  |
| Builder pattern       | `ParkingLotBuilder`                                 |
| Strategy pattern      | All three strategy families                         |
| Open/Closed Principle | Adding new strategies without changing system       |
| Single Responsibility | Each class has one job                              |
| Dependency Inversion  | System depends on interfaces                        |
| Encapsulation         | Private state with controlled access                |
| Polymorphism          | Same method, different behavior                     |
| Concurrency thinking  | Race condition in spot assignment                   |
| Barrel exports        | `index.ts` in every folder                          |

---

## 17. Future Improvements

The current design supports all of these without major changes:

| Feature                      | How to Add                                           |
| ---------------------------- | ---------------------------------------------------- |
| Multiple parking lots        | Remove Singleton, pass lot ID                        |
| Reservations                 | Add `ReservationService`, new ticket type            |
| Dynamic pricing (peak hours) | New `PeakHourFeeStrategy` implementing `FeeStrategy` |
| EV charging spots            | New `VehicleSize.EV`, new spot type                  |
| UPI / Wallet payment         | New strategy + enum value                            |
| Database persistence         | Add repository layer under service                   |
| REST API                     | Add controller layer on top of service               |
| Discount / coupon system     | New `DiscountStrategy` wrapping `FeeStrategy`        |

Every addition follows the same pattern: **new file, new class, existing code untouched.**

That is the power of SOLID + Strategy Pattern working together.

---

## Project Summary

This project is a complete demonstration of **real-world software engineering thinking** applied to a classic interview problem.

Starting from plain TypeScript classes, we progressively applied:

- **OOP** to model the real world
- **SOLID** to keep the design clean and extensible
- **Design Patterns** to solve recurring problems elegantly
- **Concurrency thinking** to handle race conditions

The result is a system that is easy to understand, easy to extend, and easy to explain in any interview.

> _"The best code is code that reads like a story — you understand what it does before you understand how it does it."_

---

Built with ❤️ — one concept at a time.
