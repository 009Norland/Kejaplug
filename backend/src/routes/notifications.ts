import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import Notification from '../models/notification.model'; // Import the Notification model

const router = express.Router();

// Get notifications for the current user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user._id; // Assuming `authMiddleware` attaches the user to the request
    const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;