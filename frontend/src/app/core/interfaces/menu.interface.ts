export interface Menu {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MenuCategory {
  id: number;
  name: string;
  description?: string;
} 