import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

@Injectable()
export default class StripeService {
  private stripe: Stripe;

  constructor(
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2020-08-27',
    });
  }

  public async createCustomer(name: string, email: string) {
    try {
      return this.stripe.customers.create({
        name,
        email
      });
    } catch (err) {
      throw new HttpException(err.message, err.status || err.statusCode);
    }
  }

  public async paymentIntentCreate(amount: number, paymentMethodId: string) {
    try {
      return this.stripe.paymentIntents.create({
        amount,
        payment_method: paymentMethodId,
        currency: 'usd',
        confirmation_method: 'manual',
        confirm: true
      });
    } catch (err) {
      throw new HttpException(err.message, err.status || err.statusCode);
    }
  }

  public async createSource(customerId: string, cardToken: string) {
    try {
      return this.stripe.customers.createSource(
        customerId,
        { source: cardToken })
    } catch (err) {
      throw new HttpException(err.message, err.status || err.statusCode);
    }
  }

  public async confirm3DSCard(payment_intent_id: string) {
    try {
      return this.stripe.paymentIntents.confirm(payment_intent_id);
    } catch (err) {
      throw new HttpException(err.message, err.status || err.statusCode);
    }
  }
}