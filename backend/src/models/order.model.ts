import mongoose, { Document, Schema } from 'mongoose';

// Define order status types
export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

// Define order item interface
export interface IOrderItem {
  menuItemId: mongoose.Types.ObjectId;
  name: string;
  price: number;
  quantity: number;
}

// Define order interface
export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: OrderStatus;
  orderDate: Date;
}

// Order item schema
const OrderItemSchema: Schema = new Schema({
  menuItemId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Menu', 
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  quantity: { 
    type: Number, 
    required: true, 
    min: 1 
  }
});

// Order schema
const OrderSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  items: [OrderItemSchema],
  totalPrice: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'completed', 'cancelled'], 
    default: 'pending' 
  },
  orderDate: { 
    type: Date, 
    default: Date.now, 
    required: true 
  }
}, {
  timestamps: true
});

// Create and export the Order model
const Order = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;