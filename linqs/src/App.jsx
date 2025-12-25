import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventsProvider } from './context/EventsContext';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';
import GenreDetail from './pages/GenreDetail';
import Community from './pages/Community';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  return (
    <AuthProvider>
      <EventsProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="explore" element={<Explore />} />
              <Route path="explore/:genre" element={<GenreDetail />} />
              <Route path="community" element={<Community />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </EventsProvider>
    </AuthProvider>
  );
}

export default App;
