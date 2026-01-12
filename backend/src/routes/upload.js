"use strict";
//import express, { Request, Response } from 'express';
//import { upload } from '../services/cloudinary';
//import { authMiddleware } from '../middleware/auth';
//const router = express.Router();
// Upload single image
//router.post('/single', authMiddleware, upload.single('image'), (req: Request, res: Response) => {
// try {
//  if (!req.file) {
//    return res.status(400).json({ message: 'No file uploaded' });
//  }
// Cloudinary automatically uploads and returns the URL
// const imageUrl = (req.file as any).path;
//res.status(200).json({
//message: 'Image uploaded successfully',
//ur//l: imageUrl,
//});
//} catch (error) {
//console.error('Upload error:', error);
//res.status(500).json({ message: 'Failed to upload image' });
//}
//});
// Upload multiple images (up to 5)
//router.post('/multiple', authMiddleware, upload.array('images', 5), (req: Request, res: Response) => {
//try {
//if (!req.files || (req.files as Express.Multer.File[]).length === 0) {
//return res.status(400).json({ message: 'No files uploaded' });
//}
//const files = req.files as Express.Multer.File[];
//const imageUrls = files.map((file: any) => file.path);
//res.status(200).json({
//message: 'Images uploaded successfully',
//urls: imageUrls,
//});
//} catch (error) {
//console.error('Upload error:', error);
//res.status(500).json({ message: 'Failed to upload images' });
//}
//});
//export default router;
