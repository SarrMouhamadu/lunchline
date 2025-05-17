export interface MenuItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: 'PLAT_PRINCIPAL' | 'ACCOMPAGNEMENT' | 'DESSERT' | 'BOISSON';
  imageUrl?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
} 