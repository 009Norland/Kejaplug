import React, { useState } from 'react';
import { authService } from '../services/authservice';
import { User } from '../types';

interface AuthProps {
  onAuthComplete: (user: User, mode: 'login' | 'signup') => void;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onModeChange?: (mode: 'login' | 'signup') => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthComplete, onClose, initialMode = 'login', onModeChange }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);

  React.useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    type: 'tenant' as 'tenant' | 'landlord'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSignupSuccess, setShowSignupSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let user: User;
      
      if (mode === 'login') {
        user = await authService.login({
          email: formData.email,
          password: formData.password
        });
      } else {
        user = await authService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          type: formData.type,
          phone: formData.phone || undefined
        });
        setShowSignupSuccess(true);
        return; // Don't call onAuthComplete yet, wait for user to click login
      }

      onAuthComplete(user, mode);
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showSignupSuccess && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-stone-950/60 backdrop-blur-md p-4">
          <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden border border-orange-100 p-8 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">Sign Up Successful!</h3>
            <p className="text-stone-600 mb-6">Click login to access your account.</p>
            <button
              onClick={() => {
                setShowSignupSuccess(false);
                setMode('login');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-xl transition-all"
            >
              Login
            </button>
          </div>
        </div>
      )}
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stone-950/40 backdrop-blur-md p-4">
        <div className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden border border-orange-100 flex flex-col relative animate-in fade-in zoom-in duration-300">
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-stone-300 hover:text-stone-900 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>

          <div className="p-12 md:p-16 max-h-[80vh] overflow-y-auto">
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
              <div className="relative">
                <input
                  required
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                    </svg>
                  )}
                </button>
              </div>
              {mode === 'signup' && (
                <p className="text-xs text-stone-400 ml-1">Minimum 6 characters</p>
              )}
            </div>

            {mode === 'signup' && (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-stone-400 ml-1">Confirm Password</label>
                <div className="relative">
                  <input
                    required
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full bg-stone-50 border-2 border-stone-100 rounded-2xl p-4 pr-12 focus:ring-2 focus:ring-orange-500 outline-none text-sm font-bold"
                    value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"/>
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

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
    </>
  );
};

export default Auth;