import mongoose, { Document, Schema } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  description: string;
  price: number;
  deposit: number;
  type: string;
  location: {
    city: string;
    estate: string;
    street: string;
    lat?: number;
    lng?: number;
  };
  amenities: string[];
  images: string[];
  landlordId: mongoose.Types.ObjectId;
  status: 'Available' | 'Rented' | 'Under Maintenance';
  createdAt: Date;
  updatedAt: Date;
}

const PropertySchema = new Schema<IProperty>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  deposit: {
    type: Number,
    required: true,
    min: 0
  },
  type: {
    type: String,
    required: true
  },
  location: {
    city: { type: String, required: true },
    estate: { type: String, required: true },
    street: { type: String, required: true },
    lat: Number,
    lng: Number
  },
  amenities: [String],
  images: [String],
  landlordId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['Available', 'Rented', 'Under Maintenance'],
    default: 'Available'
  }
}, {
  timestamps: true
});

export default mongoose.model<IProperty>('Property', PropertySchema);