import React, { useState, useEffect } from 'react';
import { propertyAPI } from '../services/api';
import { User } from '../types';

interface LandlordDashboardProps {
  currentUser: User;
  onAddNew: () => void;
  refreshProperties: () => void; 
}

const LandlordDashboard: React.FC<LandlordDashboardProps> = ({ currentUser, onAddNew}) => {
  const [myProperties, setMyProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    loadMyProperties();
  }, []);

  const loadMyProperties = async () => {
    try {
      setLoading(true);
      const allProperties = await propertyAPI.getAll();
      
      // Filter to only show current landlord's properties
      const landlordProperties = allProperties.filter((p: any) => {
        const landlordId = p.landlordId?._id || p.landlordId;
        return landlordId === currentUser.id;
      });
      
      setMyProperties(landlordProperties);
    } catch (error) {
      console.error('Failed to load properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (propertyId: string, propertyTitle: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${propertyTitle}"? This action cannot be undone.`
    );
    
    if (!confirmed) return;

    try {
      setDeletingId(propertyId);
      await propertyAPI.delete(propertyId);
      
      // Remove from local state
      setMyProperties(myProperties.filter(p => p._id !== propertyId));
      
      alert('Property deleted successfully!');
    } catch (error: any) {
      console.error('Failed to delete property:', error);
      alert(`Failed to delete property: ${error.message}`);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStatusChange = async (propertyId: string, newStatus: string) => {
    try {
      await propertyAPI.update(propertyId, { status: newStatus });
      
      // Update local state
      setMyProperties(myProperties.map(p => 
        p._id === propertyId ? { ...p, status: newStatus } : p
      ));
      
      alert(`Property status updated to ${newStatus}!`);
    } catch (error: any) {
      console.error('Failed to update status:', error);
      alert(`Failed to update status: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="text-center py-20">
          <div className="animate-spin w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-stone-600">Loading your properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-serif font-bold text-stone-900 mb-3">My Properties Dashboard</h1>
        <p className="text-stone-600">Manage your property listings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
          <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-2">Total Properties</div>
          <div className="text-3xl font-bold text-stone-900">{myProperties.length}</div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
          <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-2">Available</div>
          <div className="text-3xl font-bold text-green-600">
            {myProperties.filter(p => p.status === 'Available').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
          <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-2">Rented</div>
          <div className="text-3xl font-bold text-orange-600">
            {myProperties.filter(p => p.status === 'Rented' || p.status === 'Occupied').length}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-stone-100">
          <div className="text-stone-400 text-xs font-black uppercase tracking-wider mb-2">Total Value</div>
          <div className="text-2xl font-bold text-stone-900">
            KES {myProperties.reduce((sum, p) => sum + p.price, 0).toLocaleString()}
          </div>
        </div>
      </div>

      {/* Add New Property Button */}
      <div className="mb-8">
        <button
          onClick={onAddNew}
          className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 px-8 rounded-2xl transition-all shadow-lg flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          Add New Property
        </button>
      </div>

      {/* Properties List */}
      {myProperties.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center shadow-lg border border-stone-100">
          <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">No Properties Yet</h3>
          <p className="text-stone-600 mb-6">Start listing your properties to connect with tenants</p>
          <button
            onClick={onAddNew}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
          >
            List Your First Property
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {myProperties.map((property) => (
            <div key={property._id} className="bg-white rounded-3xl overflow-hidden shadow-lg border border-stone-100 hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row">
                {/* Property Image */}
                <div className="md:w-64 h-48 md:h-auto">
                  <img
                    src={property.images?.[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'}
                    alt={property.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Property Details */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-serif font-bold text-stone-900 mb-2">{property.title}</h3>
                      <div className="flex items-center gap-2 text-stone-600 mb-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="text-sm font-bold">{property.location.estate}, {property.location.city}</span>
                      </div>
                      <div className="inline-block bg-orange-50 text-orange-900 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider">
                        {property.type}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-orange-700 font-black text-2xl">KES {property.price.toLocaleString()}</div>
                      <div className="text-stone-500 text-sm">/month</div>
                    </div>
                  </div>

                  <p className="text-stone-600 text-sm mb-4 line-clamp-2">{property.description}</p>

                  {/* Status & Actions */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-100">
                    {/* Status Selector */}
                    <select
                      value={property.status}
                      onChange={(e) => handleStatusChange(property._id, e.target.value)}
                      className={`px-4 py-2 rounded-xl font-bold text-sm border-2 transition-all ${
                        property.status === 'Available'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : property.status === 'Rented' || property.status === 'Occupied'
                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      }`}
                    >
                      <option value="Available">✓ Available</option>
                      <option value="Rented">● Rented</option>
                      <option value="Occupied">● Occupied</option>
                      <option value="Under Maintenance">⚠ Under Maintenance</option>
                    </select>

                    <div className="flex-1"></div>

                    {/* Action Buttons */}
                    <button
                      onClick={() => handleDelete(property._id, property.title)}
                      disabled={deletingId === property._id}
                      className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {deletingId === property._id ? (
                        <>
                          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete
                        </>
                      )}
                    </button>
                  </div>

                  {/* Property Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-stone-100">
                    <div>
                      <div className="text-xs text-stone-400 font-bold uppercase">Images</div>
                      <div className="text-lg font-bold text-stone-900">{property.images?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 font-bold uppercase">Amenities</div>
                      <div className="text-lg font-bold text-stone-900">{property.amenities?.length || 0}</div>
                    </div>
                    <div>
                      <div className="text-xs text-stone-400 font-bold uppercase">Deposit</div>
                      <div className="text-lg font-bold text-stone-900">KES {property.deposit?.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LandlordDashboard;