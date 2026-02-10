import express, { Request, Response } from 'express';
import Property from '../models/property';
import { authMiddleware } from '../middleware/auth';
import Notification from '../models/notification.model';
import User from '../models/user'

const router = express.Router();

// Get all properties (public - no auth required)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { city, maxPrice, type, status } = req.query;
    
    const filter: any = { status: status || 'Available' };
    if (city && city !== 'All') filter['location.city'] = city;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (type && type !== 'All') filter.type = type;

    const properties = await Property.find(filter)
      .populate('landlordId', 'name phone email type')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (error) {
    console.error('Get properties error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get property by ID (public)
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('landlordId', 'name phone email type');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (error) {
    console.error('Get property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create property (landlord only)
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (user.type !== 'landlord') {
      return res.status(403).json({ message: 'Only landlords can create properties' });
    }

    const property = new Property({
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      deposit: req.body.deposit || req.body.price,
      type: req.body.type,
      location: req.body.location,
      amenities: req.body.amenities || [],
      images: req.body.images || [],
      landlordId: user.userId,
      status: 'Available'
    });

    await property.save();
     
    // Notify all tenants
    const tenants = await User.find({ type: 'tenant' }); // Assuming `type` identifies tenants
    const notifications = tenants.map((tenant: { _id: any; }) => ({
      userId: tenant._id,
      title: 'New Property Listed!',
      message: `A new property titled "${property.title}" has just been listed.`,
      type: 'new_listing',
      isRead: false,
    }));
    await Notification.insertMany(notifications);
    
    // Populate landlord info before sending response
    await property.populate('landlordId', 'name phone email');
    
    res.status(201).json(property);
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property (landlord only - own properties)
router.put('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlordId.toString() !== user.userId) {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    // Update fields
    property.title = req.body.title || property.title;
    property.description = req.body.description || property.description;
    property.price = req.body.price || property.price;
    property.deposit = req.body.deposit || property.deposit;
    property.type = req.body.type || property.type;
    property.location = req.body.location || property.location;
    property.amenities = req.body.amenities || property.amenities;
    property.images = req.body.images || property.images;
    property.status = req.body.status || property.status;

    await property.save();
    await property.populate('landlordId', 'name phone email');

    res.json(property);
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property (landlord only - own properties)
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.landlordId.toString() !== user.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await property.deleteOne();
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;