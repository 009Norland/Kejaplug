import React, { useState } from 'react';
import { CITIES, AMENITIES_LIST } from '../constants';
import { uploadMultipleToCloudinary } from '../services/cloudinary';
import { User } from '../types';
import { CreatePropertyData, propertyService } from '../services/propertyservice';

interface PropertyFormProps {
  onAdd: (propertyData: any) => void;
  currentUser: User;
}

const PropertyForm: React.FC<PropertyFormProps> = ({ onAdd, currentUser }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    deposit: '',
    type: '1 Bedroom',
    city: 'Nairobi',
    estate: '',
    street: '',
    amenities: [] as string[],
    images: [] as string[]
  });

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [dragActive, setDragActive] = useState(false);

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // Transform formData to match CreatePropertyData
    const propertyData: CreatePropertyData = {
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price), // Convert string to number
      deposit: parseInt(formData.deposit || formData.price), // Convert string to number
      type: formData.type,
      location: {
        city: formData.city,
        estate: formData.estate,
        street: formData.street || formData.estate, // Default to estate if street is empty
      },
      amenities: formData.amenities,
      images: formData.images,
    };

    const newProperty = await propertyService.createProperty(propertyData);
    onAdd(propertyData); // Pass the propertyData object to the onAdd function
    refreshProperties(); // Refresh the landlord's properties
  } catch (error) {
    console.error('Failed to add property:', error);
  }

  // Reset form
  setFormData({
    title: '',
    description: '',
    price: '',
    deposit: '',
    type: '1 Bedroom',
    city: 'Nairobi',
    estate: '',
    street: '',
    amenities: [],
    images: [],
  });
};

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles = Array.from(files).filter(file => {
      if (!file.type.startsWith('image/')) {
        alert(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} is too large (max 10MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(`Uploading ${validFiles.length} image(s)...`);

    try {
      const urls = await uploadMultipleToCloudinary(validFiles);
      
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...urls]
      }));

      setUploadProgress(`✓ Successfully uploaded ${validFiles.length} image(s)!`);
      setTimeout(() => setUploadProgress(''), 3000);
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Upload failed: ${error.message}`);
      setUploadProgress('');
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    await processFiles(e.target.files);
    e.target.value = '';
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (uploading) return;
    await processFiles(e.dataTransfer.files);
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-stone-100 p-12">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-3">List Your Property</h1>
        <p className="text-stone-600 mb-12">Connect directly with tenants looking for their next home</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
              Property Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="e.g., Modern 2BR Apartment in Kilimani"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none resize-none"
              placeholder="Describe your property, its features, and what makes it special..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
                Monthly Rent (KES) *
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="45000"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
                Deposit (KES)
              </label>
              <input
                type="number"
                min="0"
                value={formData.deposit}
                onChange={(e) => setFormData({ ...formData, deposit: e.target.value })}
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Same as rent"
              />
            </div>
          </div>

<div>
  <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
    Property Type (e.g., "1 Bedroom", "Studio") *
  </label>
  <input
    type="text"
    className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500"
    value={formData.type}
    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
    placeholder="Enter property type"
  />
</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
                City *
              </label>
              <input
                type="text"
                required
                list="cities-list"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Type or select a city"
              />
              <datalist id="cities-list">
                {CITIES.map(city => (
                  <option key={city} value={city} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
                Estate *
              </label>
              <input
                type="text"
                required
                value={formData.estate}
                onChange={(e) => setFormData({ ...formData, estate: e.target.value })}
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Kilimani"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
                Street
              </label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-4 text-sm font-bold focus:ring-2 focus:ring-orange-500 outline-none"
                placeholder="Kindaruma Road"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
              Amenities
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {AMENITIES_LIST.map(amenity => (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => handleAmenityToggle(amenity)}
                  className={`py-3 px-4 rounded-xl border-2 text-xs font-bold transition-all ${
                    formData.amenities.includes(amenity)
                      ? 'bg-orange-50 border-orange-600 text-orange-900'
                      : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
                  }`}
                >
                  {amenity}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">
              Property Images * (At least 1 required)
            </label>
            
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
                dragActive 
                  ? 'border-orange-500 bg-orange-50' 
                  : uploading 
                    ? 'border-stone-300 bg-stone-50'
                    : 'border-stone-200 hover:border-orange-300'
              }`}
            >
              <input
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleFileSelect}
                disabled={uploading}
                className="hidden"
              />
              
              <label
                htmlFor="file-upload"
                className={`cursor-pointer inline-flex flex-col items-center gap-3 ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                  dragActive ? 'bg-orange-500' : 'bg-orange-50'
                }`}>
                  {uploading ? (
                    <svg className="animate-spin w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className={`w-8 h-8 ${dragActive ? 'text-white' : 'text-orange-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-900">
                    {uploading 
                      ? 'Uploading...' 
                      : dragActive 
                        ? 'Drop images here' 
                        : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-stone-500 mt-1">
                    PNG, JPG, GIF up to 10MB each
                  </p>
                </div>
              </label>
              
              {uploadProgress && (
                <p className={`mt-4 text-sm font-bold ${
                  uploadProgress.includes('✓') ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {uploadProgress}
                </p>
              )}
            </div>

            {formData.images.length > 0 && (
              <div className="mt-6">
                <p className="text-xs font-bold text-stone-600 mb-3">
                  {formData.images.length} image(s) uploaded
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Property ${index + 1}`} 
                        className="w-full h-32 object-cover rounded-xl border-2 border-stone-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity font-bold shadow-lg hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={uploading}
            className="w-full bg-stone-900 hover:bg-orange-700 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading Images...' : 'Publish Property Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PropertyForm;

function refreshProperties() {
  throw new Error('Function not implemented.');
}
