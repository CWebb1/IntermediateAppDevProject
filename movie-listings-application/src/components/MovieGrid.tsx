import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import { getMoviesByCategory, MovieCategory, Movie } from "../utiles/api";

interface MovieGridProps {
  category: MovieCategory;
}

// Reusable components for UI states
const LoadingState = () => (
  <div className="flex justify-center items-center min-h-[300px]">
    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
  </div>
);

const ErrorState = ({ message }: { message: string }) => (
  <div className="bg-red-100 text-red-800 p-4 rounded-md text-center">
    {message}
  </div>
);

const EmptyState = () => (
  <div className="text-center p-4">No movies found for this category.</div>
);

export default function MovieGrid({ category }: MovieGridProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getMoviesByCategory(category);
        setMovies(data);
      } catch (err) {
        setError("Failed to load movies. Please try again later.");
        console.error("Error fetching movies:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [category]);

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!movies || movies.length === 0) return <EmptyState />;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {movies.map((movie) => (
        <MovieCard
          key={movie.id}
          title={movie.title || movie.name || "Unknown Title"}
          description={movie.overview || "No description available"}
          posterPath={movie.poster_path || ""}
          releaseDate={movie.release_date || movie.first_air_date || "Unknown Date"}
        />
      ))}
    </div>
  );
}
