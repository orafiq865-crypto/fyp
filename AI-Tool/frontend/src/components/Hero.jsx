import { useEffect } from 'react';
import { useCinema } from '../usecontext/CinemaContext';

export default function Hero() {
  const { state, dispatch, movies } = useCinema();
  const featured = movies.filter((item) => item.featured);
  const movie = featured[state.featuredIndex % featured.length];

  useEffect(() => {
    const timer = window.setInterval(() => {
      dispatch({ type: 'SET_FEATURED', index: (state.featuredIndex + 1) % featured.length });
    }, 7000);
    return () => window.clearInterval(timer);
  }, [dispatch, featured.length, state.featuredIndex]);

  function selectMovie() {
    dispatch({ type: 'SELECT_MOVIE', movieId: movie.id });
    document.getElementById('seat-booking')?.scrollIntoView({ behavior: 'smooth' });
  }

  return <section className="hero-shell relative isolate min-h-[570px] overflow-hidden sm:min-h-[640px]" aria-label="Featured movies">
    <div className="hero-backdrop absolute inset-0 -z-20" style={{ backgroundImage: `url("${movie.image}")` }}></div>
    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#0B0F19] via-[#0B0F19]/80 to-[#0B0F19]/20"></div>
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0B0F19] via-transparent to-[#0B0F19]/30"></div>
    <div className="mx-auto flex min-h-[570px] max-w-7xl items-center px-5 py-16 sm:min-h-[640px] sm:px-8">
      <div className="max-w-2xl">
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-cinema-gold/30 bg-cinema-gold/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[.2em] text-cinema-gold"><span className="h-2 w-2 animate-pulse rounded-full bg-cinema-gold"></span> Now showing in Pakistan</div>
        <p className="mb-3 text-sm font-bold uppercase tracking-[.24em] text-slate-300">{movie.kicker}</p>
        <h1 className="text-5xl font-black leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">{movie.title}</h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">{movie.description}</p>
        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-300"><span>{movie.genre}</span><span>{movie.duration}</span><span>{movie.release}</span><span className="rounded-md border border-white/20 px-2 py-0.5 text-xs">{movie.rating}</span></div>
        <div className="mt-8 flex flex-wrap items-center gap-3"><button onClick={selectMovie} className="rounded-xl bg-cinema-gold px-6 py-3.5 text-sm font-extrabold text-black transition hover:-translate-y-0.5 hover:bg-amber-300">Book tickets now <span aria-hidden="true">→</span></button><a href="#movies" className="rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold backdrop-blur transition hover:bg-white/10">Explore movies</a></div>
        <div className="mt-10 flex gap-2" aria-label="Choose featured movie">{featured.map((item, index) => <button key={item.id} className="hero-dot" onClick={() => dispatch({ type: 'SET_FEATURED', index })} aria-label={`Show ${item.title}`} aria-current={index === state.featuredIndex}></button>)}</div>
      </div>
      <button onClick={() => dispatch({ type: 'SET_FEATURED', index: (state.featuredIndex + 1) % featured.length })} className="absolute right-5 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-black/30 text-2xl backdrop-blur transition hover:bg-cinema-gold hover:text-black sm:grid" aria-label="Next featured movie">›</button>
      <span className="absolute bottom-8 right-8 hidden text-xs font-semibold tracking-widest text-white/50 md:block">CINEMA, CLOSER.</span>
    </div>
  </section>;
}
