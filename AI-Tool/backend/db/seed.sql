INSERT INTO events (title, category, venue, city, event_date, description, image_url, base_price, capacity)
SELECT * FROM (VALUES
 ('Neon Nights Music Festival', 'Music', 'Arena Stadium', 'Lahore', NOW() + INTERVAL '14 days',
  'An unforgettable live music experience with artists, lights, and a high-energy crowd.',
  'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&w=1200&q=80', 3500, 60),
 ('Champions League Final', 'Sports', 'City Sports Ground', 'Lahore', NOW() + INTERVAL '21 days',
  'Catch the big match live with an electric stadium atmosphere.',
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1200&q=80', 2500, 60),
 ('Future Tech Summit', 'Conference', 'Expo Convention Centre', 'Lahore', NOW() + INTERVAL '30 days',
  'A full day of technology talks, networking, and product showcases.',
  'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80', 1800, 60)
) AS v(title, category, venue, city, event_date, description, image_url, base_price, capacity)
WHERE NOT EXISTS (SELECT 1 FROM events);

INSERT INTO seats (event_id, seat_label, seat_type)
SELECT e.id, chr(65 + r.row_num) || lpad(s.seat_num::text, 2, '0'),
       CASE WHEN s.seat_num <= 2 OR s.seat_num >= 9 THEN 'premium' ELSE 'standard' END
FROM events e
CROSS JOIN generate_series(0, 5) AS r(row_num)
CROSS JOIN generate_series(1, 10) AS s(seat_num)
WHERE NOT EXISTS (SELECT 1 FROM seats WHERE event_id = e.id);
