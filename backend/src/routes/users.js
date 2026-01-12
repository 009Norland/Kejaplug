import express from 'express';
import User from '../models/user';
import { authMiddleware } from '../middleware/auth';
const router = express.Router();
// Get current user profile
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const userData = await User.findById(user.userId).select('-password');
        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userData);
    }
    catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Update user profile
router.put('/me', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const { name, phone } = req.body;
        const userData = await User.findByIdAndUpdate(user.userId, { name, phone }, { new: true }).select('-password');
        res.json(userData);
    }
    catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
export default router;
