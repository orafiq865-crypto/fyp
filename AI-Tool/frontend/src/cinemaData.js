export const cinemas = [
  { city: 'Karachi', name: 'Nueplex Cinemas', area: 'DHA Phase 8', icon: 'KHI' },
  { city: 'Karachi', name: 'Atrium Cinemas', area: 'Saddar', icon: 'KHI' },
  { city: 'Lahore', name: 'Universal Cinemas', area: 'Emporium Mall', icon: 'LHR' },
  { city: 'Lahore', name: 'CineStar', area: 'Township', icon: 'LHR' },
  { city: 'Islamabad', name: 'Centaurus Cineplex', area: 'The Centaurus Mall', icon: 'ISB' }
];

export const movies = [
  {
    id: 'maula-jatt', title: 'The Legend of Maula Jatt', kicker: 'A Pakistani cinematic epic',
    description: 'A fearless warrior. A legendary rivalry. Experience the acclaimed Punjabi action epic on the big screen.',
    genre: 'Action · Drama', duration: '2h 33m', release: '13 Oct 2022', rating: 'PG-13', languages: ['Punjabi', 'Urdu'],
    cities: ['Karachi', 'Lahore', 'Islamabad'],
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1800&q=85',
    poster: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=850&q=85',
    showtimes: ['03:00 PM', '06:30 PM', '09:45 PM'], featured: true
  },
  {
    id: 'joyland', title: 'Joyland', kicker: 'A story that stays with you',
    description: 'A tender, award-winning Pakistani drama about family, longing, and finding room to be yourself.',
    genre: 'Drama · Romance', duration: '2h 6m', release: '18 Nov 2022', rating: 'R', languages: ['Urdu'],
    cities: ['Karachi', 'Lahore'],
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85',
    poster: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=850&q=85',
    showtimes: ['02:30 PM', '05:45 PM', '08:30 PM'], featured: true
  },
  {
    id: 'dune-two', title: 'Dune: Part Two', kicker: 'Return to Arrakis',
    description: 'Destiny rises from the desert in an epic sci-fi adventure made for the biggest screen in town.',
    genre: 'Sci-Fi · Adventure', duration: '2h 46m', release: '1 Mar 2024', rating: 'PG-13', languages: ['English', 'Urdu subtitles'],
    cities: ['Karachi', 'Lahore', 'Islamabad'],
    image: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?auto=format&fit=crop&w=1800&q=85',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=850&q=85',
    showtimes: ['03:15 PM', '07:00 PM', '10:15 PM'], featured: true
  },
  {
    id: 'oppenheimer', title: 'Oppenheimer', kicker: 'The story behind the turning point',
    description: 'A gripping historical drama exploring ambition, discovery, and the consequences of changing the world.',
    genre: 'Drama · History', duration: '3h', release: '21 Jul 2023', rating: 'R', languages: ['English', 'Urdu subtitles'],
    cities: ['Karachi', 'Islamabad'],
    image: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1800&q=85',
    poster: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=850&q=85',
    showtimes: ['02:00 PM', '06:00 PM', '09:30 PM'], featured: false
  },
  {
    id: 'london-nahi-jaunga', title: 'London Nahi Jaunga', kicker: 'Love, laughter, and a long way home',
    description: 'A crowd-pleasing Pakistani romantic comedy full of family, friendship, and big-screen charm.',
    genre: 'Comedy · Romance', duration: '2h 25m', release: '10 Jul 2022', rating: 'PG', languages: ['Urdu', 'Punjabi'],
    cities: ['Karachi', 'Lahore'],
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1800&q=85',
    poster: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=850&q=85',
    showtimes: ['01:45 PM', '05:15 PM', '08:45 PM'], featured: false
  },
  {
    id: 'the-batman', title: 'The Batman', kicker: 'A city on the edge',
    description: 'A dark, atmospheric detective story brings a new take on Gotham to cinemas.',
    genre: 'Action · Crime', duration: '2h 56m', release: '4 Mar 2022', rating: 'PG-13', languages: ['English', 'Urdu subtitles'],
    cities: ['Lahore', 'Islamabad'],
    image: 'https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&w=1800&q=85',
    poster: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=850&q=85',
    showtimes: ['03:30 PM', '07:15 PM', '10:30 PM'], featured: false
  }
];

export const STANDARD_PRICE = 1200;
export const VIP_PRICE = 2000;
