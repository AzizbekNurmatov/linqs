import { useState } from 'react';
import EventForm from './EventForm';

function Header({ onAddEvent }) {
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Floating Navbar */}
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl h-16 rounded-full bg-white/80 backdrop-blur-lg border border-white/40 shadow-sm z-50">
        <nav className="flex items-center justify-between px-6 h-full">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-indigo-500 to-rose-400"></div>
            <a href="#" className="font-bold text-2xl tracking-tighter text-slate-800">
              Linqs
            </a>
          </div>

          {/* Center: Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200">
              Home
            </a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200">
              Explore
            </a>
            <a href="#" className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200">
              Community
            </a>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Login Link (Hidden on Mobile) */}
            <a href="#" className="hidden md:block text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200">
              Login
            </a>

            {/* Create Event Button */}
            <button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-indigo-500 to-rose-400 text-white rounded-full px-6 py-2.5 font-bold text-sm flex items-center gap-2 hover:scale-105 active:scale-95 transition-all duration-200 ease-out shadow-lg hover:shadow-xl"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Create Event</span>
              <span className="sm:hidden">Create</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-8 h-8 flex items-center justify-center text-slate-600 hover:text-indigo-600 transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[90%] max-w-6xl bg-white/95 backdrop-blur-lg rounded-3xl border border-white/40 shadow-xl z-40 md:hidden">
          <nav className="flex flex-col p-4 gap-3">
            <a 
              href="#" 
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
            <a 
              href="#" 
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </a>
            <a 
              href="#" 
              className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors duration-200 py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </a>
            <a 
              href="#" 
              className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 border-t border-slate-200 pt-3 mt-1"
              onClick={() => setMobileMenuOpen(false)}
            >
              Login
            </a>
          </nav>
        </div>
      )}

      {/* Event Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <EventForm onAddEvent={onAddEvent} onClose={() => setShowForm(false)} />
          </div>
        </div>
      )}
    </>
  );
}

export default Header;
