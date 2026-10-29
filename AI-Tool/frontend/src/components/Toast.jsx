import { useEffect } from 'react';
import { useCinema } from '../usecontext/CinemaContext';

export default function Toast() {
  const { state, dispatch } = useCinema();
  useEffect(() => {
    if (!state.toast) return undefined;
    const timer = window.setTimeout(() => dispatch({ type: 'SET_TOAST', message: '' }), 3600);
    return () => window.clearTimeout(timer);
  }, [dispatch, state.toast]);
  if (!state.toast) return null;
  return <div className="toast" role="status">{state.toast}</div>;
}
