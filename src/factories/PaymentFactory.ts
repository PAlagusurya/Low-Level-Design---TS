import { PaymentMode } from "../enums";
import {
  CardPaymentStrategy,
  CashPaymentStrategy,
  PaymentStrategy,
} from "../strategy/payment";

export class PaymentFactory {
  static getStrategy(mode: PaymentMode): PaymentStrategy {
    switch (mode) {
      case PaymentMode.CASH:
        return new CashPaymentStrategy();
      case PaymentMode.CARD:
        return new CardPaymentStrategy();
      default:
        throw new Error(`Unsupported payment type: ${mode}`);
    }
  }
}
