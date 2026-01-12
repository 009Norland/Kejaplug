import mongoose, { Schema } from 'mongoose';
const PropertySchema = new Schema({
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
export default mongoose.model('Property', PropertySchema);
