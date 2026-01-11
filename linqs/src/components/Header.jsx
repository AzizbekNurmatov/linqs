import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import EventForm from './EventForm';
import Logout from './Logout';
import toast from 'react-hot-toast';

function Header({ onAddEvent, onOpenSavedEvents }) {
  const [showForm, setShowForm] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle Create Event button click with auth check
  const handleCreateEventClick = () => {
    // Check if user is logged in
    if (!user) {
      // Show toast notification
      toast.error('Please log in to create an event.');
      // Redirect to login page
      navigate('/login');
      return;
    }
    // If logged in, open the form
    setShowForm(true);
  };

  return (
    <>
      {/* Floating Navbar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 max-w-5xl w-[90%] h-16 rounded-full bg-white/90 backdrop-blur-md border border-gray-200 shadow-xl z-50">
        <nav className="flex items-center justify-between px-6 h-full">
          {/* Left: Brand */}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-gradient-to-r from-indigo-500 to-rose-400"></div>
            <Link to="/" className="font-bold text-2xl tracking-tighter text-slate-800">
              Linqs
            </Link>
          </div>

          {/* Center: Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/explore' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/community' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors duration-200 ${
                location.pathname === '/about' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              About
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4">
            {/* Auth Links (Hidden on Mobile) */}
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-4">
                    <span className="text-sm text-slate-600">
                      {user.email?.split('@')[0]}
                    </span>
                    <Logout />
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="hidden md:block text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200"
                  >
                    Login
                  </Link>
                )}
              </>
            )}

            {/* Saved Events Button */}
            {onOpenSavedEvents && (
              <button
                onClick={onOpenSavedEvents}
                className="text-slate-600 hover:text-indigo-600 transition-colors duration-200 p-2 rounded-full hover:bg-slate-100 relative"
                aria-label="View saved events"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" strokeWidth="0">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            )}

            {/* Create Event Button */}
            <button
              onClick={handleCreateEventClick}
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
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-white/95 backdrop-blur-md rounded-3xl border border-gray-200 shadow-xl z-40 md:hidden">
          <nav className="flex flex-col p-4 gap-3">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 py-2 ${
                location.pathname === '/' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-medium transition-colors duration-200 py-2 ${
                location.pathname === '/explore' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-medium transition-colors duration-200 py-2 ${
                location.pathname === '/community' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-medium transition-colors duration-200 py-2 ${
                location.pathname === '/about' 
                  ? 'text-black font-bold' 
                  : 'text-gray-500 hover:text-black'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            {onOpenSavedEvents && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenSavedEvents();
                }}
                className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" strokeWidth="0">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                <span>Saved Events</span>
              </button>
            )}
            {!loading && (
              <>
                {user ? (
                  <>
                    <div className="text-sm text-slate-600 py-2 border-t border-slate-200 pt-3 mt-1">
                      {user.email?.split('@')[0]}
                    </div>
                    <div 
                      className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Logout />
                    </div>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-sm text-slate-600 hover:text-indigo-600 transition-colors duration-200 py-2 border-t border-slate-200 pt-3 mt-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </>
            )}
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
