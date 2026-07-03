import React from "react";
import { motion } from "motion/react";
import { Star, Eye, Calendar, Film } from "lucide-react";
import { Movie, Language } from "../types";

export interface MovieCardProps {
  movie: Movie;
  language: Language;
  onClick: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, language, onClick }) => {
  const isAr = language === "ar";
  
  // Choose the best title based on language selection
  const title = isAr 
    ? (movie.titleAr || movie.title) 
    : (movie.titleEn || movie.title);

  const genre = isAr
    ? (movie.genreAr || movie.genre || "منوع")
    : (movie.genreEn || movie.genre || "General");

  // Fallback poster if posterUrl is null or fails
  const posterSrc = movie.posterUrl || "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=600&auto=format&fit=crop";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      whileHover={{ 
        y: -8, 
        scale: 1.03,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      whileTap={{ scale: 0.98 }}
      id={`movie-card-${movie.id}`}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md transition-colors duration-300 hover:border-red-500/40 hover:shadow-[0_20px_35px_-15px_rgba(239,68,68,0.3)] flex flex-col h-full"
    >
      {/* Poster image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <img
          src={posterSrc}
          alt={title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            const parent = target.parentElement!;
            // Replace image with LibyFlix fallback
            parent.innerHTML = `
              <div class="w-full h-full flex items-center justify-center bg-zinc-900 text-xs font-black text-red-600 p-2 text-center">
                ${isAr ? 'ليبيـفليكس' : 'LIBYFLIX'}
              </div>
            `;
          }}
        />

        {/* Floating Category Tag */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-red-500 border border-zinc-850 backdrop-blur-sm">
          <Film className="h-3 w-3 text-red-500" />
          <span>
            {isAr ? (movie.category?.nameAr || movie.category?.name) : (movie.category?.nameEn || movie.category?.name)}
          </span>
        </div>

        {/* Floating Rating Tag */}
        {movie.rating !== null && movie.rating > 0 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button className="w-full rounded-xl bg-red-600 py-2.5 text-center text-xs font-black text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30 cursor-pointer">
            {isAr ? "تشغيل في المتصفح" : "Play in Browser"}
          </button>
        </div>
      </div>

      {/* Meta and content area */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-[11px] text-zinc-400 font-medium mb-1">
          {movie.year && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3 text-zinc-500" />
              {movie.year}
            </span>
          )}
          {movie.year && movie.viewCount > 0 && <span className="text-zinc-700">•</span>}
          {movie.viewCount > 0 && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3 text-zinc-500" />
              {movie.viewCount} {isAr ? "مشاهدة" : "views"}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-sm font-bold text-zinc-100 group-hover:text-red-500 transition-colors mb-2 leading-snug">
          {title}
        </h3>

        {/* Genre / Subtext */}
        <div className="mt-auto pt-2 border-t border-zinc-800/40 flex items-center justify-between text-[11px] text-zinc-500">
          <span className="flex items-center gap-1 max-w-[70%] truncate">
            <Film className="h-3 w-3 text-zinc-600 flex-shrink-0" />
            <span className="truncate">{genre}</span>
          </span>
          {movie.duration && (
            <span className="text-zinc-400 bg-zinc-800/50 px-1.5 py-0.5 rounded text-[10px]">
              {movie.duration} {isAr ? "دقيقة" : "min"}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
