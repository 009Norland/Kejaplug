
import React from 'react';
import { User } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentUser: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
  notificationCount: number;
}

const Layout: React.FC<LayoutProps> = ({ children, currentUser, onLogin, onLogout, onNavigate, currentPage, notificationCount }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 glass-effect border-b border-orange-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center cursor-pointer group" onClick={() => onNavigate('home')}>
              <div className="relative flex items-center justify-center bg-stone-900 p-2.5 rounded-2xl mr-3 shadow-xl shadow-stone-950/20 transform group-hover:scale-105 transition-transform duration-500 ease-out">
                <svg className="w-8 h-8 text-orange-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <path 
                    d="M15.05 12.05a2.5 2.5 0 0 1 0 3.536l-1.06 1.06a1 1 0 0 1-1.414 0l-1.06-1.06a1 1 0 0 1 0-1.414l1.06-1.06a2.5 2.5 0 0 1 3.536 0z" 
                    fill="currentColor" 
                    fillOpacity="0.2" 
                    className="text-orange-300"
                  />
                  <path d="M8 11.5a4.5 4.5 0 0 1 4.5-4.5" className="opacity-40" strokeWidth="1.5" />
                  <path d="M17 14.5a4.5 4.5 0 0 1-4.5 4.5" className="opacity-40" strokeWidth="1.5" />
                  <path d="M12 12v0" strokeWidth="4" className="text-white" />
                </svg>
                <div className="absolute inset-0 bg-orange-500/10 rounded-2xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-serif font-black text-stone-900 leading-none tracking-tighter uppercase italic">
                  Keja<span className="text-orange-700 not-italic">Plug</span>
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[8px] font-black tracking-[0.4em] uppercase text-stone-500">Call Direct • 254</span>
                </div>
              </div>
            </div>

            <nav className="hidden md:flex space-x-10">
              <button 
                onClick={() => onNavigate('discover')}
                className={`relative py-2 text-xs font-black uppercase tracking-widest transition-colors ${currentPage === 'discover' ? 'text-orange-800' : 'text-stone-500 hover:text-orange-700'}`}
              >
                Discover
                {currentPage === 'discover' && (
                  <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-orange-700 rounded-full"></span>
                )}
              </button>
              <button 
                onClick={() => onNavigate('list-property')}
                className={`relative py-2 text-xs font-black uppercase tracking-widest transition-colors ${currentPage === 'list-property' ? 'text-orange-800' : 'text-stone-500 hover:text-orange-700'}`}
              >
                Post Keja
                {currentPage === 'list-property' && (
                  <span className="absolute -bottom-1 left-0 w-full h-1.5 bg-orange-700 rounded-full"></span>
                )}
              </button>
              <button 
                onClick={() => onNavigate('notifications')}
                className={`relative py-2 text-xs font-black uppercase tracking-widest transition-colors ${currentPage === 'notifications' ? 'text-orange-800' : 'text-stone-500 hover:text-orange-700'}`}
              >
                Alerts
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-4 flex h-4 w-4 items-center justify-center rounded-full bg-orange-700 text-[9px] font-black text-white shadow-lg border border-white">
                    {notificationCount}
                  </span>
                )}
              </button>
            </nav>

            <div className="flex items-center space-x-5">
              {currentUser ? (
                <div className="flex items-center gap-4">
                  <div className="flex flex-col items-end hidden sm:flex">
                    <span className="text-[10px] font-black uppercase tracking-tighter text-stone-900">{currentUser.name}</span>
                    <button onClick={onLogout} className="text-[8px] font-bold uppercase tracking-widest text-stone-400 hover:text-red-500">Sign Out</button>
                  </div>
                  <div className="w-10 h-10 rounded-2xl bg-stone-900 border-2 border-stone-800 flex items-center justify-center text-orange-500 font-black text-xs shadow-xl rotate-3">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                </div>
              ) : (
                <button
                  onClick={onLogin}
                  className="text-[9px] font-black uppercase tracking-[0.2em] bg-stone-900 text-white py-2.5 px-6 rounded-xl hover:bg-orange-700 transition-all active:scale-95 shadow-lg shadow-stone-900/20"
                >
                  Join / Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">{children}</main>

      <footer className="bg-stone-950 text-stone-500 py-24 border-t-4 border-orange-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-16 text-center md:text-left">
          <div className="col-span-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-8">
               <div className="bg-stone-900 p-2 rounded-xl border border-stone-800">
                  <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 12l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  </svg>
               </div>
               <span className="text-2xl font-serif font-black text-white tracking-tighter uppercase italic">KejaPlug</span>
            </div>
            <p className="text-sm leading-relaxed mb-10 text-stone-400">Directly connecting Kenyans to their next home. No middlemen, no hidden fees. Just direct communication.</p>
            <div className="flex justify-center md:justify-start gap-6">
              {['FB', 'IG', 'LI'].map(social => (
                <span key={social} className="text-[10px] font-black tracking-widest text-stone-600 hover:text-orange-500 cursor-pointer transition-colors">{social}</span>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-serif font-black text-sm mb-8 uppercase tracking-[0.2em]">Listings</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
              <li className="cursor-pointer hover:text-white transition-colors">Westlands</li>
              <li className="cursor-pointer hover:text-white transition-colors">Karen</li>
              <li className="cursor-pointer hover:text-white transition-colors">Ngong Road</li>
              <li className="cursor-pointer hover:text-white transition-colors">Syokimau</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-serif font-black text-sm mb-8 uppercase tracking-[0.2em]">Company</h4>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest">
              <li className="cursor-pointer hover:text-white transition-colors">Our Mission</li>
              <li className="cursor-pointer hover:text-white transition-colors">Trust & Safety</li>
              <li className="cursor-pointer hover:text-white transition-colors">Brand Assets</li>
              <li className="cursor-pointer hover:text-white transition-colors">Support</li>
            </ul>
          </div>
          <div className="bg-stone-900/30 p-8 rounded-[2rem] border border-stone-900">
            <h4 className="text-white font-serif font-black text-sm mb-4 uppercase tracking-[0.2em]">Join the Plug</h4>
            <p className="text-xs font-medium mb-6 text-stone-500">Get fresh vacancies every Friday.</p>
            <div className="flex flex-col gap-3">
              <input type="email" placeholder="EMAIL" className="bg-stone-950 border-stone-800 rounded-xl px-4 py-3 text-[10px] w-full font-black tracking-widest focus:ring-1 focus:ring-orange-700 text-white placeholder-stone-700" />
              <button className="bg-white text-stone-950 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-orange-700 hover:text-white transition-all">Subscribe</button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-20 pt-10 border-t border-stone-900 flex flex-col md:flex-row justify-between items-center text-[9px] font-black uppercase tracking-[0.4em]">
           <span className="text-stone-700">© 2024 KejaPlug Inc • Nairobi, Kenya</span>
           <div className="flex gap-10 mt-6 md:mt-0 text-stone-700">
              <span className="hover:text-white cursor-pointer">Terms</span>
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Cookies</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
