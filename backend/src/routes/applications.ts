import express, { Request, Response } from 'express';
import { authMiddleware } from '../middleware/auth';
import Property from '../models/property';
import Notification from '../models/notification.model';

const router = express.Router();

// Submit application (tenant expresses interest)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.type !== 'tenant') {
      return res.status(403).json({ message: 'Only tenants can submit applications' });
    }

    const { propertyId, message } = req.body;
    
    // Get the property to find the landlord
    const property = await Property.findById(propertyId);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Notify ONLY the landlord who owns this property
    await Notification.create({
      userId: property.landlordId,
      title: 'New Application!',
      message: `${user.name || 'A tenant'} is interested in "${property.title}"`,
      type: 'application', // Important: different type from 'new_listing'
      isRead: false,
    });

    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;