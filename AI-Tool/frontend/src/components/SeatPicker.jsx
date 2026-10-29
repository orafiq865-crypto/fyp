import { getBookedSeats, getBookingKey, getSelectedCinema, useCinema } from '../usecontext/CinemaContext';
import { STANDARD_PRICE, VIP_PRICE } from '../cinemaData';
import { money } from '../utils/formatters';

export default function SeatPicker() {
  const { state, dispatch, movies } = useCinema();
  const movie = movies.find((item) => item.id === state.selectedMovieId) || movies[0];
  const cinema = getSelectedCinema(state);
  const bookingKey = getBookingKey(state, movie, cinema);
  const bookedSeats = getBookedSeats(state, bookingKey);
  const total = state.selectedSeats.reduce((sum, label) => sum + (label.charCodeAt(0) - 65 < 2 ? VIP_PRICE : STANDARD_PRICE), 0);

  return <section id="seat-booking" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-14 sm:px-8 sm:py-20">
    <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[.22em] text-cinema-gold">Your night, your seat</p><h2 className="mt-2 text-3xl font-extrabold sm:text-4xl">Choose your seats</h2><p className="mt-2 text-sm text-slate-400">Select a movie and showtime, then pick your seats on the map.</p></div>
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="rounded-3xl border border-white/10 bg-cinema-panel/80 p-5 sm:p-8">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-xs font-semibold text-slate-400">MOVIE<select className="booking-select mt-2 w-full" value={state.selectedMovieId} onChange={(event) => dispatch({ type: 'SELECT_MOVIE', movieId: event.target.value })}>{movies.map((item) => <option key={item.id} value={item.id}>{item.title}</option>)}</select></label>
          <label className="text-xs font-semibold text-slate-400">SHOWTIME<select className="booking-select mt-2 w-full" value={state.selectedShowtime} onChange={(event) => dispatch({ type: 'SELECT_SHOWTIME', showtime: event.target.value })}>{movie.showtimes.map((time) => <option key={time} value={time}>{time}</option>)}</select></label>
        </div>
        <div className="mx-auto mb-9 mt-10 max-w-xl"><div className="screen-glow"></div><div className="screen-label">SCREEN</div></div>
        <div className="mb-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-slate-400"><span className="flex items-center gap-2"><i className="seat-key available"/> Standard · Rs 1,200</span><span className="flex items-center gap-2"><i className="seat-key vip"/> VIP · Rs 2,000</span><span className="flex items-center gap-2"><i className="seat-key selected"/> Selected</span><span className="flex items-center gap-2"><i className="seat-key booked"/> Booked</span></div>
        <div className="mx-auto max-w-[550px] overflow-x-auto pb-2">{Array.from({ length: 5 }, (_, row) => {
          const rowLetter = String.fromCharCode(65 + row);
          return <div className="seat-row" key={rowLetter}><span className="row-label">{rowLetter}</span>{Array.from({ length: 8 }, (_, col) => {
            const label = `${rowLetter}${col + 1}`;
            const isBooked = bookedSeats.has(label);
            const isSelected = state.selectedSeats.includes(label);
            const isVip = row < 2;
            const classes = ['seat', isVip ? 'vip' : '', isSelected ? 'selected' : '', isBooked ? 'booked' : ''].filter(Boolean).join(' ');
            return <button key={label} className={classes} disabled={isBooked} onClick={() => dispatch({ type: 'TOGGLE_SEAT', seat: label })} aria-pressed={isSelected} aria-label={`Seat ${label}, ${isBooked ? 'booked' : isSelected ? 'selected' : isVip ? 'VIP available' : 'standard available'}`} title={`${label} · ${isBooked ? 'Booked' : money(isVip ? VIP_PRICE : STANDARD_PRICE)}`}>{col + 1}</button>;
          })}</div>;
        })}</div>
        <p className="mt-6 text-center text-xs text-slate-500">Demo seat availability. Final availability should be confirmed by the cinema.</p>
      </div>
      <aside className="h-fit rounded-3xl border border-white/10 bg-cinema-panel p-6 lg:sticky lg:top-24">
        <h3 className="text-xl font-extrabold">Your booking</h3><p className="mt-2 text-sm font-semibold text-slate-300">{movie.title}</p><p className="mt-1 text-xs text-slate-500">{state.selectedShowtime} · {cinema.city} · {cinema.name}</p>
        <div className="my-5 border-t border-white/10"></div><div className="flex justify-between text-sm text-slate-400"><span>Selected seats</span><span>{state.selectedSeats.length}</span></div>
        <p className="mt-2 min-h-5 text-xs text-slate-500">{state.selectedSeats.length ? [...state.selectedSeats].sort().join(', ') : 'Choose a seat to get started.'}</p>
        <div className="mt-5 flex justify-between border-t border-white/10 pt-4 font-bold"><span>Total</span><span className="text-cinema-gold">{money(total)}</span></div>
        <button id="checkout-open" onClick={() => dispatch({ type: 'OPEN_CHECKOUT' })} disabled={!state.selectedSeats.length} className="mt-6 w-full rounded-xl bg-cinema-gold px-4 py-3.5 text-sm font-extrabold text-black transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40">Proceed to checkout <span aria-hidden="true">→</span></button><p className="mt-3 text-center text-[11px] leading-5 text-slate-500">Demo checkout only. No payment will be taken.</p>
      </aside>
    </div>
  </section>;
}
