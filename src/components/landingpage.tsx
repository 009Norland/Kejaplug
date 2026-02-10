
import React, { useState } from 'react';

interface LandingPageProps {
  onSearch: (query: string) => void;
  onExplore: () => void;
  onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onSearch, onExplore, onGetStarted }) => {
  const [query, setQuery] = useState('');

  return (
    <div className="relative">
      <section className="relative pt-24 pb-40 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-block mb-6 px-4 py-1.5 bg-orange-100 rounded-full border border-orange-200">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-900">
              Direct from Homeowners • 100% Verified
            </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-serif font-bold text-stone-900 mb-8 tracking-tighter leading-[0.9]">
            The New Way to <br/>
            <span className="text-orange-700 italic">Plug into Keja</span>
          </h1>
          <p className="text-xl text-stone-600 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            Skip the agents. Skip the hidden fees. Find your next rental in Kenya’s best estates through direct, verified connections.
          </p>

          <div className="max-w-3xl mx-auto mb-10">
            <div className="bg-stone-900 p-2.5 rounded-[2.5rem] shadow-2xl shadow-stone-900/30 flex flex-col md:flex-row gap-3 border-4 border-stone-800">
              <div className="flex-grow relative">
                <input 
                  type="text" 
                  placeholder="Search by location, price, or amenities..."
                  className="w-full px-8 py-5 bg-stone-800 border-none focus:ring-2 focus:ring-orange-600 rounded-[2rem] text-white font-semibold placeholder-stone-500 outline-none"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearch(query)}
                />
              </div>
              <button 
                onClick={() => onSearch(query)}
                className="bg-orange-700 text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/20 flex items-center justify-center min-w-[180px] active:scale-95"
              >
                Search
              </button>
            </div>
            <div className="mt-8 flex justify-center gap-8">
                <button onClick={onExplore} className="text-stone-800 font-bold border-b-2 border-orange-700 hover:text-orange-700 transition-colors uppercase tracking-widest text-xs">
                    Browse all vacant homes
                </button>
                <button onClick={onGetStarted} className="text-orange-700 font-bold border-b-2 border-stone-900 hover:text-stone-900 transition-colors uppercase tracking-widest text-xs">
                    Create your profile
                </button>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-orange-100/30 rounded-full blur-[120px] -mr-96 -mt-96"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-stone-200/20 rounded-full blur-[100px] -ml-48 -mb-48"></div>
      </section>

      <section className="bg-stone-900 py-24">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-orange-700 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white shadow-lg">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">No Fake Listings</h3>
                <p className="text-stone-400 text-sm">Every house on KejaPlug is verified through title deeds or physical visits.</p>
            </div>
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-stone-800 rounded-2xl mx-auto mb-6 flex items-center justify-center text-orange-500 shadow-lg border border-stone-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">Zero Broker Fees</h3>
                <p className="text-stone-400 text-sm">Stop paying viewing fees. Deal directly with the landlord for free.</p>
            </div>
            <div className="text-center p-8">
                <div className="w-16 h-16 bg-stone-800 rounded-2xl mx-auto mb-6 flex items-center justify-center text-orange-500 shadow-lg border border-stone-700">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                </div>
                <h3 className="text-xl font-serif font-bold text-white mb-4">Smart Match</h3>
                <p className="text-stone-400 text-sm">Find exactly what you need with our powerful search and filter tools.</p>
            </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
