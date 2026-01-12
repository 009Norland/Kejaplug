import mongoose, { Schema } from 'mongoose';
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['tenant', 'landlord'],
        required: true
    },
    phone: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});
export default mongoose.model('User', UserSchema);
