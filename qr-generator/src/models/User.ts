import { Schema, model, models, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    password?: string;
    name: string;
    googleId?: string;
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
  }
  
  const UserSchema = new Schema<IUser>({
    email: { 
      type: String, 
      required: true, 
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { 
      type: String, 
      required: false
    },
    name: { 
      type: String, 
      required: true 
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true
    },
    createdAt: { 
      type: Date, 
      default: Date.now 
    }
  });
  
  UserSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    
    try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } catch (error) {
      next(error as Error);
    }
  });
  
  UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    if (!this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  export const User = models.User || model<IUser>('User', UserSchema);