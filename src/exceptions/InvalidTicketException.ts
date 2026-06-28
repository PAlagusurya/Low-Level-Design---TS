export class InvalidTicketException extends Error {
  constructor(ticketId: string) {
    super(`Invalid or unknown ticket: ${ticketId}`);
    this.name = "InvalidTicketException";
  }
}
