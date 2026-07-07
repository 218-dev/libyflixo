import React from "react";
import { motion } from "motion/react";
import { Star, Eye, Calendar, Tv, Heart } from "lucide-react";
import { Movie, Language } from "../types";

import ImageWithFallback from "./ImageWithFallback";

export interface MovieCardProps {
  movie: Movie;
  language: Language;
  onClick: () => void;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, language, onClick, isFavorite = false, onToggleFavorite }) => {
  const isAr = language === "ar";
  
  // Choose the best title based on language selection
  const title = isAr 
    ? (movie.titleAr || movie.title) 
    : (movie.titleEn || movie.title);

  const genre = isAr
    ? (movie.genreAr || movie.genre || "منوع")
    : (movie.genreEn || movie.genre || "General");

  const isMovie = movie.type === 'movie' || (movie.sources && movie.sources.length > 0) || (movie.category?.id?.includes('movie') || false) || (!movie.type && !movie.episodes);

  // Fallback poster if posterUrl is null or fails
  const posterSrc = movie.posterUrl || "https://i.top4top.io/p_3839qx2t30.png";

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
      id={`series-card-${movie.id}`}
      onClick={onClick}
      className="group relative cursor-pointer overflow-hidden rounded-2xl bg-zinc-900/40 border border-zinc-800/60 backdrop-blur-md transition-colors duration-300 hover:border-red-500/40 hover:shadow-[0_20px_35px_-15px_rgba(239,68,68,0.3)] flex flex-col h-full"
    >
      {/* Poster image container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        <ImageWithFallback
          src={posterSrc}
          alt={title}
          referrerPolicy="no-referrer"
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          maxRetries={3}
          fallbackSrc="https://i.top4top.io/p_3839qx2t30.png"
        />

        {/* Floating Category Tag */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
          <div className="flex items-center gap-1.5 rounded-full bg-black/75 px-2.5 py-1 text-[11px] font-medium text-red-500 border border-zinc-850 backdrop-blur-sm">
            <Tv className="h-3 w-3 text-red-500" />
            <span>
              {isAr ? (
                movie.library === 'server2'
                  ? (isMovie ? 'فيلم' : 'مسلسل')
                  : (movie.category?.nameAr || movie.category?.name || (isMovie ? 'فيلم' : 'مسلسل'))
              ) : (
                movie.library === 'server2'
                  ? (isMovie ? 'Movie' : 'Series')
                  : (movie.category?.nameEn || movie.category?.name || (isMovie ? 'Movie' : 'Series'))
              )}
            </span>
          </div>
          {movie.library === 'server2' && (
            <div className="flex items-center gap-1.5 rounded-full bg-blue-600 px-2.5 py-1 text-[10px] font-black text-white border border-blue-500/50 backdrop-blur-sm shadow-lg">
              <span>{isAr ? "سيرفر 2" : "Server 2"}</span>
            </div>
          )}
        </div>

        {/* Floating Rating Tag */}
        {movie.rating !== null && movie.rating > 0 && (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded-full bg-red-600 px-2.5 py-1 text-[11px] font-bold text-white shadow-lg">
            <Star className="h-3 w-3 fill-current" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Floating Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.();
          }}
          className={`absolute bottom-3 right-3 z-20 p-2.5 rounded-xl border backdrop-blur-md transition-all duration-300 hover:scale-110 active:scale-90 shadow-lg cursor-pointer ${
            isFavorite
              ? "bg-red-600 border-red-500 text-white shadow-red-950/20"
              : "bg-black/60 border-zinc-800 text-zinc-400 hover:text-white"
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${isFavorite ? "fill-current" : ""}`} />
        </button>

        {/* Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <button className="w-full rounded-xl bg-red-600 py-2.5 text-center text-xs font-black text-white hover:bg-red-500 transition-colors shadow-lg shadow-red-600/30 cursor-pointer">
            {isMovie ? (isAr ? "مشاهدة الفيلم" : "Watch Movie") : (isAr ? "مشاهدة المسلسل" : "Watch Series")}
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
            <Tv className="h-3 w-3 text-zinc-600 flex-shrink-0" />
            <span className="truncate">{genre}</span>
          </span>
          {movie.duration && (
            <span className="text-zinc-400 bg-zinc-800/50 px-1.5 py-0.5 rounded text-[10px]">
              {isMovie && !isNaN(Number(movie.duration)) ? (
                <>
                  {Math.floor(Number(movie.duration) / 60) > 0 ? `${Math.floor(Number(movie.duration) / 60)}${isAr ? 'س ' : 'h '}` : ''}
                  {Number(movie.duration) % 60 > 0 ? `${Number(movie.duration) % 60}${isAr ? 'د' : 'm'}` : ''}
                </>
              ) : (
                <>{movie.duration} {isAr ? "حلقة" : "eps"}</>
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default MovieCard;
