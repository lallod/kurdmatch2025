
// Interface for payment transaction
export interface Payment {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  date: string;
  status: string;
  method: string;
  planName: string;
  description: string;
  invoiceNumber: string;
  billingAddress?: {
    name: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  cardInfo?: {
    type: string;
    last4: string;
    expiryDate: string;
  };
}
