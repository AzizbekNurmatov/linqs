import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import SavedEventsDrawer from './SavedEventsDrawer';
import { useEvents } from '../context/EventsContext';

function Layout() {
  const { handleAddEvent } = useEvents();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddEvent={handleAddEvent} onOpenSavedEvents={() => setIsDrawerOpen(true)} />
      <Outlet />
      <SavedEventsDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </div>
  );
}

export default Layout;

