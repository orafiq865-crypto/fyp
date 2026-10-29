import { useState } from 'react';
import { Search } from 'lucide-react';
import { useCinema } from '../usecontext/CinemaContext';

export default function Header() {
  const { state, dispatch, cinemas } = useCinema();
  const [mobileOpen, setMobileOpen] = useState(false);
  const cinemaOptions = cinemas.map((cinema) => (
    <option key={`${cinema.city}|${cinema.name}`} value={`${cinema.city}|${cinema.name}`}>
      {cinema.city} · {cinema.name.replace(' Cinemas', '')}
    </option>
  ));

  function chooseCinema(value) {
    dispatch({ type: 'SET_CINEMA', cinema: value });
  }

  return <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0b0f19]/90 backdrop-blur-xl">
    <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-8">
      <a href="#top" className="flex shrink-0 items-center gap-2.5" aria-label="CinePak home">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-cinema-gold text-black"><span className="text-xl">▶</span></span>
        <span className="text-lg font-extrabold tracking-tight sm:text-xl">CINE<span className="text-cinema-gold">PAK</span></span>
      </a>
      <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-300 lg:flex" aria-label="Main navigation">
        <a className="nav-item" href="#movies">Movies</a><a className="nav-item" href="#cinemas">Cinemas</a><a className="nav-item" href="#promotions">Promotions</a><a className="nav-item" href="#my-bookings">My bookings</a>
      </nav>
      <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-3">
        <select value={state.activeCinema} onChange={(event) => chooseCinema(event.target.value)} className="location-select hidden max-w-44 sm:block" aria-label="Choose a cinema">
          <option value="all">All cities</option>{cinemaOptions}
        </select>
        <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 md:flex"><Search className="text-slate-500" size={16}/><input value={state.search} onChange={(event) => dispatch({ type: 'SET_SEARCH', value: event.target.value })} className="w-32 bg-transparent text-sm outline-none placeholder:text-slate-500" placeholder="Search movies" aria-label="Search movies"/></div>
        <button onClick={() => setMobileOpen((open) => !open)} className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 text-xl lg:hidden" aria-label="Toggle navigation" aria-expanded={mobileOpen}>☰</button>
      </div>
    </div>
    {mobileOpen && <div className="border-t border-white/10 px-4 py-3 lg:hidden">
      <nav className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-slate-300" aria-label="Mobile navigation">
        {['Movies', 'Cinemas', 'Promotions', 'My bookings'].map((label) => <a key={label} onClick={() => setMobileOpen(false)} className="nav-item" href={`#${label === 'Movies' ? 'movies' : label === 'My bookings' ? 'my-bookings' : label.toLowerCase()}`}>{label}</a>)}
      </nav>
      <label className="mt-3 block text-xs text-slate-400" htmlFor="mobile-location">Your cinema</label>
      <select id="mobile-location" value={state.activeCinema} onChange={(event) => chooseCinema(event.target.value)} className="location-select mt-1 w-full">
        <option value="all">All cities</option>{cinemaOptions}
      </select>
      <input value={state.search} onChange={(event) => dispatch({ type: 'SET_SEARCH', value: event.target.value })} className="mt-3 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none placeholder:text-slate-500 md:hidden" placeholder="Search movies" aria-label="Search movies"/>
    </div>}
  </header>;
}
