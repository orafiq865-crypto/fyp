import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { getBookingKey, getSelectedCinema, useCinema } from '../usecontext/CinemaContext';
import { STANDARD_PRICE, VIP_PRICE } from '../cinemaData';
import { money } from '../utils/formatters';

export default function CheckoutModal() {
  const { state, dispatch, movies } = useCinema();
  const [formKey, setFormKey] = useState(0);
  const movie = movies.find((item) => item.id === state.selectedMovieId) || movies[0];
  const cinema = getSelectedCinema(state);
  const selectedSeats = [...state.selectedSeats].sort();
  const total = selectedSeats.reduce((sum, label) => sum + (label.charCodeAt(0) - 65 < 2 ? VIP_PRICE : STANDARD_PRICE), 0);

  useEffect(() => {
    if (!state.checkoutOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') dispatch({ type: 'CLOSE_CHECKOUT' });
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [dispatch, state.checkoutOpen]);

  useEffect(() => {
    if (!state.checkoutOpen) setFormKey((key) => key + 1);
  }, [state.checkoutOpen]);

  function submitBooking(event) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity() || !state.selectedSeats.length) return;
    const booking = {
      key: getBookingKey(state, movie, cinema),
      movieTitle: movie.title,
      showtime: state.selectedShowtime,
      city: cinema.city,
      cinema: cinema.name,
      seats: selectedSeats,
      total,
      reference: `CP-${Date.now().toString(36).toUpperCase().slice(-5)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
      bookedAt: new Date().toISOString()
    };
    dispatch({ type: 'CONFIRM_BOOKING', booking });
    form.reset();
  }

  if (!state.checkoutOpen) return null;
  return <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="checkout-title" onMouseDown={(event) => { if (event.target === event.currentTarget) dispatch({ type: 'CLOSE_CHECKOUT' }); }}>
    <div className="modal-card">
      <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.2em] text-cinema-gold">Almost at the movies</p><h2 id="checkout-title" className="mt-2 text-2xl font-extrabold">{state.confirmation ? 'Booking confirmed' : 'Complete your booking'}</h2></div><button onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })} className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-xl text-slate-400 hover:text-white" aria-label="Close checkout"><X size={18}/></button></div>
      {state.confirmation ? <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-400/[.06] p-4">
        <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-400/15 text-xl text-emerald-300">✓</span><div><h3 className="font-bold text-emerald-200">Demo booking confirmed</h3><p className="mt-1 text-xs text-slate-400">Your seats are saved in this browser.</p></div></div>
        <div className="mt-5 flex items-center gap-4 rounded-xl bg-black/20 p-3"><div className="ticket-qr" role="img" aria-label="Decorative QR code placeholder, not a scannable ticket"><span>DEMO</span></div><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Booking reference</p><p className="mt-1 break-all font-mono text-sm font-bold text-cinema-gold">{state.confirmation.reference}</p><p className="mt-2 text-xs leading-5 text-slate-400">{state.confirmation.movieTitle}<br/>{state.confirmation.seats.join(', ')} · {money(state.confirmation.total)}</p></div></div>
        <p className="mt-3 text-[10px] leading-4 text-slate-500">Illustrative ticket only. Not valid for entry or payment.</p><button onClick={() => dispatch({ type: 'CLOSE_CHECKOUT' })} className="mt-4 w-full rounded-xl border border-white/10 py-3 text-sm font-bold hover:bg-white/5">Done</button>
      </div> : <>
        <div className="my-5 rounded-2xl border border-white/10 bg-white/[.03] p-4"><p className="font-bold text-white">{movie.title}</p><p className="mt-1 text-xs text-slate-400">{state.selectedShowtime} · {cinema.name}, {cinema.city}</p><p className="mt-2 text-xs text-slate-300">Seats: {selectedSeats.join(', ')}</p><p className="mt-3 flex justify-between border-t border-white/10 pt-3 font-bold"><span>Total</span><span className="text-cinema-gold">{money(total)}</span></p></div>
        <form key={formKey} className="space-y-4" onSubmit={submitBooking}>
          <label className="block text-xs font-semibold text-slate-400">FULL NAME<input name="name" required minLength="2" autoComplete="name" className="form-field mt-2" placeholder="Your name"/></label>
          <label className="block text-xs font-semibold text-slate-400">PHONE NUMBER<input name="phone" required type="tel" inputMode="tel" autoComplete="tel" className="form-field mt-2" placeholder="+92 300 1234567"/></label>
          <label className="block text-xs font-semibold text-slate-400">EMAIL ADDRESS<input name="email" required type="email" autoComplete="email" className="form-field mt-2" placeholder="you@example.com"/></label>
          <button className="w-full rounded-xl bg-cinema-gold px-4 py-3.5 text-sm font-extrabold text-black transition hover:bg-amber-300">Confirm demo booking</button>
          <p className="text-center text-[11px] leading-5 text-slate-500">This prototype does not send your details or collect payment.</p>
        </form>
      </>}
    </div>
  </div>;
}
