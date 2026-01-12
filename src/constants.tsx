
import { Property } from './types';

export const CITIES = ['Nairobi', 'Mombasa', 'Kisumu', 'Nakuru', 'Eldoret', 'Thika'];
export const AMENITIES_LIST = [
  'Borehole Water',
  '24/7 Security',
  'Backup Generator',
  'Free WiFi',
  'Parking',
  'Balcony',
  'CCTV',
  'Near Main Road'
];

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Modern 2BR Apartment in Kilimani',
    description: 'Beautifully finished 2-bedroom apartment with ensuite master bedroom. Located in a quiet secure neighborhood with high-speed lifts and borehole water.',
    location: {
      city: 'Nairobi',
      estate: 'Kilimani',
      street: 'Kindaruma Road',
      lat: -1.2951,
      lng: 36.7862
    },
    price: 45000,
    deposit: 45000,
    type: '2 Bedroom',
    amenities: ['24/7 Security', 'Borehole Water', 'Parking', 'CCTV'],
    images: [
      'https://picsum.photos/seed/kil1/800/600',
      'https://picsum.photos/seed/kil2/800/600',
      'https://picsum.photos/seed/kil3/800/600'
    ],
    landlord: {
      id: 'l1',
      name: 'John Kamau',
      isVerified: true,
      phone: '+254712345678',
      whatsapp: '254712345678',
      joinedDate: 'Jan 2023'
    },
    status: 'Available',
    nearbyPlaces: [
      { name: 'Yaya Centre', distance: '1.2km', type: 'shopping' },
      { name: 'The Nairobi Hospital', distance: '2.5km', type: 'hospital' }
    ],
    reviews: [
      { id: 'r1', userName: 'Alice W.', rating: 5, comment: 'Very responsive landlord and great house!', date: '2023-11-12' }
    ]
  },
  {
    id: '2',
    title: 'Spacious Studio (Bedsitter) in Roysambu',
    description: 'Cozy and spacious bedsitter near TRM. Very secure building with constant water supply and separate meter for electricity.',
    location: {
      city: 'Nairobi',
      estate: 'Roysambu',
      street: 'Lumiere Drive',
      lat: -1.2209,
      lng: 36.8858
    },
    price: 15000,
    deposit: 15000,
    type: 'Bedsitter',
    amenities: ['Free WiFi', 'CCTV', 'Near Main Road'],
    images: [
      'https://picsum.photos/seed/roy1/800/600',
      'https://picsum.photos/seed/roy2/800/600'
    ],
    landlord: {
      id: 'l2',
      name: 'Sarah Muthoni',
      isVerified: false,
      phone: '+254722334455',
      whatsapp: '254722334455',
      joinedDate: 'March 2024'
    },
    status: 'Available',
    nearbyPlaces: [
      { name: 'Thika Road Mall (TRM)', distance: '0.4km', type: 'shopping' },
      { name: 'Roysambu Primary', distance: '0.8km', type: 'school' }
    ],
    reviews: []
  },
  {
    id: '3',
    title: 'Luxury 3BR Penthouse in Nyali',
    description: 'Stunning ocean view penthouse with modern fittings and large terrace. Perfectly suited for families looking for quiet luxury.',
    location: {
      city: 'Mombasa',
      estate: 'Nyali',
      street: 'Links Road',
      lat: -4.0321,
      lng: 39.7123
    },
    price: 85000,
    deposit: 85000,
    type: '3 Bedroom',
    amenities: ['Backup Generator', 'Balcony', '24/7 Security', 'Borehole Water'],
    images: [
      'https://picsum.photos/seed/nya1/800/600',
      'https://picsum.photos/seed/nya2/800/600'
    ],
    landlord: {
      id: 'l3',
      name: 'Coastal Properties Ltd',
      isVerified: true,
      phone: '+254700998877',
      whatsapp: '254700998877',
      joinedDate: 'June 2022'
    },
    status: 'Available',
    nearbyPlaces: [
      { name: 'City Mall', distance: '0.5km', type: 'shopping' },
      { name: 'Nyali Beach', distance: '1.0km', type: 'transport' }
    ],
    reviews: []
  }
];
