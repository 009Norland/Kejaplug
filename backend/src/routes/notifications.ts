import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import Notification from '../models/notification.model';

const router = express.Router();

// Get notifications for the current user
router.get('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const userId = user.userId;
    const userType = user.type; // Get user type (tenant or landlord)
    
    // Build filter based on user type
    const filter: any = { userId };
    
    if (userType === 'tenant') {
      // Tenants only see new_listing notifications
      filter.type = 'new_listing';
    } else if (userType === 'landlord') {
      // Landlords only see application/interest notifications
      filter.type = { $in: ['application', 'interest'] };
    }
    
    const notifications = await Notification.find(filter).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark notification as read
router.patch('/:id/read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId },
      { isRead: true },
      { new: true }
    );
    
    if (!notification) {
      return res.status(404).json({ message: 'Notification not found' });
    }
    
    res.json(notification);
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark all notifications as read
router.patch('/mark-all-read', authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.userId;
    await Notification.updateMany({ userId, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;