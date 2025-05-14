import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole = 'admin' | 'teacher';

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    minlength: 3 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    trim: true, 
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 6 
  },
  firstName: { 
    type: String, 
    trim: true 
  },
  lastName: { 
    type: String, 
    trim: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin', 'teacher'], 
    default: 'teacher' 
  }
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre<IUser>('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model<IUser>('User', UserSchema);

export default User;