import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Film, Flame, Globe, LayoutGrid, AlertCircle, RefreshCw, 
  ChevronLeft, ChevronRight, Play, Info, Trophy, Tv, Calendar, Clock, Activity, Zap,
  Bell, Sparkles, X, ExternalLink, Eye, Star, Download
} from "lucide-react";
import { Movie, Language } from "./types";
import MovieCard from "./components/MovieCard";

// Bilingual translations for static UI elements
const translations = {
  en: {
    title: "LIBYFLIX",
    portal: "",
    subtitle: "Stream your favorite movies, classics, and releases",
    searchPlaceholder: "Search by title, director, cast...",
    mostViewed: "Most Viewed",
    allMovies: "All Movies",
    categories: "Categories",
    arabicMovies: "Arabic Movies",
    foreignMovies: "Foreign Movies",
    platforms: "Platform Movies",
    rating: "Rating",
    year: "Year",
    duration: "Duration",
    views: "Views",
    watchNow: "Watch Now",
    noMovies: "No movies found. Try another search or category.",
    all: "All",
    loading: "Loading cinematic catalog...",
    backToHome: "Back to Home",
    genre: "Genre",
    playInApp: "Play in Browser",
    featured: "Featured Film",
    popularRightNow: "Popular Right Now",
    exploreByCat: "Explore by Category",
    retry: "Retry Connection",
    apiError: "Could not connect to Libyflix servers. Please check your network or try again.",
    showingResults: "Showing results for",
    clearSearch: "Clear",
    allRightsReserved: "All rights reserved. Streaming servers are provided by external source providers.",
    sortBy: "Sort By",
    sortDefault: "Default",
    sortYear: "Newest Year",
    sortRating: "Highest Rating",
    sortDuration: "Longest Duration",
    
    // Football translations
    footballTitle: "Live Football Matches",
    footballSubtitle: "Today's live match schedule and streaming servers",
    watchMatch: "Watch Match",
    league: "League",
    liveBadge: "LIVE",
    upcomingBadge: "UPCOMING",
    finishedBadge: "FINISHED",
    channel: "Channel",
    noMatches: "No matches scheduled for today."
  },
  ar: {
    title: "ليبيفليكس",
    portal: "",
    subtitle: "بث ومشاهدة أفلامك المفضلة، الكلاسيكيات، وأحدث الإصدارات",
    searchPlaceholder: "ابحث باسم الفيلم، المخرج، الممثلين...",
    mostViewed: "الأكثر مشاهدة",
    allMovies: "جميع الأفلام",
    categories: "الأقسام",
    arabicMovies: "أفلام عربية",
    foreignMovies: "أفلام أجنبية",
    platforms: "أفلام منصات",
    rating: "التقييم",
    year: "السنة",
    duration: "المدة",
    views: "المشاهدات",
    watchNow: "شاهد الآن",
    noMovies: "لم يتم العثور على أفلام. جرب البحث عن كلمة أخرى أو قسم آخر.",
    all: "الكل",
    loading: "جاري تحميل قائمة الأفلام...",
    backToHome: "العودة للرئيسية",
    genre: "التصنيف",
    playInApp: "تشغيل في المتصفح",
    featured: "الفيلم المميز اليوم",
    popularRightNow: "رائج الآن على المنصة",
    exploreByCat: "استكشف حسب القسم",
    retry: "إعادة المحاولة",
    apiError: "فشل الاتصال بسيرفرات ليبيفليكس. يرجى التحقق من الشبكة وإعادة المحاولة.",
    showingResults: "عرض نتائج البحث عن",
    clearSearch: "مسح",
    allRightsReserved: "جميع الحقوق محفوظة. روابط البث مأخوذة من مصادر خارجية تابعة لمزودي الخدمة.",
    sortBy: "ترتيب حسب",
    sortDefault: "الافتراضي",
    sortYear: "أحدث سنة",
    sortRating: "الأعلى تقييماً",
    sortDuration: "الأطول مدة",

    // Football translations
    footballTitle: "مباريات كرة القدم بث مباشر",
    footballSubtitle: "جدول مباريات اليوم ومصادر البث الحي لأهم الدوريات والبطولات",
    watchMatch: "مشاهدة المباراة",
    league: "الدوري",
    liveBadge: "مباشر",
    upcomingBadge: "لم تبدأ",
    finishedBadge: "انتهت",
    channel: "القناة الناقلة",
    noMatches: "لا توجد مباريات مجدولة لليوم."
  }
};

const CATEGORIES = [
  { id: "most-viewed", nameAr: "الأكثر مشاهدة", nameEn: "Most Viewed", library: null },
  { id: "recently-added", nameAr: "المضافة حديثاً", nameEn: "Recently Added", library: null },
  
  // Arabic Section
  { id: "a41d4764-d74e-4df3-a5aa-51e1725fe42e", nameAr: "جميع الأفلام العربية", nameEn: "All Arabic Movies", library: "xui2" },
  { id: "f2716b19-c97c-4c16-addb-fb04563a2343", nameAr: "أفلام السينما العربية", nameEn: "Arabic Cinema Now", library: "xui2" },
  { id: "0f8ed567-2cde-45de-9a13-cafdfeb4c925", nameAr: "أفلام عربية كلاسيكية", nameEn: "Arabic Classic Movies", library: "xui2" },
  { id: "38a1a891-8de3-4b1b-9a93-2f5cff19f26e", nameAr: "مسرحيات عربية ومصرية", nameEn: "Arabic Plays", library: "xui2" },
  { id: "2185cd2d-f379-4584-8caa-5884bced7150", nameAr: "كلاسيكيات عربية (أرشيف)", nameEn: "Arabic Classics (Archive)", library: "xui" },
  { id: "49efe25d-b1ea-4608-b311-90c805df122c", nameAr: "أفلام مدبلجة للعربية", nameEn: "Arabic Dubbed Movies", library: "xui2" },

  // Foreign Section
  { id: "7bd112fc-a3c2-49ab-a3d7-5287ffd1d045", nameAr: "الأفلام الأجنبية العامة", nameEn: "Foreign Movies", library: "xui2" },
  { id: "bc687f7d-61ee-4577-9bbd-b20a56c9d374", nameAr: "أفلام أجنبية منصات", nameEn: "Foreign English Channels", library: "xui2" },
  { id: "9ec354e5-4707-4161-9dab-b51f899b29d8", nameAr: "كلاسيكيات أجنبية (أرشيف)", nameEn: "Foreign Classics (Archive)", library: "xui" },
  { id: "3443bc74-5492-4abb-a8f1-26b15f6bb814", nameAr: "أفلام آسيوية (أرشيف)", nameEn: "Asian Movies (Archive)", library: "xui" },
  { id: "8868c888-9141-4219-a7af-55a22ceb2746", nameAr: "أفلام آسيوية", nameEn: "Asia Movies", library: "xui2" },

  // Indian / Bollywood Section
  { id: "baa2d0f9-19ef-4317-adb6-5ef89ff1448e", nameAr: "أفلام هندية (أرشيف)", nameEn: "Indian Movies (Archive)", library: "xui" },
  { id: "257f6736-a3d8-4c08-b3fc-e415e5cad5be", nameAr: "أفلام هندية (بوليوود)", nameEn: "Indian Movies (IN)", library: "xui2" },
  { id: "34d94e47-e9d9-4e11-a19d-b956ab159f33", nameAr: "أفلام هندية مدبلجة", nameEn: "Indian Hindi Dubbed", library: "xui2" },
  { id: "372d584b-1188-4585-bae9-edc1c18a245e", nameAr: "أفلام هندية بالإنجليزية", nameEn: "Indian Movies (English)", library: "xui2" },
  { id: "11a3404b-3f39-4d53-aee8-8fef1b1605c8", nameAr: "إصدارات هندية جديدة", nameEn: "Indian New Releases", library: "xui2" },
  { id: "19cab6fd-085d-4218-a429-bd2b7ba62eab", nameAr: "أفلام هندية تصوير سينما", nameEn: "Indian Cam Releases", library: "xui2" },
  { id: "6722c954-cb9f-4a83-ad79-885a0021e7f3", nameAr: "أفلام تاميلية", nameEn: "Tamil Movies", library: "xui2" },
  { id: "554dddbd-22e4-4a4e-96a8-4a8723392b8c", nameAr: "أفلام كانادا الهندية", nameEn: "Kannada Movies", library: "xui2" },
  { id: "506e2a38-7c93-4a29-b356-e90bb2954025", nameAr: "أفلام تيلوغو الهندية", nameEn: "Telugu Movies", library: "xui2" },
  { id: "1a1553b9-14db-4c8c-ae9b-ade4eee88c75", nameAr: "أفلام غوجاراتية", nameEn: "Gujarati Movies", library: "xui2" },
  { id: "9d176960-02e0-4c43-8b74-a5fc82f8d331", nameAr: "أفلام بنجابية", nameEn: "Punjabi Movies", library: "xui2" },
  { id: "fa4270c1-51fb-4be3-aea2-f5f08ce3a683", nameAr: "أفلام ماليالام", nameEn: "Malayalam Movies", library: "xui2" },

  // Kids Section
  { id: "a96c50a7-753f-4cb4-93e4-efd160cb51e4", nameAr: "أفلام أطفال بالإنجليزية", nameEn: "English Kids Movies", library: "xui2" },
  { id: "358c4a4c-0dba-4ded-a6e2-1f746caa2cfd", nameAr: "أفلام نتفليكس للأطفال", nameEn: "Netflix Kids", library: "xui2" },
  { id: "4fceae61-def5-421b-81e7-b45c15312c83", nameAr: "أفلام أطفال هندية", nameEn: "Indian Kids Movies", library: "xui2" },

  // Turkish Section
  { id: "641f4158-ba81-4218-b2fc-01c74e21b784", nameAr: "سينما تركية", nameEn: "Turkish Cinema", library: "xui2" },
  { id: "48fb9f1b-c5f6-4ad3-a3c2-cd09737b4cbf", nameAr: "أفلام أطفال تركية", nameEn: "Turkish Kids Movies", library: "xui2" },
  { id: "e1ca4688-cfcc-4655-85a5-22de4714e7f3", nameAr: "أفلام نتفليكس التركية", nameEn: "Turkish Netflix Movies", library: "xui2" },

  // Platforms & Others
  { id: "a70a14e2-7576-4a65-8ac7-a144745345ce", nameAr: "أفلام نتفليكس", nameEn: "Netflix Movies", library: "xui2" },
  { id: "5998a86a-7645-4963-847a-fdb07b4e6ba9", nameAr: "أفلام أمازون", nameEn: "Amazon Movies", library: "xui2" },
  { id: "0f2453ec-da3a-4327-b1d9-ef87704c5957", nameAr: "عروض المصارعة WWE", nameEn: "WWE Shows", library: "xui2" },
  { id: "69e9a8d2-2e75-415c-b5f2-cb87b2171f1c", nameAr: "رياضة وألعاب", nameEn: "Sports", library: "xui" }
];

export default function App() {
  const [language, setLanguage] = useState<Language>("ar");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("most-viewed");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Selection
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);

  // Reset active source when movie selection changes
  useEffect(() => {
    setActiveSourceIndex(0);
  }, [selectedMovie]);
  
  // Hero Slider State
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Islamic Prayer Reminder State
  const [showReminder, setShowReminder] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("libyflix_prayer_reminder_acknowledged") !== "true";
    }
    return true;
  });
  const [countdown, setCountdown] = useState(10);



  const [sortBy, setSortBy] = useState<"default" | "year" | "rating" | "duration">("default");

  // Get sorted movies list based on active sortBy criteria
  const getSortedMovies = () => {
    let sorted = [...movies];
    if (sortBy === "year") {
      sorted.sort((a, b) => (b.year ?? 0) - (a.year ?? 0));
    } else if (sortBy === "rating") {
      sorted.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    } else if (sortBy === "duration") {
      sorted.sort((a, b) => (b.duration ?? 0) - (a.duration ?? 0));
    }
    return sorted;
  };

  const sortedMovies = getSortedMovies();

  const isAr = language === "ar";
  const t = translations[language];

  // Play movie in-page by setting the selectedMovie state
  const playMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  // Fetch movies handler
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    try {
      let url = "";
      
      // 1. If searching, fetch from search endpoint
      if (searchQuery.trim().length > 0) {
        url = `/api/movies?search=${encodeURIComponent(searchQuery)}`;
      } 
      // 2. If most-viewed category
      else if (activeCategory === "most-viewed") {
        url = `/api/movies/most-viewed?limit=18`;
      } 
      // 3. If recently-added category
      else if (activeCategory === "recently-added") {
        url = `/api/movies?page=${page}&limit=24&library=xui2`;
      }
      // 4. Else standard category paginated endpoint
      else {
        const cat = CATEGORIES.find(c => c.id === activeCategory);
        url = `/api/movies?page=${page}&limit=24&categoryId=${activeCategory}&library=${cat?.library || "xui2"}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Failed to receive data from server");
      }
      
      const json = await response.json();
      
      // Process responses (either dynamic paginated object, or straight array)
      if (Array.isArray(json)) {
        setMovies(json);
        setTotalPages(1);
        
        // Fallback to populate slider if empty on first load
        if (activeCategory === "most-viewed" && json.length > 0 && !searchQuery && featuredMovies.length === 0) {
          setFeaturedMovies(json.slice(0, 6));
        }
      } else if (json && Array.isArray(json.data)) {
        setMovies(json.data);
        setTotalPages(json.meta?.totalPages || 1);
      } else {
        setMovies([]);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError(t.apiError);
    } finally {
      setLoading(false);
    }
  };

  // Fetch featured movies specifically from API on mount
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await fetch("/api/movies/most-viewed?limit=6");
        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data)) {
            setFeaturedMovies(data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch featured movies for slider:", error);
      }
    };
    fetchFeatured();
  }, []);

  // Slide rotation timer (auto-transition every 6s)
  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredMovies]);



  // Islamic Prayer Reminder Modal Countdown
  useEffect(() => {
    if (!showReminder) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showReminder]);

  const handleCloseReminder = () => {
    if (countdown === 0) {
      sessionStorage.setItem("libyflix_prayer_reminder_acknowledged", "true");
      setShowReminder(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  // Run query when category, search query, or page changes
  useEffect(() => {
    fetchMovies();
  }, [activeCategory, page]);

  // Handle Search triggers
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
    setSortBy("default");
    // Trigger direct fetch
    setTimeout(() => {
      fetchMovies();
    }, 50);
  };

  // Trigger loading details of first category if category changes
  const selectCategory = (catId: string) => {
    setActiveCategory(catId);
    setSearchQuery(""); // Clear search to prevent conflict
    setPage(1);
    setSortBy("default");
  };

  return (
    <div 
      dir={isAr ? "rtl" : "ltr"} 
      className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-600 selection:text-white font-sans flex flex-col"
    >
      {/* Dynamic Background Backdrop subtle glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-900/80 px-4 py-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Logo / Title */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => selectCategory("most-viewed")}>
            <span className="text-2xl md:text-3xl font-black tracking-tighter text-red-600 font-sans flex items-center gap-1">
              {isAr ? (
                <>
                  <span className="text-white">ليبيـ</span>فليكس
                </>
              ) : (
                <>
                  LIBY<span className="text-white">FLIX</span>
                </>
              )}
            </span>
            <div className="h-5.5 w-[1px] bg-zinc-800 hidden sm:block" />
            <p className="text-[10px] text-zinc-400 font-bold hidden sm:block tracking-wide bg-red-950/30 border border-red-900/30 px-2 py-0.5 rounded-md">PRO</p>
          </div>

          {/* Search bar & Language Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto flex-1 max-w-md justify-end">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 focus:border-red-500/50 rounded-xl pl-4 pr-10 py-2.5 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-red-500/20 transition-all"
              />
              <button 
                type="submit" 
                className={`absolute inset-y-0 ${isAr ? "left-3" : "right-3"} flex items-center text-zinc-500 hover:text-red-500 transition-colors`}
              >
                <Search className="h-4 w-4" />
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className={`absolute inset-y-0 ${isAr ? "left-9" : "right-9"} text-[10px] text-zinc-500 hover:text-white flex items-center`}
                >
                  {t.clearSearch}
                </button>
              )}
            </form>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-300 hover:text-white hover:border-zinc-700 transition-all cursor-pointer whitespace-nowrap"
            >
              <Globe className="h-3.5 w-3.5 text-red-500" />
              <span>{isAr ? "English" : "العربية"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Featured Movies Slider (Only shown when not searching and on home category) */}
      {!loading && !error && activeCategory === "most-viewed" && !searchQuery && featuredMovies.length > 0 && (
        <section className="relative w-full h-[400px] sm:h-[480px] md:h-[550px] bg-black overflow-hidden border-b border-zinc-900">
          <AnimatePresence mode="wait">
            {featuredMovies.map((movie, idx) => {
              if (idx !== currentSlide) return null;
              return (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6 }}
                  className="absolute inset-0"
                >
                  {/* Cover background */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent z-10" />
                  <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/80 via-transparent to-zinc-950/80 z-10" />
                  <img
                    src={movie.backdropUrl || "https://images.unsplash.com/photo-1574267431629-2e570984a13d?q=80&w=1600&auto=format&fit=crop"}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-[0.55] saturate-[1.1] scale-100"
                  />

                  {/* Hero text details overlay */}
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
                      <div className="max-w-2xl flex flex-col items-start gap-3 sm:gap-4 text-zinc-100">
                        
                        {/* Tag */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className="bg-red-600 text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-lg shadow-red-600/20">
                            <Flame className="h-3 sm:h-3.5 w-3 sm:w-3.5 fill-current" />
                            {t.featured}
                          </span>
                          {movie.rating && (
                            <span className="bg-zinc-800/80 border border-zinc-700 text-red-500 text-[11px] font-bold px-2 py-0.5 rounded">
                              ★ {movie.rating.toFixed(1)}
                            </span>
                          )}
                          <span className="text-[11px] sm:text-xs text-zinc-450 font-bold">
                            {movie.year} • {isAr ? (movie.category?.nameAr || movie.category?.name) : (movie.category?.nameEn || movie.category?.name)}
                          </span>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                          {isAr ? (movie.titleAr || movie.title) : (movie.titleEn || movie.title)}
                        </h2>

                        {/* Plot */}
                        {movie.description && (
                          <p className="text-xs sm:text-sm md:text-base text-zinc-300 leading-relaxed max-w-xl line-clamp-2 sm:line-clamp-3">
                            {isAr ? movie.descriptionAr || movie.description : movie.descriptionEn || movie.description}
                          </p>
                        )}

                        {/* Action Controls */}
                        <div className="flex flex-wrap gap-3 mt-1">
                          <button
                            onClick={() => playMovie(movie)}
                            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-lg shadow-red-600/25 transform hover:-translate-y-0.5 cursor-pointer"
                          >
                            <Play className="h-3.5 sm:h-4 w-3.5 sm:w-4 fill-current" />
                            {t.watchNow}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </section>
      )}

      {/* Main Content Explorer Container */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-grow w-full flex flex-col gap-8">
        
        {/* Category Pills Navigation Panel */}
        <section className="flex flex-col gap-3">
          <h3 className="text-sm font-bold text-zinc-400 flex items-center gap-2 uppercase tracking-wider">
            <LayoutGrid className="h-4 w-4 text-red-500" />
            {t.exploreByCat}
          </h3>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.slice(0, 4).map((cat) => (
              <button
                key={cat.id}
                onClick={() => selectCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  activeCategory === cat.id && !searchQuery
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/40 ring-1 ring-red-500"
                    : "bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-white"
                }`}
              >
                <span>{isAr ? cat.nameAr : cat.nameEn}</span>
              </button>
            ))}
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white"
            >
              {isAr ? "المزيد" : "More"}
            </button>
          </div>
        </section>

        {isSidebarOpen && (
          <div className="fixed inset-0 bg-black/90 z-50 p-4 flex items-center justify-center">
            <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-800 max-w-md w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-white">{isAr ? "جميع الأقسام" : "All Categories"}</h3>
                <button onClick={() => setIsSidebarOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
              </div>
              <div className="flex flex-col gap-2">
                {CATEGORIES.slice(4).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      selectCategory(cat.id);
                      setIsSidebarOpen(false);
                    }}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer text-left ${
                      activeCategory === cat.id && !searchQuery
                        ? "bg-red-600 text-white"
                        : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
                    }`}
                  >
                    {isAr ? cat.nameAr : cat.nameEn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Section Heading */}
        <div className="flex flex-col gap-4 border-b border-zinc-900 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {searchQuery 
                  ? `${t.showingResults}: "${searchQuery}"`
                  : (isAr 
                      ? CATEGORIES.find(c => c.id === activeCategory)?.nameAr 
                      : CATEGORIES.find(c => c.id === activeCategory)?.nameEn)}
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1 font-medium">
                {isAr ? `${movies.length} فيلم متاح حالياً` : `${movies.length} movies available currently`}
              </p>
            </div>
          </div>

          {/* Filtering & Sorting UI Bar */}
          {!loading && !error && movies.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-900/20 border border-zinc-900/60 rounded-2xl p-4.5">
              <span className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                {t.sortBy}
              </span>
              
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "default", label: t.sortDefault, icon: <Search className="h-3.5 w-3.5" /> },
                  { id: "year", label: t.sortYear, icon: <Calendar className="h-3.5 w-3.5" /> },
                  { id: "rating", label: t.sortRating, icon: <Trophy className="h-3.5 w-3.5" /> },
                  { id: "duration", label: t.sortDuration, icon: <Clock className="h-3.5 w-3.5" /> },
                ].map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSortBy(option.id as any)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      sortBy === option.id
                        ? "bg-red-600 text-white font-black shadow-lg shadow-red-600/15"
                        : "bg-zinc-900/50 hover:bg-zinc-900 border border-zinc-800/80 text-zinc-400 hover:text-zinc-250"
                    }`}
                  >
                    <span>{option.icon}</span>
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Loading Overlay */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 text-zinc-400">
            <RefreshCw className="h-10 w-10 text-red-500 animate-spin" />
            <p className="text-xs font-semibold animate-pulse">{t.loading}</p>
          </div>
        ) : error ? (
          /* Error State UI */
          <div className="py-16 px-6 max-w-lg mx-auto bg-zinc-950 border border-zinc-900 rounded-2xl flex flex-col items-center text-center gap-4">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="text-base font-bold text-zinc-100">{isAr ? "حدث خطأ غير متوقع" : "Something Went Wrong"}</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">{error}</p>
            <button
              onClick={fetchMovies}
              className="mt-2 flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs transition-all shadow-md cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t.retry}
            </button>
          </div>
        ) : movies.length === 0 ? (
          /* Empty State UI */
          <div className="py-24 text-center max-w-md mx-auto">
            <Film className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
            <p className="text-sm font-bold text-zinc-400 leading-relaxed mb-4">{t.noMovies}</p>
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-bold hover:text-white"
              >
                {t.backToHome}
              </button>
            )}
          </div>
        ) : (
          /* Movie Catalog Grid */
          <AnimatePresence mode="wait">
            <motion.div 
              key={`${activeCategory}-${page}-${searchQuery}-${sortBy}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-10"
            >
              <div 
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
              >
                {sortedMovies.map((movie) => (
                  <MovieCard
                    key={movie.id}
                    movie={movie}
                    language={language}
                    onClick={() => playMovie(movie)}
                  />
                ))}
              </div>

              {/* Pagination Controls (Only when category is paginated & total pages > 1) */}
              {!searchQuery && activeCategory !== "most-viewed" && totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 pt-6 border-t border-zinc-900">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all"
                  >
                    {isAr ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                  </button>
                  
                  <span className="text-xs font-bold text-zinc-400">
                    {isAr 
                      ? `صفحة ${page} من ${totalPages}` 
                      : `Page ${page} of ${totalPages}`}
                  </span>

                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-zinc-850 text-zinc-300 hover:text-white transition-all"
                  >
                    {isAr ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
                  </button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </main>

      {/* Footer Branding Area */}
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center text-xs text-zinc-500 font-medium">
          <div className="flex items-center gap-2">
            <Film className="h-4 w-4 text-red-600" />
            <span>© 2026 {t.title}.</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center bg-zinc-900/40 border border-zinc-850 px-4 py-1.5 rounded-full text-zinc-400 font-extrabold text-[11px] transition-all hover:border-red-500/20 hover:text-white">
            <span>صُنع بـ</span>
            <span className="text-red-500 animate-pulse">❤️</span>
            <span>في البيضاء - ليبيا</span>
          </div>
          <p className="max-w-md md:text-right text-[11px] leading-relaxed">
            {t.allRightsReserved}
          </p>
        </div>
      </footer>

      {/* Cinematic Inline Video Player Overlay */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/98 backdrop-blur-2xl flex items-start justify-center p-0 md:p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 30 }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-zinc-900 md:border border-zinc-850/80 rounded-none md:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col my-0 md:my-8 text-right rtl:text-right ltr:text-left"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedMovie(null)}
                className={`absolute top-4 ${isAr ? "left-4" : "right-4"} z-50 h-10 w-10 rounded-full bg-black/60 text-zinc-300 hover:text-white hover:bg-red-600 border border-zinc-800/80 flex items-center justify-center transition-all cursor-pointer backdrop-blur-md`}
                title={isAr ? "إغلاق" : "Close"}
              >
                <X className="h-5 w-5" />
              </button>


              {/* Movie Details Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 bg-gradient-to-b from-zinc-900 to-zinc-950">
                
                {/* Main Details Panel */}
                <div className="md:col-span-8 flex flex-col gap-5">
                  <div className="flex gap-6 items-start">
                    <div className="w-24 h-36 md:w-32 md:h-48 relative shadow-2xl border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                      <img 
                        src={selectedMovie.posterUrl || selectedMovie.backdropUrl} 
                        alt={selectedMovie.title}
                        className="w-full h-full object-cover"
                        data-tried-poster={selectedMovie.posterUrl === (selectedMovie.posterUrl || selectedMovie.backdropUrl) ? 'true' : 'false'}
                        data-tried-backdrop={selectedMovie.backdropUrl === (selectedMovie.posterUrl || selectedMovie.backdropUrl) ? 'true' : 'false'}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          
                          // Try alternatives
                          if (target.dataset.triedPoster === 'false' && selectedMovie.posterUrl) {
                            target.src = selectedMovie.posterUrl;
                            target.dataset.triedPoster = 'true';
                          } else if (target.dataset.triedBackdrop === 'false' && selectedMovie.backdropUrl) {
                            target.src = selectedMovie.backdropUrl;
                            target.dataset.triedBackdrop = 'true';
                          } else {
                            // Final failure: show LibyFlix text
                            const parent = target.parentElement!;
                            parent.innerHTML = `
                              <div class="w-full h-full flex items-center justify-center bg-zinc-900 text-[10px] md:text-xs font-black text-red-600 p-2 text-center">
                                ${isAr ? 'ليبيـفليكس' : 'LIBYFLIX'}
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                    <div className="flex-1">
                      {/* Tags / Badges */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                          {isAr ? "يُعرض الآن" : "Now Playing"}
                        </span>
                        {selectedMovie.rating && (
                          <span className="bg-zinc-800 text-red-500 border border-zinc-700 text-xs font-extrabold px-2 py-0.5 rounded flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current text-red-500" />
                            {selectedMovie.rating.toFixed(1)}
                          </span>
                        )}
                        {selectedMovie.year && (
                          <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold px-2 py-0.5 rounded">
                            {selectedMovie.year}
                          </span>
                        )}
                        {selectedMovie.duration && (
                          <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            {isAr ? `${selectedMovie.duration} دقيقة` : `${selectedMovie.duration} min`}
                          </span>
                        )}
                      </div>

                      {/* Movie Title */}
                      <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
                        {isAr ? (selectedMovie.titleAr || selectedMovie.title) : (selectedMovie.titleEn || selectedMovie.title)}
                      </h2>
                      {isAr && selectedMovie.titleEn && (
                        <p className="text-sm font-bold text-zinc-400 mt-1 font-mono tracking-wide">{selectedMovie.titleEn}</p>
                      )}
                    </div>
                  </div>

                  {/* Story Description */}
                  {selectedMovie.description && (
                    <div className="flex flex-col gap-2">
                      <h4 className="text-xs font-black uppercase tracking-wider text-zinc-400">
                        {isAr ? "قصة الفيلم" : "Synopsis"}
                      </h4>
                      <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
                        {isAr ? selectedMovie.descriptionAr || selectedMovie.description : selectedMovie.descriptionEn || selectedMovie.description}
                      </p>
                    </div>
                  )}

                  {/* Stream server switching */}
                  {selectedMovie.sources && selectedMovie.sources.length > 1 && (
                    <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800/60">
                      <span className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                        <Zap className="h-3.5 w-3.5 fill-current" />
                        {isAr ? "تغيير سيرفر المشاهدة:" : "Change Streaming Server:"}
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedMovie.sources.map((src, sIdx) => (
                          <button
                            key={src.id}
                            onClick={() => setActiveSourceIndex(sIdx)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                              activeSourceIndex === sIdx
                                ? "bg-red-600 border-red-600 text-white font-black shadow-lg shadow-red-600/20"
                                : "bg-zinc-900 hover:bg-zinc-800 border-zinc-800/80 text-zinc-400 hover:text-white"
                            }`}
                          >
                            <span>{src.label || (isAr ? `سيرفر ${sIdx + 1}` : `Server ${sIdx + 1}`)}</span>
                            {src.quality && (
                              <span className="bg-black/30 text-[10px] px-1.5 py-0.5 rounded font-mono">
                                {src.quality}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Watch Movie button */}
                  {selectedMovie.sources && selectedMovie.sources.length > 0 && (
                    <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center gap-3">
                      <p className="text-xs font-bold text-zinc-400 leading-relaxed flex-1">
                        {isAr 
                          ? "يمكنك مشاهدة الفيلم مباشرة في مشغل خارجي:" 
                          : "You can watch the movie directly in an external player:"}
                      </p>
                      <button
                        onClick={() => {
                          const url = selectedMovie.sources[activeSourceIndex]?.streamUrl;
                          if (url) {
                            window.open(url, "_blank");
                          }
                        }}
                        className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 border border-red-500 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
                      >
                        <Play className="h-4 w-4 text-white" />
                        <span>{isAr ? "مشاهدة الفيلم" : "Watch Movie"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Sidebar Details Panel */}
                <div className={`md:col-span-4 flex flex-col gap-6 pt-6 md:pt-0 ${isAr ? "md:border-r border-zinc-850 md:pr-6 md:pl-0" : "md:border-l border-zinc-850 md:pl-6 md:pr-0"}`}>
                  
                  {/* Poster Thumbnail */}
                  {selectedMovie.posterUrl && (
                    <img
                      src={selectedMovie.posterUrl}
                      alt={selectedMovie.title}
                      referrerPolicy="no-referrer"
                      className="w-full aspect-[2/3] object-cover rounded-2xl border border-zinc-800 hidden md:block shadow-lg"
                    />
                  )}

                  <div className="flex flex-col gap-4 text-xs font-semibold text-zinc-400">
                    {/* View Count */}
                    <div className="flex items-center justify-between py-2 border-b border-zinc-850/60">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <Eye className="h-3.5 w-3.5" />
                        {isAr ? "المشاهدات" : "Views"}
                      </span>
                      <span className="text-zinc-200 font-bold">{selectedMovie.viewCount.toLocaleString()}</span>
                    </div>

                    {/* Category */}
                    <div className="flex items-center justify-between py-2 border-b border-zinc-850/60">
                      <span className="text-zinc-500 flex items-center gap-1.5">
                        <Film className="h-3.5 w-3.5" />
                        {isAr ? "القسم" : "Category"}
                      </span>
                      <span className="text-red-500 font-bold">
                        {isAr ? selectedMovie.category?.nameAr : selectedMovie.category?.nameEn}
                      </span>
                    </div>

                    {/* Genre */}
                    {(selectedMovie.genreAr || selectedMovie.genreEn || selectedMovie.genre) && (
                      <div className="flex items-center justify-between py-2 border-b border-zinc-850/60">
                        <span className="text-zinc-500 flex items-center gap-1.5">
                          <Activity className="h-3.5 w-3.5" />
                          {isAr ? "التصنيف" : "Genre"}
                        </span>
                        <span className="text-zinc-200 font-bold">
                          {isAr ? selectedMovie.genreAr || selectedMovie.genre : selectedMovie.genreEn || selectedMovie.genre}
                        </span>
                      </div>
                    )}

                    {/* Country / Director / Cast Metadata */}
                    {selectedMovie.externalMetadata && (
                      <div className="flex flex-col gap-4">
                        {selectedMovie.externalMetadata.director && (
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500">{isAr ? "المخرج:" : "Director:"}</span>
                            <span className="text-zinc-200 font-bold leading-normal">{selectedMovie.externalMetadata.director}</span>
                          </div>
                        )}

                        {selectedMovie.externalMetadata.cast && (
                          <div className="flex flex-col gap-1">
                            <span className="text-zinc-500">{isAr ? "طاقم العمل / الممثلين:" : "Cast:"}</span>
                            <span className="text-zinc-200 leading-relaxed font-medium line-clamp-4">{selectedMovie.externalMetadata.cast}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* Website Disclaimer & Warning Dialog */}
      <AnimatePresence>
        {showReminder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-zinc-950/98 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative max-w-xl w-full bg-gradient-to-b from-zinc-900 to-zinc-950 border-2 border-red-600/40 rounded-3xl p-6 md:p-8 text-center shadow-[0_0_60px_rgba(220,38,38,0.25)] overflow-hidden"
            >
              {/* Decorative glows */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
              
              {/* Bell Icon */}
              <div className="mx-auto h-16 w-16 rounded-2xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-6 shadow-inner shadow-red-600/5">
                <Bell className="h-8 w-8 animate-bounce text-red-500" />
              </div>

              {/* Title */}
              <h2 className="text-xl md:text-2xl font-black text-white mb-4 tracking-tight flex items-center justify-center gap-2">
                <Sparkles className="h-5 w-5 text-red-500 animate-pulse" />
                <span>{isAr ? "تذكير وتنبيه هام" : "Important Prayer Reminder"}</span>
              </h2>

              {/* Sub-Banner with Quran Quote */}
              <div className="bg-red-950/40 border border-red-900/40 p-4 rounded-2xl mb-5 text-red-400 font-extrabold text-sm md:text-base leading-relaxed text-center">
                {isAr 
                  ? "«إِنَّ الصَّلَاةَ كَانَتْ عَلَى الْمُؤْمِنِينَ كِتَابًا مَّوقُوتًا»" 
                  : "“Indeed, prayer has been decreed upon the believers a decree of specified times.”"
                }
              </div>

              {/* Content text */}
              <div className="space-y-4 text-zinc-300 text-xs md:text-sm leading-relaxed mb-6 font-medium text-center">
                <p className="text-zinc-150 font-bold text-sm md:text-base">
                  {isAr 
                    ? "أخي الكريم / أختي الكريمة: لا تلهك مشاهدة الأفلام والمسلسلات عن ذكر الله وعن الصلوات المفروضة."
                    : "Dear viewer: Please do not let watching movies and series distract you from the remembrance of Allah and performing your obligatory prayers on time."
                  }
                </p>
                <p className="text-zinc-400">
                  {isAr
                    ? "الصلاة هي عماد الدين وقرة عين المؤمنين، فلا تجعل متعة المشاهدة الفانية تفوتك فرضاً أو تؤخرك عن طاعة ربك جل وعلا."
                    : "Prayer is the pillar of religion and the delight of believers. Do not let transient entertainment cause you to miss a prayer or delay your obedience to your Lord."
                  }
                </p>
              </div>

              {/* Countdown Indicator */}
              <div className="flex flex-col items-center justify-center gap-3 mb-6">
                <div className="relative h-16 w-16 rounded-full border-2 border-zinc-800 flex items-center justify-center bg-zinc-950">
                  <span className="text-xl font-black text-red-500">{countdown}</span>
                  {countdown > 0 && (
                    <svg className="absolute inset-0 h-full w-full -rotate-90">
                      <circle
                        cx="32"
                        cy="32"
                        r="29"
                        className="stroke-red-600 fill-none stroke-[2.5]"
                        strokeDasharray={182.2}
                        strokeDashoffset={182.2 - (182.2 * countdown) / 10}
                        style={{ transition: "stroke-dashoffset 1s linear" }}
                      />
                    </svg>
                  )}
                </div>
                <span className="text-xs font-bold text-zinc-400">
                  {countdown > 0 
                    ? (isAr ? `يمكنك المتابعة بعد ${countdown} ثوانٍ...` : `Proceed in ${countdown} seconds...`)
                    : (isAr ? "يمكنك المتابعة الآن" : "You can proceed now")
                  }
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={handleCloseReminder}
                  disabled={countdown > 0}
                  className={`w-full py-3.5 px-6 rounded-2xl text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 ${
                    countdown > 0
                      ? "bg-zinc-800/80 border border-zinc-700/50 text-zinc-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-red-700 to-red-500 hover:from-red-600 hover:to-red-400 text-white shadow-lg shadow-red-600/30 active:scale-95 cursor-pointer"
                  }`}
                >
                  <span>{isAr ? "فهمت وتذكرت.. متابعة للموقع" : "I Understand & Continue to Website"}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
