import { useCinema } from '../usecontext/CinemaContext';
import { money } from '../utils/formatters';

export default function Bookings() {
  const { state } = useCinema();
  return <section id="my-bookings" className="mx-auto max-w-7xl scroll-mt-24 px-5 pb-16 sm:px-8"><div className="mb-5"><p className="text-xs font-bold uppercase tracking-[.22em] text-cinema-gold">Your tickets</p><h2 className="mt-2 text-2xl font-extrabold">My bookings</h2></div>
    {state.bookings.length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{[...state.bookings].reverse().map((booking) => <article key={booking.reference} className="rounded-2xl border border-white/10 bg-cinema-panel/70 p-4"><div className="flex items-start justify-between gap-3"><div><p className="text-sm font-bold">{booking.movieTitle}</p><p className="mt-1 text-xs text-slate-400">{booking.showtime} · {booking.city}</p></div><span className="rounded-md bg-cinema-gold/10 px-2 py-1 text-[10px] font-bold text-cinema-gold">{booking.seats.length} SEAT{booking.seats.length === 1 ? '' : 'S'}</span></div><div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3"><span className="font-mono text-xs text-slate-500">{booking.reference}</span><span className="text-sm font-bold">{money(booking.total)}</span></div></article>)}</div> : <p className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-slate-500">Your demo tickets will appear here after you complete a booking.</p>}
  </section>;
}
