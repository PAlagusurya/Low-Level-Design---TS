import { ParkingTicket } from "../../model/ParkingTicket";
import { PaymentStrategy } from "./PaymentStrategy";

export class CardPaymentStrategy implements PaymentStrategy {
  pay(fee: number, ticket: ParkingTicket): boolean {
    console.log(`Paid ₹${fee} for ticket ${ticket.ticketId} via Card`);
    return true;
  }
}
