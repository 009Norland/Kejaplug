import React, { useState } from 'react';
import { authService } from '../services/authservice';
import { User } from '../types';

interface AuthProps {
  onAuthComplete: (user: User) => void;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    type: 'tenant' as 'tenant' | 'landlord'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user: User;
      
      if (mode === 'login') {
        // Login with email and password
        user = await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Register with full details
        user = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          type: formData.type,
          phone: formData.phone || undefined
        });
      }
      
      onAuthComplete(user);
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/40 backdrop-blur-md p-4">
      <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-orange-100 flex flex-col relative animate-in fade-in zoom-in duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-colors z-10"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>

        <div className="p-12 md:p-16">
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-serif font-black text-stone-900 tracking-tighter mb-4">
              {mode === 'login' ? 'Welcome Back' : 'Join the Plug'}
            </h2>
            <p className="text-stone-500 font-medium text-sm">
              {mode === 'login' 
                ? 'Your next home is just a login away.' 
                : 'Create an account to connect directly with owners.'}
            </p>
          </div>

          {error && (
            <div className="mb-8 p-4 bg-red-50 text-red-700 text-xs font-black uppercase tracking-widest rounded-2xl border border-red-100 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Full Name</label>
                <input 
                  required 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Email Address</label>
              <input 
                required 
                type="email" 
                placeholder="john@example.com" 
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Password</label>
              <input 
                required 
                type="password" 
                placeholder="••••••••" 
                minLength={6}
                className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
              {mode === 'signup' && (
                <p className="text-xs text-stone-400 ml-1">Minimum 6 characters</p>
              )}
            </div>

            {mode === 'signup' && (
              <>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Phone Number (Optional)</label>
                  <input 
                    type="tel" 
                    placeholder="0712345678" 
                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">I want to...</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'tenant'})}
                      className={`group flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${formData.type === 'tenant' ? 'bg-orange-50 border-orange-600 shadow-lg' : 'bg-white border-stone-100 hover:border-stone-200'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'tenant' ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${formData.type === 'tenant' ? 'text-orange-900' : 'text-stone-400'}`}>Find Kejas</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({...formData, type: 'landlord'})}
                      className={`group flex flex-col items-center gap-3 p-6 rounded-3xl border-2 transition-all duration-300 ${formData.type === 'landlord' ? 'bg-orange-50 border-orange-600 shadow-lg' : 'bg-white border-stone-100 hover:border-stone-200'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${formData.type === 'landlord' ? 'bg-orange-600 text-white' : 'bg-stone-100 text-stone-400'}`}>
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/></svg>
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${formData.type === 'landlord' ? 'text-orange-900' : 'text-stone-400'}`}>List Kejas</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-stone-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-sm hover:bg-orange-700 transition-all shadow-xl shadow-stone-900/20 active:scale-95 disabled:opacity-50 mt-4"
            >
              {loading ? 'Processing...' : (mode === 'login' ? 'Sign In' : `Start as ${formData.type === 'tenant' ? 'Tenant' : 'Landlord'}`)}
            </button>
          </form>

          <div className="mt-10 text-center">
            <button 
              onClick={() => {
                setMode(mode === 'login' ? 'signup' : 'login');
                setError('');
              }}
              className="text-xs font-bold text-stone-400 hover:text-orange-700 transition-colors uppercase tracking-widest"
            >
              {mode === 'login' ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;