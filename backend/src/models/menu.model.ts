import mongoose, { Document, Schema } from 'mongoose';

export interface IMenuItem {
  _id?: mongoose.Types.ObjectId;
  name: string;
  description?: string;
  price: number;
  category: string;
  isAvailable: boolean;
  createdBy: mongoose.Types.ObjectId;
}

export interface IMenu extends Document {
  items: IMenuItem[];
  date: Date;
}

const MenuItemSchema: Schema = new Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  category: { 
    type: String, 
    required: true, 
    trim: true 
  },
  isAvailable: { 
    type: Boolean, 
    default: true 
  },
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
});

const MenuSchema: Schema = new Schema({
  items: [MenuItemSchema],
  date: { 
    type: Date, 
    default: Date.now, 
    required: true 
  }
}, {
  timestamps: true
});

const Menu = mongoose.model<IMenu>('Menu', MenuSchema);

export default Menu;