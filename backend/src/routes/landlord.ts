import express, { Request, Response } from 'express';
import Property from '../models/property';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all properties for current landlord
router.get('/my-properties', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.type !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can access this' });
    }

    const properties = await Property.find({ landlordId: user.userId })
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error('Get landlord properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property status
router.patch('/properties/:id/status', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const { status } = req.body;

    if (user.type !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can update property status' });
    }

    // Validate status
    if (!['Available', 'Rented', 'Under Maintenance'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlordId.toString() !== user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    property.status = status;
    await property.save();

    res.json({ message: 'Property status updated', property });
  } catch (error) {
    console.error('Update property status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;