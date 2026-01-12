import React from 'react';

interface PropertyCardProps {
  property: any;
  onClick: (id: string) => void;
  isRecommendation?: boolean;
  reasoning?: string;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick, isRecommendation, reasoning }) => {
  // Safely get property ID (handle both _id from MongoDB and id from frontend)
  const propertyId = property._id || property.id;
  
  // Safely get landlord info with fallbacks
  const landlordName = property.landlord?.name || property.landlordId?.name || 'Property Owner';
  const landlordVerified = property.landlord?.isVerified || property.landlordId?.isVerified || false;
  
  return (
    <div 
      onClick={() => onClick(propertyId)}
      className="bg-white rounded-[2.5rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border-2 border-stone-100 hover:border-orange-200 group"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'} 
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {isRecommendation && (
          <div className="absolute top-4 left-4 bg-orange-600 text-white px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider">
            ✨ AI Pick
          </div>
        )}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
          <span className="text-orange-700 font-black text-lg">KES {property.price.toLocaleString()}</span>
          <span className="text-stone-500 text-xs font-bold">/month</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-2 line-clamp-2 group-hover:text-orange-700 transition-colors">
          {property.title}
        </h3>
        
        <p className="text-stone-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        {/* Location */}
        <div className="flex items-center gap-2 text-stone-500 text-sm mb-4">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
          <span className="font-bold">{property.location.estate}, {property.location.city}</span>
        </div>

        {/* Type Badge */}
        <div className="inline-block bg-orange-50 text-orange-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-4">
          {property.type}
        </div>

        {/* Amenities */}
        {property.amenities && property.amenities.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 3).map((amenity: string, index: number) => (
              <span key={index} className="text-xs bg-stone-100 text-stone-600 px-2 py-1 rounded-md font-bold">
                {amenity}
              </span>
            ))}
            {property.amenities.length > 3 && (
              <span className="text-xs text-stone-400 font-bold">+{property.amenities.length - 3} more</span>
            )}
          </div>
        )}

        {/* AI Reasoning */}
        {isRecommendation && reasoning && (
          <div className="bg-orange-50 border-l-4 border-orange-600 p-3 rounded-r-xl mb-4">
            <p className="text-xs text-orange-900 font-bold italic">
              💡 {reasoning}
            </p>
          </div>
        )}

        {/* Landlord Info */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-700 font-bold text-sm">
                {landlordName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-bold text-stone-900">{landlordName}</p>
              {landlordVerified && (
                <p className="text-xs text-green-600 font-bold flex items-center gap-1">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  Verified
                </p>
              )}
            </div>
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onClick(propertyId);
            }}
            className="text-orange-600 hover:text-orange-700 font-bold text-sm"
          >
            View Details →
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;