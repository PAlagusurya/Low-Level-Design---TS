import { ParkingTicket } from "../../model";
import { PaymentStrategy } from "./PaymentStrategy";

export class CashPaymentStrategy implements PaymentStrategy {
  pay(fee: number, ticket: ParkingTicket): boolean {
    console.log(
      `Processing cash payment of ₹${fee} for ticket ID: ${ticket.ticketId}`,
    );
    // Logic to process cash payment
    return true;
  }
}
