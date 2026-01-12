import mongoose, { Schema } from 'mongoose';
const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['new_listing', 'tenant_interest', 'system'], required: true },
    isRead: { type: Boolean, default: false },
}, { timestamps: true });
export default mongoose.model('Notification', NotificationSchema);
