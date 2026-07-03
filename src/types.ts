export interface MovieSource {
  id: string;
  movieId: string;
  label: string;
  streamUrl: string;
  quality: string | null;
  format: string;
  isExternalServer: boolean;
}

export interface MovieCategory {
  id: string;
  name: string;
  nameAr: string;
  nameEn: string;
  icon: string;
  sortOrder: number;
}

export interface ExternalMetadata {
  cast?: string;
  director?: string;
  country?: string;
  tmdbUrl?: string;
  youtubeTrailer?: string;
}

export interface Movie {
  id: string;
  title: string;
  titleAr: string | null;
  titleEn: string | null;
  description: string | null;
  descriptionAr: string | null;
  descriptionEn: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  year: number | null;
  rating: number | null;
  duration: number | null;
  genre: string | null;
  genreAr: string | null;
  genreEn: string | null;
  viewCount: number;
  sources: MovieSource[];
  category: MovieCategory;
  externalMetadata: ExternalMetadata | null;
}

export type Language = "ar" | "en";
