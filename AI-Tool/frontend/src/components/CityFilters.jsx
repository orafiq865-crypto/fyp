import { useCinema } from '../usecontext/CinemaContext';

export default function CityFilters() {
  const { state, dispatch, cinemas } = useCinema();
  const cities = ['All', ...new Set(cinemas.map((cinema) => cinema.city))];
  return <div className="flex flex-wrap gap-2" role="group" aria-label="Filter movies by city">
    {cities.map((city) => <button key={city} onClick={() => dispatch({ type: 'SET_CITY', city })} className={`rounded-full border px-4 py-2 text-xs font-bold transition ${city === state.activeCity ? 'border-cinema-gold bg-cinema-gold/10 text-cinema-gold' : 'border-white/10 text-slate-400 hover:border-white/30 hover:text-white'}`} aria-pressed={city === state.activeCity}>{city}</button>)}
  </div>;
}
