import { ParkingTicket } from "../model";
import { PaymentStrategy } from "../strategy/payment";

export class PaymentService {
  constructor(private strategy: PaymentStrategy) {}

  pay(fee: number, ticket: ParkingTicket): boolean {
    const success = this.strategy.pay(fee, ticket);
    if (!success) {
      console.log(`Payment failed for ticket: ${ticket.ticketId}`);
    }
    return success;
  }
}
