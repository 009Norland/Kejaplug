import React, { useState } from 'react';

interface PropertyDetailsProps {
  property: any;
  onBack: () => void;
  onInterest: (propertyTitle: string) => void;
}

const PropertyDetails: React.FC<PropertyDetailsProps> = ({ property, onBack, onInterest }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Safely get landlord info with fallbacks
  const landlordName = property.landlord?.name || property.landlordId?.name || 'Property Owner';
  const landlordPhone = property.landlord?.phone || property.landlordId?.phone || '+254700000000';
  const landlordWhatsapp = property.landlord?.whatsapp || property.landlordId?.whatsapp || '254700000000';
  const landlordVerified = property.landlord?.isVerified || property.landlordId?.isVerified || false;
  const landlordJoinedDate = property.landlord?.joinedDate || property.landlordId?.joinedDate || 'Recently';

  const images = property.images || ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'];
  const amenities = property.amenities || [];
  const nearbyPlaces = property.nearbyPlaces || [];
  const reviews = property.reviews || [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-stone-600 hover:text-orange-700 font-bold mb-6 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to listings
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="relative rounded-3xl overflow-hidden bg-stone-100">
            <img
              src={images[currentImageIndex]}
              alt={property.title}
              className="w-full h-96 object-cover"
            />
            
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentImageIndex ? 'bg-white w-8' : 'bg-white/50'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Gallery */}
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.slice(0, 4).map((img, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`rounded-xl overflow-hidden border-2 transition-all ${
                    index === currentImageIndex ? 'border-orange-600' : 'border-stone-200'
                  }`}
                >
                  <img src={img} alt={`${property.title} ${index + 1}`} className="w-full h-24 object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-stone-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span className="font-bold">{property.location.estate}, {property.location.city}</span>
                </div>
              </div>
              <div className="bg-orange-50 px-6 py-3 rounded-2xl">
                <div className="text-orange-700 font-black text-3xl">KES {property.price.toLocaleString()}</div>
                <div className="text-stone-500 text-sm font-bold text-center">/month</div>
              </div>
            </div>

            <div className="inline-block bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-black uppercase tracking-wider mb-6">
              {property.type}
            </div>

            <div className="prose max-w-none mb-6">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-3">Description</h3>
              <p className="text-stone-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Key Details */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-stone-50 p-4 rounded-xl">
                <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-1">Rent</div>
                <div className="text-stone-900 font-bold text-lg">KES {property.price.toLocaleString()}</div>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl">
                <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-1">Deposit</div>
                <div className="text-stone-900 font-bold text-lg">KES {property.deposit.toLocaleString()}</div>
              </div>
              <div className="bg-stone-50 p-4 rounded-xl">
                <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-1">Status</div>
                <div className="text-green-600 font-bold text-lg">{property.status || 'Available'}</div>
              </div>
            </div>

            {/* Amenities */}
            {amenities.length > 0 && (
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {amenities.map((amenity, index) => (
                    <div key={index} className="flex items-center gap-2 text-stone-700">
                      <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="font-bold text-sm">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Nearby Places */}
          {nearbyPlaces.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100">
              <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Nearby Places</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {nearbyPlaces.map((place, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
                    <div className="text-2xl">
                      {place.type === 'school' && '🏫'}
                      {place.type === 'hospital' && '🏥'}
                      {place.type === 'shopping' && '🛒'}
                      {place.type === 'transport' && '🚌'}
                    </div>
                    <div>
                      <div className="font-bold text-stone-900">{place.name}</div>
                      <div className="text-sm text-stone-500">{place.distance}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Landlord Info & Contact */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-stone-100 sticky top-8">
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-6">Contact Landlord</h3>
            
            {/* Landlord Profile */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-stone-100">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-700 font-bold text-2xl">
                  {landlordName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <div className="font-bold text-lg text-stone-900">{landlordName}</div>
                {landlordVerified && (
                  <div className="flex items-center gap-1 text-green-600 text-sm font-bold">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified Owner
                  </div>
                )}
                <div className="text-stone-500 text-sm">Joined {landlordJoinedDate}</div>
              </div>
            </div>

            {/* Contact Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => onInterest(property.title)}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg"
              >
                Express Interest
              </button>
              
              <a
                href={`tel:${landlordPhone}`}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Landlord
              </a>
              
              <a
                href={`https://wa.me/${landlordWhatsapp}?text=Hi, I'm interested in ${encodeURIComponent(property.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
            </div>

            {/* Property ID */}
            <div className="mt-6 pt-6 border-t border-stone-100">
              <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-1">Property ID</div>
              <div className="text-stone-600 text-sm font-mono">{property._id || property.id}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetails;