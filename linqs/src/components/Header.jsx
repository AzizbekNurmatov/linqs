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
      {/* Floating Navbar - Neo-Brutalist Command Bar */}
      <header className="fixed top-6 left-1/2 -translate-x-1/2 max-w-5xl w-[90%] h-16 rounded-xl bg-white border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] z-50">
        <nav className="flex items-center h-full">
          {/* Left: Brand */}
          <div className="flex items-center gap-2 px-6 h-full border-r-2 border-black">
            <div className="w-3 h-3 bg-black"></div>
            <Link to="/" className="font-black text-2xl tracking-tighter text-black uppercase">
              Linqs
            </Link>
          </div>

          {/* Center: Navigation Links (Hidden on Mobile) */}
          <div className="hidden md:flex items-center gap-6 px-6 h-full border-r-2 border-black">
            <Link 
              to="/" 
              className={`text-sm font-bold uppercase transition-all duration-200 ${
                location.pathname === '/' 
                  ? 'text-black underline decoration-2 underline-offset-4' 
                  : 'text-black hover:bg-[#FEF08A] hover:no-underline px-2 py-1 -mx-2 -my-1'
              }`}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-bold uppercase transition-all duration-200 ${
                location.pathname === '/explore' 
                  ? 'text-black underline decoration-2 underline-offset-4' 
                  : 'text-black hover:bg-[#FEF08A] hover:no-underline px-2 py-1 -mx-2 -my-1'
              }`}
            >
              Explore
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-bold uppercase transition-all duration-200 ${
                location.pathname === '/community' 
                  ? 'text-black underline decoration-2 underline-offset-4' 
                  : 'text-black hover:bg-[#FEF08A] hover:no-underline px-2 py-1 -mx-2 -my-1'
              }`}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-bold uppercase transition-all duration-200 ${
                location.pathname === '/about' 
                  ? 'text-black underline decoration-2 underline-offset-4' 
                  : 'text-black hover:bg-[#FEF08A] hover:no-underline px-2 py-1 -mx-2 -my-1'
              }`}
            >
              About
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 px-6 h-full flex-1 justify-end">
            {/* Auth Links (Hidden on Mobile) */}
            {!loading && (
              <>
                {user ? (
                  <div className="hidden md:flex items-center gap-4">
                    <span className="text-sm font-bold text-black uppercase">
                      {user.email?.split('@')[0]}
                    </span>
                    <Logout />
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="hidden md:block text-sm font-bold text-black uppercase hover:bg-[#FEF08A] px-2 py-1 -mx-2 transition-colors duration-200"
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
                className="text-black hover:bg-[#FEF08A] transition-colors duration-200 p-2 -mx-2"
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
              className="bg-[#FF69B4] text-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] px-6 py-2.5 font-bold text-sm flex items-center gap-2 active:shadow-none active:translate-y-[2px] transition-all duration-100"
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
              className="md:hidden w-8 h-8 flex items-center justify-center text-black hover:bg-[#FEF08A] transition-colors duration-200"
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
        <div className="fixed top-24 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-white rounded-xl border-[3px] border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] z-40 md:hidden">
          <nav className="flex flex-col p-4 gap-2">
            <Link 
              to="/" 
              className={`text-sm font-bold uppercase transition-all duration-200 py-2 px-2 -mx-2 ${
                location.pathname === '/' 
                  ? 'text-black bg-[#FEF08A]' 
                  : 'text-black hover:bg-[#FEF08A]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/explore" 
              className={`text-sm font-bold uppercase transition-all duration-200 py-2 px-2 -mx-2 ${
                location.pathname === '/explore' 
                  ? 'text-black bg-[#FEF08A]' 
                  : 'text-black hover:bg-[#FEF08A]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/community" 
              className={`text-sm font-bold uppercase transition-all duration-200 py-2 px-2 -mx-2 ${
                location.pathname === '/community' 
                  ? 'text-black bg-[#FEF08A]' 
                  : 'text-black hover:bg-[#FEF08A]'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Community
            </Link>
            <Link 
              to="/about" 
              className={`text-sm font-bold uppercase transition-all duration-200 py-2 px-2 -mx-2 ${
                location.pathname === '/about' 
                  ? 'text-black bg-[#FEF08A]' 
                  : 'text-black hover:bg-[#FEF08A]'
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
                className="text-sm font-bold uppercase text-black hover:bg-[#FEF08A] transition-colors duration-200 py-2 px-2 -mx-2 flex items-center gap-2"
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
                    <div className="text-sm font-bold uppercase text-black py-2 px-2 border-t-2 border-black pt-3 mt-1">
                      {user.email?.split('@')[0]}
                    </div>
                    <div 
                      className="text-sm font-bold uppercase text-black hover:bg-[#FEF08A] transition-colors duration-200 py-2 px-2 -mx-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Logout />
                    </div>
                  </>
                ) : (
                  <Link 
                    to="/login" 
                    className="text-sm font-bold uppercase text-black hover:bg-[#FEF08A] transition-colors duration-200 py-2 px-2 -mx-2 border-t-2 border-black pt-3 mt-1"
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
