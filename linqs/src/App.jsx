import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Analytics } from '@vercel/analytics/react';
import { EventsProvider } from './context/EventsContext';
import { SavedEventsProvider } from './context/SavedEventsContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import GenreDetail from './pages/GenreDetail';
// Community feature preserved for reference - commented out during pivot to Bulletin Board
// import Community from './pages/Community';
import Board from './pages/Board';
import GroupDetail from './pages/GroupDetail';
import SavedEvents from './pages/SavedEvents';
import About from './pages/About';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <SavedEventsProvider>
          <BrowserRouter>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#2D3436',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="explore/:genre" element={<GenreDetail />} />
              {/* Community route preserved for reference - commented out during pivot to Bulletin Board */}
              {/* <Route path="community" element={<Community />} /> */}
              <Route path="board" element={<Board />} />
              <Route path="group/:id" element={<GroupDetail />} />
              <Route path="saved" element={<SavedEvents />} />
              <Route path="about" element={<About />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Analytics />
        </SavedEventsProvider>
      </EventsProvider>
    </AuthProvider>
  );
}

export default App;
