import { useMemo } from 'react';
import { getSelectedCinema, useCinema } from '../usecontext/CinemaContext';
import CityFilters from './CityFilters';

export default function MovieGrid() {
  const { state, dispatch, movies } = useCinema();
  const filtered = useMemo(() => movies.filter((movie) => {
    const city = state.activeCinema === 'all' ? state.activeCity : state.activeCinema.split('|')[0];
    const cityMatches = city === 'All' || movie.cities.includes(city);
    const searchMatches = `${movie.title} ${movie.genre} ${movie.languages.join(' ')}`.toLowerCase().includes(state.search.toLowerCase());
    return cityMatches && searchMatches;
  }), [movies, state.activeCity, state.activeCinema, state.search]);
  const cinema = getSelectedCinema(state);
  const location = state.activeCinema === 'all'
    ? `${state.activeCity === 'All' ? 'All cities' : state.activeCity} · sample showtimes`
    : `${cinema.city} · ${cinema.name} · sample showtimes`;

  function chooseMovie(movieId, showtime) {
    dispatch({ type: 'SELECT_MOVIE', movieId, showtime });
    document.getElementById('seat-booking')?.scrollIntoView({ behavior: 'smooth' });
  }

  return <section id="movies" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.22em] text-cinema-gold">The big screen awaits</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Now showing</h2><p className="mt-2 text-sm text-slate-400">Pick a film, choose a showtime, and make it a movie night.</p></div><CityFilters/></div>
    <p className="mb-5 text-xs font-semibold text-slate-500">{location}</p>
    {filtered.length ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((movie) => <article key={movie.id} className="movie-card overflow-hidden rounded-2xl border border-white/10 bg-cinema-panel/80">
        <div className="relative h-64 overflow-hidden sm:h-72"><img className="poster-image h-full w-full object-cover" src={movie.poster} alt={`Atmospheric cinema artwork for ${movie.title}`} loading="lazy"/><div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-black/5 to-transparent"></div><span className="absolute left-4 top-4 rounded-lg border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-bold backdrop-blur">{movie.rating}</span><span className="absolute right-4 top-4 rounded-lg bg-cinema-gold px-2.5 py-1 text-[10px] font-extrabold text-black">NOW SHOWING</span><div className="absolute inset-x-4 bottom-4"><h3 className="text-xl font-extrabold leading-tight">{movie.title}</h3><p className="mt-1 text-xs text-slate-300">{movie.genre} · {movie.duration}</p></div></div>
        <div className="p-4"><div className="mb-4 flex flex-wrap gap-1.5">{movie.languages.map((language) => <span key={language} className="rounded-md border border-white/10 px-2 py-1 text-[10px] text-slate-400">{language}</span>)}</div><p className="mb-2 text-[10px] font-bold uppercase tracking-[.15em] text-slate-500">Today's showtimes</p><div className="flex flex-wrap gap-2">{movie.showtimes.map((time) => <button key={time} onClick={() => chooseMovie(movie.id, time)} className="showtime-button" aria-label={`Book ${movie.title} at ${time}`}>{time}</button>)}</div><button onClick={() => chooseMovie(movie.id)} className="mt-4 flex w-full items-center justify-between border-t border-white/10 pt-3 text-left text-xs font-bold text-cinema-gold transition hover:text-amber-300">Choose seats <span aria-hidden="true">→</span></button></div>
      </article>)}
    </div> : <p className="rounded-2xl border border-white/10 bg-white/[.03] p-8 text-center text-slate-400">No movies match your search and location. Try another filter.</p>}
  </section>;
}
