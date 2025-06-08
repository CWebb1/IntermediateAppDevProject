// Use environment variable instead of hardcoding the API key
const API_KEY = import.meta.env.VITE_API_KEY;

export type MovieCategory = 'trending' | 'top-rated' | 'action' | 'animation' | 'comedy';

export interface MovieResponse {
  results: Movie[];
  page: number;
  total_pages: number;
  total_results: number;
}

export interface Movie {
  id: number;
  title?: string;
  name?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  first_air_date?: string;
}


// Map categories to their corresponding endpoints
const CATEGORY_ENDPOINTS: Record<MovieCategory, string> = {
  'trending': `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}&language=en-US`,
  'top-rated': `https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&language=en-US`,
  'action': `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`,
  'animation': `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16`,
  'comedy': `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`,
};


// Function to fetch data from the API
export const getMoviesByCategory = async (category: MovieCategory): Promise<Movie[]> => {
  try {
    const url = CATEGORY_ENDPOINTS[category];
    if (!url) {
      throw new Error(`Unknown category: ${category}`);
    }

    const data = await fetchFromApi<MovieResponse>(url);
    return data.results.slice(0, 10);
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};


// Generic fetch function to reuse across API calls
const fetchFromApi = async <T,>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
};
