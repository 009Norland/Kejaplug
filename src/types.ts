export type HouseType = 'Bedsitter' | 'Single Room' | '1 Bedroom' | '2 Bedroom' | '3 Bedroom' | 'Mansionette' | 'Apartment';

export interface User {
  id: string;
  name: string;
  email: string;
  type: 'tenant' | 'landlord';
  isVerified?: boolean;
  phone?: string;
  avatar?: string;
  createdAt?: string; // Added for backend compatibility
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: {
    city: string;
    estate: string;
    street: string;
    lat?: number; // Made optional
    lng?: number; // Made optional
  };
  price: number;
  deposit: number;
  type: HouseType | string; // Allow string for flexibility with backend
  amenities: string[];
  images: string[];
  landlord: {
    id: string;
    name: string;
    isVerified: boolean;
    phone: string;
    whatsapp: string;
    joinedDate: string;
  };
  status: 'Available' | 'Occupied' | 'Rented' | 'Under Maintenance'; // Added backend statuses
  nearbyPlaces: {
    name: string;
    distance: string;
    type: 'school' | 'hospital' | 'shopping' | 'transport';
  }[];
  reviews: {
    id: string;
    userName: string;
    rating: number;
    comment: string;
    date: string;
  }[];
}

export interface SearchFilters {
  city: string;
  maxPrice: number;
  type: HouseType | 'All' | string; // Allow any string
  amenities: string[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'tenant_interest' | 'new_listing' | 'system';
  isRead: boolean;
}
