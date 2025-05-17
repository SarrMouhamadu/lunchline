export interface OpeningHours {
  open: string;
  close: string;
}

export interface PaymentMethods {
  cash: boolean;
  card: boolean;
  mobile: boolean;
}

export interface Notifications {
  email: boolean;
  sms: boolean;
}

export interface Settings {
  restaurantName: string;
  contactEmail: string;
  phone: string;
  address: string;
  openingHours: {
    monday: OpeningHours;
    tuesday: OpeningHours;
    wednesday: OpeningHours;
    thursday: OpeningHours;
    friday: OpeningHours;
    saturday: OpeningHours;
    sunday: OpeningHours;
  };
  deliveryFee: number;
  averageDeliveryTime: number;
  deliveryRadius: number;
  currency: 'EUR' | 'USD' | 'GBP';
  paymentMethods: PaymentMethods;
  notifications: Notifications;
} 