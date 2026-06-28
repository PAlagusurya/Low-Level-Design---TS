export class PaymentFailedException extends Error {
  constructor(ticketId: string) {
    super(`Payment failed for ticket: ${ticketId}. Vehicle cannot exit.`);
    this.name = "PaymentFailedException";
  }
}
