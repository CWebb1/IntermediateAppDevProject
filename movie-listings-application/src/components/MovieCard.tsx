import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

// Constants
const POSTER_BASE_URL = "https://image.tmdb.org/t/p/w500";
const FALLBACK_IMAGE = "/placeholder-movie.jpg";

interface MovieCardProps {
  title: string;
  description: string;
  posterPath: string;
  releaseDate: string;
}

const MovieCard = ({ title, description, posterPath, releaseDate }: MovieCardProps) => {
  const imageUrl = posterPath ? `${POSTER_BASE_URL}${posterPath}` : FALLBACK_IMAGE;

  return (
    <Card
      className="flex flex-col overflow-hidden shadow-xl border-2 border-red-700 rounded-xl transition-transform duration-200 hover:scale-105 hover:shadow-2xl"
      style={{
        background: "linear-gradient(135deg, #1a1a1a 60%, #b30000 100%)",
        color: "#fff",
        height: "100%",
      }}
    >
      <div className="relative w-full" style={{ flex: "0 0 auto" }}>
        <img
          src={imageUrl}
          alt={`${title} poster`}
          className="w-full object-cover"
          style={{
            aspectRatio: "2/3",
            borderBottom: "4px solid #b30000",
            display: "block",
            width: "100%",
            height: "auto",
            maxHeight: "350px",
            minHeight: "200px",
            objectFit: "cover",
          }}
          onError={(e) => {
            e.currentTarget.src = FALLBACK_IMAGE;
          }}
        />
        <span
          className="absolute top-2 right-2 bg-red-700 text-xs px-2 py-1 rounded shadow"
          style={{ fontWeight: "bold", letterSpacing: "1px" }}
        >
          {releaseDate}
        </span>
      </div>
      <CardHeader className="py-3 px-4" style={{ flex: "0 0 auto" }}>
        <CardTitle
          className="text-lg font-bold w-full"
          title={title}
          style={{
            color: "#fff",
            textShadow: "1px 1px 6px #b30000, 0 0 2px #000",
            letterSpacing: "0.5px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent
        className="px-4 py-2"
        style={{
          flex: "1 1 0",
          minHeight: 0,
          display: "flex",
          alignItems: "flex-start",
        }}
      >
        <p
          className="text-sm w-full"
          title={description}
          style={{
            color: "#fff",
            textShadow: "0 0 2px #b30000",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 4,
            WebkitBoxOrient: "vertical",
            minHeight: "3em",
            maxHeight: "5.5em",
          }}
        >
          {description || "No description available"}
        </p>
      </CardContent>
      <CardFooter
        className="px-4 pb-4 flex justify-end"
        style={{
          borderTop: "1px solid #b30000",
          flex: "0 0 auto",
        }}
      >
      </CardFooter>
    </Card>
  );
};

export default MovieCard;