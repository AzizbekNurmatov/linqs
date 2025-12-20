import { Outlet } from 'react-router-dom';
import Header from './Header';
import { useEvents } from '../context/EventsContext';

function Layout() {
  const { handleAddEvent } = useEvents();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header onAddEvent={handleAddEvent} />
      <Outlet />
    </div>
  );
}

export default Layout;

