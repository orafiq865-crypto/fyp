import './cinema.css';
import { CinemaProvider } from './usecontext/CinemaContext';
import Bookings from './components/Bookings';
import CheckoutModal from './components/CheckoutModal';
import CinemaSection from './components/CinemaSection';
import Footer from './components/Footer';
import Header from './components/Header';
import Hero from './components/Hero';
import MovieGrid from './components/MovieGrid';
import Promotions from './components/Promotions';
import SeatPicker from './components/SeatPicker';
import Toast from './components/Toast';

function CinemaApp() {
  return <>
    <Header />
    <main id="top">
      <Hero />
      <MovieGrid />
      <CinemaSection />
      <SeatPicker />
      <Promotions />
      <Bookings />
    </main>
    <Footer />
    <CheckoutModal />
    <Toast />
  </>;
}

export default function App() {
  return <CinemaProvider><CinemaApp /></CinemaProvider>;
}
