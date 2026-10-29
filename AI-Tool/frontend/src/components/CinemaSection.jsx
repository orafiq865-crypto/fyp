import { useCinema } from '../usecontext/CinemaContext';

export default function CinemaSection() {
  const { cinemas, dispatch } = useCinema();
  return <section id="cinemas" className="border-y border-white/5 bg-white/[.02]"><div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-[.8fr_1.2fr] md:items-center sm:py-16">
    <div><p className="text-xs font-bold uppercase tracking-[.22em] text-cinema-gold">Your city, your cinema</p><h2 className="mt-2 text-3xl font-extrabold">Find your<br className="hidden md:block"/> perfect screen.</h2><p className="mt-4 max-w-md text-sm leading-6 text-slate-400">From Karachi's Nueplex to Lahore's Universal and Islamabad's Centaurus, choose a cinema that works for you.</p><a href="#movies" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-cinema-gold hover:text-amber-300">Browse showtimes <span aria-hidden="true">→</span></a></div>
    <div className="grid gap-3 sm:grid-cols-2">{cinemas.map((cinema) => <button key={`${cinema.city}|${cinema.name}`} onClick={() => { dispatch({ type: 'SET_CINEMA', cinema: `${cinema.city}|${cinema.name}` }); document.getElementById('movies')?.scrollIntoView({ behavior: 'smooth' }); }} className="cinema-card flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[.025] p-4 text-left"><span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-cinema-gold/10 text-xs font-black text-cinema-gold">{cinema.icon}</span><span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{cinema.name}</span><span className="mt-1 block text-xs text-slate-500">{cinema.area} · {cinema.city}</span></span><span className="text-slate-500" aria-hidden="true">→</span></button>)}</div>
  </div></section>;
}
