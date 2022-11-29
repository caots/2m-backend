export interface IntentPaymentEntity {
  status: string;
  next_action: {
    type: string;
  };
  client_secret: string;
  
}