import { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import { cinemas, movies } from '../cinemaData';

const STORAGE_KEY = 'cinepak-demo-bookings';
const CinemaContext = createContext(null);

function readBookings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(saved) ? saved : [];
  } catch (error) {
    console.error('Unable to read CinePak demo bookings from browser storage.', error);
    return [];
  }
}

const initialState = {
  activeCity: 'All',
  activeCinema: 'all',
  search: '',
  featuredIndex: 0,
  selectedMovieId: movies[0].id,
  selectedShowtime: movies[0].showtimes[1],
  selectedSeats: [],
  checkoutOpen: false,
  confirmation: null,
  toast: '',
  bookings: readBookings()
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_CITY':
      return {
        ...state,
        activeCity: action.city,
        activeCinema: 'all'
      };
    case 'SET_CINEMA': {
      const city = action.cinema === 'all' ? 'All' : action.cinema.split('|')[0];
      return { ...state, activeCity: city, activeCinema: action.cinema };
    }
    case 'SET_SEARCH':
      return { ...state, search: action.value };
    case 'SET_FEATURED':
      return { ...state, featuredIndex: action.index };
    case 'SELECT_MOVIE':
      return {
        ...state,
        selectedMovieId: action.movieId,
        selectedShowtime: action.showtime || movies.find((movie) => movie.id === action.movieId)?.showtimes[0] || '',
        selectedSeats: []
      };
    case 'SELECT_SHOWTIME':
      return { ...state, selectedShowtime: action.showtime, selectedSeats: [] };
    case 'TOGGLE_SEAT': {
      if (state.selectedSeats.includes(action.seat)) {
        return { ...state, selectedSeats: state.selectedSeats.filter((seat) => seat !== action.seat) };
      }
      if (state.selectedSeats.length >= 8) {
        return { ...state, toast: 'You can select up to 8 seats in this demo booking.' };
      }
      return { ...state, selectedSeats: [...state.selectedSeats, action.seat], toast: '' };
    }
    case 'OPEN_CHECKOUT':
      return { ...state, checkoutOpen: true, confirmation: null };
    case 'CLOSE_CHECKOUT':
      return { ...state, checkoutOpen: false };
    case 'CONFIRM_BOOKING':
      return {
        ...state,
        bookings: [...state.bookings, action.booking],
        confirmation: action.booking,
        selectedSeats: []
      };
    case 'SET_TOAST':
      return { ...state, toast: action.message };
    default:
      return state;
  }
}

export function CinemaProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.bookings));
    } catch (error) {
      console.error('Unable to save CinePak demo bookings in browser storage.', error);
      dispatch({ type: 'SET_TOAST', message: 'Booking is confirmed for this session, but could not be saved in this browser.' });
    }
  }, [state.bookings]);

  const value = useMemo(() => ({ state, dispatch, movies, cinemas }), [state]);
  return <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>;
}

export function useCinema() {
  const context = useContext(CinemaContext);
  if (!context) throw new Error('useCinema must be used within a CinemaProvider.');
  return context;
}

export function getSelectedCinema(state) {
  const [city, name] = state.activeCinema === 'all' ? ['Karachi', 'Nueplex Cinemas'] : state.activeCinema.split('|');
  return cinemas.find((cinema) => cinema.city === city && cinema.name === name) || cinemas[0];
}

export function getBookingKey(state, movie, cinema = getSelectedCinema(state)) {
  return `${movie.id}|${state.selectedShowtime}|${cinema.city}|${cinema.name}`;
}

export function getBookedSeats(state, bookingKey) {
  const saved = state.bookings.filter((booking) => booking.key === bookingKey).flatMap((booking) => booking.seats);
  let seed = [...bookingKey].reduce((total, character) => total + character.charCodeAt(0), 0);
  const seeded = [];
  for (let index = 0; index < 40; index += 1) {
    seed = (seed * 9301 + 49297) % 233280;
    if (seed / 233280 < 0.13) seeded.push(`${String.fromCharCode(65 + Math.floor(index / 8))}${(index % 8) + 1}`);
  }
  return new Set([...seeded, ...saved]);
}
