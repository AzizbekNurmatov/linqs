import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { EventsProvider } from './context/EventsContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Explore from './pages/Explore';

function App() {
  return (
    <EventsProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<Explore />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </EventsProvider>
  );
}

export default App;
