import React, { useState, useMemo, useEffect } from 'react';
import { Property, SearchFilters, User } from './types';
import { CITIES, AMENITIES_LIST } from './constants';
import Layout from './components/layout';
import PropertyCard from './components/propertycard';
import PropertyDetails from './components/propertydetails';
import PropertyForm from './components/propertyform';
import NotificationCenter from './components/notificationcenter';
import LandingPage from './components/landingpage';
import Auth from './components/auth';
import LandlordDashboard from './components/landlorddashboard';
import { getSmartRecommendations } from './services/service';
import { authService } from './services/authservice';
import { propertyService } from './services/propertyservice';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  date: string;
  type: 'tenant_interest' | 'new_listing' | 'system';
  isRead: boolean;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    city: 'All',
    maxPrice: 100000,
    type: 'All',
    amenities: []
  });

  // Properties from backend
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoadingProperties, setIsLoadingProperties] = useState(false);

  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [aiRecommendations, setAiRecommendations] = useState<{propertyId: string, reasoning: string}[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Load current user on mount
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) setCurrentUser(user);
  }, []);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties();
  }, [filters]);

  const fetchProperties = async () => {
    setIsLoadingProperties(true);
    try {
      const data = await propertyService.getAllProperties({
        city: filters.city,
        maxPrice: filters.maxPrice,
        type: filters.type === 'All' ? undefined : filters.type,
      });
      
      // Map backend properties to frontend format
      const mappedProperties: Property[] = data.map((prop: any) => ({
        id: prop._id,
        title: prop.title,
        description: prop.description,
        location: prop.location,
        price: prop.price,
        deposit: prop.deposit,
        type: prop.type,
        amenities: prop.amenities,
        images: prop.images,
        landlord: {
          id: prop.landlordId?._id || prop.landlordId,
          name: prop.landlordId?.name || 'Property Owner',
          isVerified: true,
          phone: prop.landlordId?.phone || '',
          whatsapp: prop.landlordId?.phone || '',
          joinedDate: new Date(prop.createdAt).toLocaleDateString()
        },
        status: prop.status === 'Available' ? 'Available' : 'Occupied',
        nearbyPlaces: [],
        reviews: []
      }));
      
      setProperties(mappedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setIsLoadingProperties(false);
    }
  };

  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.estate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = filters.city === 'All' || p.location.city === filters.city;
      const matchesPrice = p.price <= filters.maxPrice;
      const matchesType = filters.type === 'All' || p.type === filters.type;
      const matchesAmenities = filters.amenities.every(a => p.amenities.includes(a));
      
      return matchesSearch && matchesCity && matchesPrice && matchesType && matchesAmenities;
    });
  }, [properties, searchQuery, filters]);

  const handleAiSmartSearch = async (query?: string) => {
    const q = query || searchQuery;
    if (!q.trim()) return;
    setIsAiLoading(true);
    setCurrentPage('discover');
    try {
      const propertiesData = properties.map(p => ({
        id: p.id,
        title: p.title,
        price: p.price,
        location: `${p.location.estate}, ${p.location.city}`,
        amenities: p.amenities
      }));
      const result = await getSmartRecommendations(q, JSON.stringify(propertiesData));
      setAiRecommendations(result.recommendations || []);
    } catch (error) {
      console.error("AI Error:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSendInterest = (propertyTitle: string) => {
    if (!currentUser) {
      setAuthMode('login');
      setShowAuth(true);
      return;
    }
    const newNotif: AppNotification = {
      id: Date.now().toString(),
      title: 'Interest Sent',
      message: `You've expressed interest in ${propertyTitle}. The landlord will be notified.`,
      date: 'Just now',
      type: 'system',
      isRead: false
    };
    setNotifications([newNotif, ...notifications]);
    alert("Interest sent! Landlord has been notified.");
  };

  const handlePropertyAdded = (refreshLandlordProperties: () => void) => {
  fetchProperties(); // Refresh global properties list
  refreshLandlordProperties(); // Refresh landlord-specific properties
  setCurrentPage('discover');

  const newNotif: AppNotification = {
    id: Date.now().toString(),
    title: 'Property Listed Successfully! 🎉',
    message: `Your property has been published and is now visible to tenants.`,
    date: 'Just now',
    type: 'new_listing',
    isRead: false,
  };
  setNotifications([newNotif, ...notifications]);
};

  const handleNavigate = (page: string) => {
    // Check if user needs to be logged in
    if ((page === 'list-property' || page === 'notifications') && !currentUser) {
      setAuthMode('login');
      setShowAuth(true);
      return;
    }

    // Block tenants from listing properties
    if (page === 'list-property' && currentUser?.type === 'tenant') {
      alert('Only landlords can list properties. Please create a landlord account.');
      return;
    }

    setCurrentPage(page);
    setSelectedPropertyId(null);
  };

  const handleAuthComplete = (user: User) => {
  setCurrentUser(user);
  setShowAuth(false);
  
  // Both landlords and tenants go to discover
  setCurrentPage('discover');
};

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const renderContent = () => {
    if (selectedPropertyId) {
      const prop = properties.find(p => p.id === selectedPropertyId);
      return prop ? <PropertyDetails property={prop} onBack={() => setSelectedPropertyId(null)} onInterest={handleSendInterest} /> : null;
    }

    switch (currentPage) {
      case 'home':
        return <LandingPage onSearch={handleAiSmartSearch} onExplore={() => setCurrentPage('discover')} onGetStarted={() => { setAuthMode('signup'); setShowAuth(true); }} />;
      
      case 'discover':
  // Show Landlord Dashboard for landlords
  if (currentUser?.type === 'landlord') {
    return (
      <LandlordDashboard
        currentUser={currentUser}
        onAddNew={() => setCurrentPage('list-property')}
        refreshProperties={fetchProperties} // Pass the callback
      />
    );
  }
        
        // Show property discover page for tenants
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col lg:flex-row gap-16">
              <aside className="w-full lg:w-72 shrink-0">
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-stone-100 sticky top-32">
                  <h3 className="text-xl font-serif font-bold text-stone-900 mb-8">Refine Search</h3>
                  <div className="space-y-8">
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">Preferred City</label>
                      <select 
                        className="w-full bg-stone-50 border-2 border-stone-100 rounded-xl p-3 text-sm font-bold focus:ring-2 focus:ring-orange-500 appearance-none"
                        value={filters.city}
                        onChange={(e) => setFilters({...filters, city: e.target.value})}
                      >
                        <option value="All">Everywhere</option>
                        {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-[0.2em] mb-3">Max Budget (KES)</label>
                      <input 
                        type="range" min="5000" max="150000" step="5000"
                        className="w-full accent-orange-700 h-2 bg-stone-100 rounded-lg"
                        value={filters.maxPrice}
                        onChange={(e) => setFilters({...filters, maxPrice: parseInt(e.target.value)})}
                      />
                      <div className="flex justify-between text-[11px] font-black text-stone-900 mt-2">
                        <span>5K</span>
                        <span className="text-orange-700 bg-orange-50 px-2 rounded-md">{filters.maxPrice.toLocaleString()}</span>
                        <span>150K</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => {
                        setFilters({ city: 'All', maxPrice: 150000, type: 'All', amenities: [] });
                        setAiRecommendations([]);
                      }}
                      className="w-full text-[10px] font-black uppercase tracking-widest text-stone-400 hover:text-orange-700 py-4 border-2 border-dashed border-stone-100 rounded-xl transition-all"
                    >
                      Clear Filters
                    </button>
                  </div>
                </div>
              </aside>
              <main className="flex-grow">
                {isLoadingProperties ? (
                  <div className="text-center py-20">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
                    <p className="mt-4 text-stone-600">Loading properties...</p>
                  </div>
                ) : (
                  <>
                    {aiRecommendations.length > 0 && (
                      <div className="mb-16">
                        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-8">KejaPlug Smart Picks</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {aiRecommendations.map(rec => {
                            const prop = properties.find(p => p.id === rec.propertyId);
                            return prop ? (
                              <PropertyCard key={`rec-${prop.id}`} property={prop} onClick={setSelectedPropertyId} isRecommendation={true} reasoning={rec.reasoning} />
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}
                    <h2 className="text-3xl font-serif font-bold text-stone-900 mb-10 pb-6 border-b-2 border-dashed border-stone-100">
                      {filteredProperties.length} Hand-picked Kejas
                    </h2>
                    {filteredProperties.length === 0 ? (
                      <div className="text-center py-20">
                        <p className="text-xl text-stone-600">No properties found matching your criteria.</p>
                        <p className="text-stone-400 mt-2">Try adjusting your filters.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                        {filteredProperties.map(property => (
                          <PropertyCard key={property.id} property={property} onClick={setSelectedPropertyId} />
                        ))}
                      </div>
                    )}
                  </>
                )}
              </main>
            </div>
          </div>
        );
      
      case 'list-property':
        return currentUser ? <PropertyForm onAdd={handlePropertyAdded} currentUser={currentUser} /> : null;
      
      case 'notifications':
        return <NotificationCenter />;
      
      default:
        return null;
    }
  };

  return (
    <>
      <Layout 
        currentUser={currentUser}
        onLogin={() => { setAuthMode('login'); setShowAuth(true); }}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
        notificationCount={notifications.filter(n => !n.isRead).length}
      >
        {renderContent()}
      </Layout>
      {showAuth && (
        <Auth 
          initialMode={authMode} 
          onClose={() => setShowAuth(false)} 
          onAuthComplete={handleAuthComplete} 
        />
      )}
    </>
  );
};

export default App;