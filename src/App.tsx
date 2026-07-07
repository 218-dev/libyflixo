import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Film, Flame, Globe, LayoutGrid, AlertCircle, RefreshCw, Loader2, Hourglass,
  ChevronLeft, ChevronRight, Play, Info, Trophy, Tv, Calendar, Clock, Activity, Zap,
  Bell, Sparkles, X, ExternalLink, Eye, Star, Download, Volume2, VolumeX, Music, WifiOff
} from "lucide-react";
import { Movie, Language } from "./types";
import MovieCard from "./components/MovieCard";

// Bilingual translations for static UI elements
const translations = {
  en: {
    title: "LIBYFLIX",
    portal: "",
    subtitle: "Stream your favorite series, classics, and releases",
    searchPlaceholder: "Search by series title, director, cast...",
    mostViewed: "Most Viewed Series",
    allMovies: "All Series",
    categories: "Series Sections",
    arabicMovies: "Arabic Series",
    foreignMovies: "Foreign Series",
    platforms: "Platform Series",
    rating: "Rating",
    year: "Year",
    duration: "Episodes",
    views: "Views",
    watchNow: "Watch Now",
    noMovies: "No series found. Try another search or category.",
    all: "All",
    loading: "Loading series catalog...",
    backToHome: "Back to Home",
    genre: "Genre",
    playInApp: "Play in Browser",
    featured: "Featured Series",
    popularRightNow: "Popular Series Right Now",
    exploreByCat: "Explore Series by Category",
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
    subtitle: "بث ومشاهدة مسلسلاتك المفضلة، الكلاسيكيات، وأحدث الإصدارات",
    searchPlaceholder: "ابحث باسم المسلسل، المخرج، الممثلين...",
    mostViewed: "المسلسلات الأكثر مشاهدة",
    allMovies: "جميع المسلسلات",
    categories: "أقسام المسلسلات",
    arabicMovies: "مسلسلات عربية",
    foreignMovies: "مسلسلات أجنبية",
    platforms: "مسلسلات منصات",
    rating: "التقييم",
    year: "السنة",
    duration: "الحلقات",
    views: "المشاهدات",
    watchNow: "شاهد الآن",
    noMovies: "لم يتم العثور على مسلسلات. جرب البحث عن كلمة أخرى أو قسم آخر.",
    all: "الكل",
    loading: "جاري تحميل قائمة المسلسلات...",
    backToHome: "العودة للرئيسية",
    genre: "التصنيف",
    playInApp: "تشغيل في المتصفح",
    featured: "مسلسل اليوم المميز",
    popularRightNow: "رائج الآن من المسلسلات",
    exploreByCat: "استكشف المسلسلات حسب القسم",
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
    noMatches: "لا توجد مباريات مجدولة لليوم.",
    licenseTitle: "تفعيل الاشتراك",
    licenseSubtitle: "يرجى إدخال كود التفعيل للوصول إلى كافة ميزات ليبيفليكس",
    licensePlaceholder: "أدخل كود التفعيل هنا...",
    activate: "تفعيل الآن",
    activating: "جاري التفعيل...",
    licenseStatus: "حالة الاشتراك",
    active: "مفعل",
    expired: "منتهي",
    remainingDays: "يوم متبقي",
    invalidCode: "كود التفعيل غير صحيح أو منتهي",
    errorCode: "حدث خطأ أثناء التفعيل، يرجى المحاولة لاحقاً",
    days: "أيام"
  }
};

const STATIC_CATEGORIES = [
  { id: "most-viewed", nameAr: "الأكثر مشاهدة", nameEn: "Most Viewed" },
  { id: "recently-added", nameAr: "المضافة حديثاً", nameEn: "Recently Added" },
];

function LicenseActivationScreen({ isAr, t, onActivate, error, isActivating }: { isAr: boolean, t: any, onActivate: (code: string) => void, error: string | null, isActivating: boolean }) {
  const [inputCode, setInputCode] = useState("");
  const [featuredContent, setFeaturedContent] = useState<any[]>([]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [shuffleTrigger, setShuffleTrigger] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement>(null);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlayingMusic) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlayingMusic(!isPlayingMusic);
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => setIsPlayingMusic(false));
    }
  }, []);

  useEffect(() => {
    const fetchMixedContent = async () => {
      try {
        const results: any[] = [];
        const timestamp = Date.now();
        
        // Fetch S1 Movies
        const m1Res = await fetch(`/api/movies/most-viewed?limit=5&t=${timestamp}`);
        if (m1Res.ok) {
          const data = await m1Res.json();
          if (Array.isArray(data)) results.push(...data.slice(0, 4).map((i: any) => ({ ...i, library: "server1", type: "movie" })));
        }

        // Fetch S1 Series
        const s1Res = await fetch(`/api/series/most-viewed?limit=5&t=${timestamp}`);
        if (s1Res.ok) {
          const data = await s1Res.json();
          if (Array.isArray(data)) results.push(...data.slice(0, 4).map((i: any) => ({ ...i, library: "server1", type: "series" })));
        }

        // Fetch S2 Content
        const s2Res = await fetch(`/api/server2/movies?section=most-viewed&limit=8&t=${timestamp}`);
        if (s2Res.ok) {
          const json = await s2Res.json();
          const items = Array.isArray(json) ? json : (json.items || json.data || []);
          const mapped = items.slice(0, 5).map((item: any) => ({
            id: item.slug || item.subject_id || item.id,
            title: item.name,
            titleAr: item.name,
            titleEn: item.name,
            posterUrl: item.poster_url,
            library: "server2",
            type: item.type || "movie",
            genre: item.genre,
            genreAr: item.genreAr,
            genreEn: item.genreEn,
            duration: item.duration || item.runtime
          }));
          results.push(...mapped);
        }

        // Fisher-Yates shuffle for better randomness
        const shuffled = [...results];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        if (shuffled.length > 0) {
          setFeaturedContent(shuffled);
          setActiveSlide(0);
        }
      } catch (e) {
        console.error("Failed to fetch featured content", e);
      }
    };
    fetchMixedContent();
  }, [shuffleTrigger]);

  useEffect(() => {
    if (featuredContent.length === 0) return;
    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = prev + 1;
        if (next >= featuredContent.length) {
          setShuffleTrigger(s => s + 1);
          return 0; // Return to 0 while waiting for fetch
        }
        return next;
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [featuredContent]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950 p-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(220,38,38,0.15),transparent_70%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative z-10 py-4 lg:py-12 max-h-screen overflow-hidden">
        {/* Libyflix Content Slider (Left/Top side) */}
        <div className="w-full lg:w-1/2 space-y-3 lg:space-y-6 flex flex-col justify-center">
          <div className="flex items-center gap-3">
            <div className="h-5 lg:h-8 w-1 bg-red-600 rounded-full" />
            <h3 className="text-base lg:text-xl font-black text-white uppercase tracking-tighter">
              {isAr ? "محتوى LIBYFLIX" : "LIBYFLIX CONTENT"}
            </h3>
          </div>
          
          <div className="relative aspect-[16/9] lg:aspect-[16/10] rounded-[1.2rem] lg:rounded-[2rem] overflow-hidden border border-zinc-850 bg-zinc-900 group shadow-2xl">
            <video 
              src="https://l.top4top.io/m_3839o7kv30.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-40 z-0"
            />
            <audio ref={audioRef} src="https://a.top4top.io/m_3839dm0yo1.mp3" loop />
            
            {/* Music Toggle Button */}
            <button 
              onClick={toggleMusic}
              className="absolute top-4 left-4 z-50 p-2.5 rounded-full bg-black/50 hover:bg-red-600/80 backdrop-blur-md border border-white/10 text-white transition-all shadow-xl active:scale-95"
              title={isPlayingMusic ? "Pause Music" : "Play Music"}
            >
              {isPlayingMusic ? <Music className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {featuredContent.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="absolute inset-0 z-10"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-6 gap-6">
                      <div className="w-1/3 aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-white/10 shrink-0">
                        <img 
                          src={featuredContent[activeSlide].posterUrl || "https://i.top4top.io/p_3839qx2t30.png"} 
                          alt={featuredContent[activeSlide].title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = "https://i.top4top.io/p_3839qx2t30.png";
                          }}
                        />
                      </div>
                      <div className="flex-1 flex flex-col justify-center text-right rtl:text-right ltr:text-left">
                        <div className="flex flex-wrap gap-2 mb-3">
                          <span className={`text-[9px] font-black tracking-widest text-white uppercase px-2.5 py-1 rounded-full ${featuredContent[activeSlide].library === 'server2' ? 'bg-blue-600' : 'bg-red-600'}`}>
                            {featuredContent[activeSlide].library === 'server2' ? (isAr ? "سيرفر 2" : "SERVER 2") : (isAr ? "سيرفر 1" : "SERVER 1")}
                          </span>
                          <span className="text-[9px] font-black tracking-widest text-zinc-300 uppercase bg-zinc-800 px-2.5 py-1 rounded-full">
                            {featuredContent[activeSlide].type === 'series' ? (isAr ? "مسلسل" : "SERIES") : (isAr ? "فيلم" : "MOVIE")}
                          </span>
                          <span className="text-[9px] font-black tracking-widest text-zinc-300 uppercase bg-zinc-800 px-2.5 py-1 rounded-full">
                            {isAr ? (featuredContent[activeSlide].genreAr || featuredContent[activeSlide].genre || "منوع") : (featuredContent[activeSlide].genreEn || featuredContent[activeSlide].genre || "General")}
                          </span>
                          {featuredContent[activeSlide].type !== 'series' && featuredContent[activeSlide].duration && !isNaN(Number(featuredContent[activeSlide].duration)) && (
                            <span className="text-[9px] font-black tracking-widest text-zinc-300 uppercase bg-zinc-800 px-2.5 py-1 rounded-full">
                              {Math.floor(Number(featuredContent[activeSlide].duration) / 60) > 0 ? `${Math.floor(Number(featuredContent[activeSlide].duration) / 60)} ${isAr ? 'ساعة' : 'h'} ` : ''} 
                              {Number(featuredContent[activeSlide].duration) % 60 > 0 ? `${Number(featuredContent[activeSlide].duration) % 60} ${isAr ? 'دقيقة' : 'm'}` : ''}
                            </span>
                          )}
                        </div>
                        <h4 className="text-lg md:text-2xl font-black text-white leading-tight line-clamp-2">
                          {isAr ? (featuredContent[activeSlide].titleAr || featuredContent[activeSlide].title) : (featuredContent[activeSlide].titleEn || featuredContent[activeSlide].title)}
                        </h4>
                        <p className="text-zinc-400 text-xs md:text-sm mt-2 line-clamp-2 leading-relaxed">
                          {isAr ? (featuredContent[activeSlide].descriptionAr || featuredContent[activeSlide].description || "") : (featuredContent[activeSlide].descriptionEn || featuredContent[activeSlide].description || "")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Left/Right Navigation buttons */}
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev - 1 + featuredContent.length) % featuredContent.length)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all backdrop-blur-md border border-zinc-800 cursor-pointer z-20"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev + 1) % featuredContent.length)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/60 hover:bg-red-600 text-white flex items-center justify-center transition-all backdrop-blur-md border border-zinc-800 cursor-pointer z-20"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>

                {/* Slide dots indicators */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {featuredContent.map((_, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1 rounded-full transition-all duration-300 cursor-pointer ${
                        activeSlide === idx ? "w-6 bg-red-600" : "w-1.5 bg-zinc-600"
                      }`}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50">
                <Loader2 className="h-8 w-8 text-red-600 animate-spin" />
              </div>
            )}
          </div>
        </div>

        {/* Activation Card (Right/Bottom side) */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-1/2 max-w-md bg-zinc-900/60 backdrop-blur-3xl border border-white/5 p-6 lg:p-8 rounded-[1.5rem] lg:rounded-[2rem] shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex flex-col items-center text-center gap-4 lg:gap-6 relative z-10">
            <div className="flex items-center gap-1 text-3xl lg:text-5xl font-black tracking-tighter mb-1 lg:mb-2">
              <span className="text-white">{isAr ? "ليبيـ" : "LIBY"}</span>
              <span className="text-red-600">{isAr ? "فليكس" : "FLIX"}</span>
            </div>

            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white tracking-tight">{t.licenseTitle}</h2>
              <p className="text-zinc-400 text-sm leading-relaxed max-w-[280px] mx-auto">{t.licenseSubtitle}</p>
            </div>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                if (inputCode.trim()) onActivate(inputCode);
              }}
              className="w-full space-y-4"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 right-4 flex items-center text-zinc-500 group-focus-within:text-red-500 transition-colors">
                  <Zap className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder={t.licensePlaceholder}
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="w-full bg-black/40 border border-zinc-800 focus:border-red-600/50 rounded-2xl pr-12 pl-4 py-4 text-center text-lg font-mono tracking-widest text-white focus:outline-none focus:ring-4 focus:ring-red-600/5 transition-all"
                />
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 justify-center text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 py-3 rounded-xl border border-red-500/20"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </motion.div>
              )}

              <button
                type="submit"
                disabled={isActivating}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 group"
              >
                {isActivating ? (
                  <>
                    <RefreshCw className="h-5 w-5 animate-spin" />
                    <span>{t.activating}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5 group-hover:animate-pulse" />
                    <span>{t.activate}</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 pt-6 border-t border-zinc-800/50 w-full flex flex-col items-center gap-3">
              <span className="text-[9px] text-zinc-500 uppercase tracking-[0.3em] font-black">Powered by Antigravity</span>
              <div className="flex items-center gap-6">
                <a href="#" className="text-zinc-500 hover:text-red-500 transition-all transform hover:scale-110"><Globe className="h-5 w-5" /></a>
                <a href="#" className="text-zinc-500 hover:text-red-500 transition-all transform hover:scale-110"><Activity className="h-5 w-5" /></a>
                <div className="h-4 w-px bg-zinc-800" />
                <span className="text-[10px] text-zinc-600 font-bold tracking-tighter">AL BAYDA, LIBYA</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const mappedDetail = (data: any, movie: any): any => {
  const sub = data.subject || {};
  const res = data.resource || {};
  
  // Map seasons and episodes if they exist
  let episodes: any[] = [];
  if (res.seasons && Array.isArray(res.seasons)) {
    res.seasons.forEach((s: any) => {
      const epCount = s.maxEp || 1;
      for (let e = 1; e <= epCount; e++) {
        episodes.push({
          id: `${movie.id || movie.slug || "s2"}-${s.se}-${e}`,
          seriesId: movie.id || movie.slug,
          seasonNumber: s.se,
          episodeNumber: e,
          title: `Episode ${e}`,
          titleAr: `الحلقة ${e}`,
          titleEn: `Episode ${e}`,
          description: "",
          duration: null,
          thumbnailUrl: null,
          sources: [
            {
              id: `${movie.id || movie.slug || "s2"}-${s.se}-${e}-src`,
              movieId: movie.id || movie.slug,
              label: `Server 2 - Stream`,
              streamUrl: `${window.location.origin}/api/server2/stream?subject_id=${sub.subjectId}&detail_path=${sub.detailPath || movie.id || movie.slug}&se=${s.se}&ep=${e}`,
              quality: "Auto",
              format: "hls",
              isExternalServer: true
            }
          ]
        });
      }
    });
  }

  return {
    id: sub.detailPath || movie.id || movie.slug,
    title: sub.title || movie.title,
    titleAr: sub.title || movie.titleAr || movie.title,
    titleEn: sub.title || movie.titleEn || movie.title,
    description: sub.description || movie.description,
    descriptionAr: sub.description || movie.descriptionAr || movie.description,
    descriptionEn: sub.description || movie.descriptionEn || movie.description,
    posterUrl: sub.cover?.url || movie.posterUrl,
    backdropUrl: sub.stills?.url || sub.cover?.url || movie.backdropUrl,
    year: sub.releaseDate ? parseInt(sub.releaseDate.split("-")[0]) : movie.year,
    rating: sub.imdbRatingValue ? parseFloat(sub.imdbRatingValue) : movie.rating,
    duration: sub.duration ? parseInt(sub.duration) : movie.duration,
    genre: sub.genre || movie.genre,
    genreAr: sub.genre || movie.genreAr || movie.genre,
    genreEn: sub.genre || movie.genreEn || movie.genre,
    viewCount: movie.viewCount || 0,
    sources: episodes.length === 0 ? (
      sub.availableQualities && sub.availableQualities.length > 0
        ? sub.availableQualities.map((q: any, qIdx: number) => ({
            id: q.id || `movie-src-${qIdx}`,
            movieId: movie.id || movie.slug,
            label: q.label || `Server 2 - Play`,
            streamUrl: `${window.location.origin}/api/server2/stream?subject_id=${sub.subjectId || movie.subject_id}&source_index=${qIdx}`,
            quality: "Auto",
            format: "hls",
            isExternalServer: true
          }))
        : [
            {
              id: `movie-src`,
              movieId: movie.id || movie.slug,
              label: `Server 2 - Play`,
              streamUrl: `${window.location.origin}/api/server2/stream?subject_id=${sub.subjectId || movie.subject_id}&se=0&ep=1`,
              quality: "Auto",
              format: "hls",
              isExternalServer: true
            }
          ]
    ) : [],
    category: movie.category,
    externalMetadata: {
      cast: sub.staffList?.map((st: any) => st.name).join(", ") || "",
      director: ""
    },
    episodes: episodes.length > 0 ? episodes : undefined,
    slug: sub.detailPath || movie.slug || movie.id,
    subject_id: sub.subjectId || movie.subject_id
  };
};

export default function App() {
  const [language, setLanguage] = useState<Language>("ar");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("most-viewed");
  const [contentType, setContentType] = useState<"movie" | "series">("series");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [siteStats, setSiteStats] = useState({ movies: 0, series: 0 });
  
  // Selection
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);
  const [dynamicCategories, setDynamicCategories] = useState<{id: string, nameAr: string, nameEn: string, library: string}[]>([]);

  // Episode Selection for Server 2 Player
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeEpisode, setActiveEpisode] = useState(1);

  useEffect(() => {
    if (selectedMovie) {
      setActiveSeason(1);
      setActiveEpisode(1);
    }
  }, [selectedMovie]);

  // Active Server State
  const [currentServer, setCurrentServer] = useState<"server1" | "server2">(() => {
    return (localStorage.getItem("libyflix_current_server") as "server1" | "server2") || "server1";
  });

  const handleServerSwitch = (server: "server1" | "server2") => {
    setCurrentServer(server);
    localStorage.setItem("libyflix_current_server", server);
    setMovies([]);
    setPage(1);
    setSearchQuery("");
    // Reset category to correct default when switching servers
    if (server === "server2") {
      setActiveCategory(contentType === "movie" ? "all-movies" : "all-series");
    } else {
      setActiveCategory("most-viewed");
    }
  };

  // License State
  const [licenseCode, setLicenseCode] = useState<string>(localStorage.getItem("libyflix_license_code") || "");
  const [isLicenseActive, setIsLicenseActive] = useState<boolean>(false);
  const [licenseInfo, setLicenseInfo] = useState<{ remainingDays: number, status: string } | null>(null);
  const [isCheckingLicense, setIsCheckingLicense] = useState<boolean>(true);
  const [isActivating, setIsActivating] = useState<boolean>(false);
  const [licenseError, setLicenseError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  // Generate or retrieve persistent Device ID
  const getDeviceId = () => {
    let deviceId = localStorage.getItem("libyflix_device_id");
    if (!deviceId) {
      deviceId = 'web_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      localStorage.setItem("libyflix_device_id", deviceId);
    }
    return deviceId;
  };

  const API_AUTH_KEY = "123456SECRETKEY";

  // Check License Status
  useEffect(() => {
    const checkLicense = async () => {
      if (!licenseCode) {
        setIsCheckingLicense(false);
        setIsLicenseActive(false);
        return;
      }

      try {
        const res = await fetch(`/api/license/check?code=${licenseCode}&key=${API_AUTH_KEY}`);
        const data = await res.json();
        
        if (data.status === "active") {
          setIsLicenseActive(true);
          const days = Math.floor(data.remaining_seconds / 86400);
          setLicenseInfo({
            remainingDays: days,
            status: "active"
          });
        } else {
          setIsLicenseActive(false);
          if (data.status === "expired") {
            setLicenseError(isAr ? "انتهت صلاحية الكود" : "Code expired");
          }
        }
      } catch (e) {
        console.error("License check failed", e);
      } finally {
        setIsCheckingLicense(false);
      }
    };

    checkLicense();
  }, [licenseCode]);

  const handleActivate = async (code: string) => {
    setLicenseError(null);
    setIsActivating(true);
    try {
      const deviceId = getDeviceId();
      const userId = deviceId.substring(0, 8); 
      
      const res = await fetch(`/api/license/activate?code=${code}&user_id=${userId}&device_id=${deviceId}&key=${API_AUTH_KEY}`);
      const data = await res.json();

      if (data.status === "success") {
        localStorage.setItem("libyflix_license_code", code);
        setLicenseCode(code);
        setIsLicenseActive(true);
        setShowSuccessModal(true);
      } else {
        setLicenseError(data.message || (isAr ? "كود التفعيل غير صالح" : "Invalid activation code"));
      }
    } catch (e) {
      setLicenseError(isAr ? "حدث خطأ في الاتصال بالسيرفر. يرجى المحاولة لاحقاً" : "Connection error. Please try again later.");
    } finally {
      setIsActivating(false);
    }
  };

  // Fetch categories based on content type
  useEffect(() => {
    if (currentServer === "server2") {
      if (contentType === "movie") {
        setDynamicCategories([
          { id: "all-movies", nameAr: "كل الأفلام", nameEn: "All Movies", library: "server2" },
          { id: "movies-foreign", nameAr: "أفلام أجنبية", nameEn: "Foreign Movies", library: "server2" },
          { id: "movies-arabic", nameAr: "أفلام عربية", nameEn: "Arabic Movies", library: "server2" },
          { id: "eygpt-fl", nameAr: "أفلام مصرية", nameEn: "Egyptian Movies", library: "server2" },
          { id: "moviestr", nameAr: "أفلام تركية", nameEn: "Turkish Movies", library: "server2" },
          { id: "inada-flim", nameAr: "أفلام هندية", nameEn: "Indian Movies", library: "server2" },
          { id: "movies-asian", nameAr: "أفلام آسيوية", nameEn: "Asian Movies", library: "server2" },
          { id: "movies-classic", nameAr: "أفلام كلاسيكية", nameEn: "Classic Movies", library: "server2" },
          { id: "movies-dubbed", nameAr: "أفلام مدبلجة", nameEn: "Dubbed Movies", library: "server2" },
          { id: "movies-animation", nameAr: "أفلام أنيميشن", nameEn: "Animation Movies", library: "server2" },
          { id: "movies-no-trans", nameAr: "أفلام أجنبية بدون ترجمة", nameEn: "Foreign Movies (No Sub)", library: "server2" },
          { id: "plays", nameAr: "مسرحيات", nameEn: "Plays", library: "server2" },
          { id: "wrestling", nameAr: "مصارعة", nameEn: "Wrestling", library: "server2" }
        ]);
        setActiveCategory("all-movies");
      } else {
        setDynamicCategories([
          { id: "all-series", nameAr: "كل المسلسلات", nameEn: "All Series", library: "server2" },
          { id: "mslas-sg", nameAr: "مسلسلات أجنبية", nameEn: "Foreign Series", library: "server2" },
          { id: "series-arabic", nameAr: "مسلسلات عربية", nameEn: "Arabic Series", library: "server2" },
          { id: "aflsa", nameAr: "مسلسلات تركية", nameEn: "Turkish Series", library: "server2" },
          { id: "trki", nameAr: "مسلسلات مصرية", nameEn: "Egyptian Series", library: "server2" },
          { id: "series-korean", nameAr: "مسلسلات كورية", nameEn: "Korean Series", library: "server2" },
          { id: "series-cartoon", nameAr: "مسلسلات كرتون", nameEn: "Cartoon Series", library: "server2" },
          { id: "mslas-no-trans", nameAr: "مسلسلات بدون ترجمة", nameEn: "Series (No Sub)", library: "server2" },
          { id: "series", nameAr: "مسلسلات متنوعة", nameEn: "Various Series", library: "server2" }
        ]);
        setActiveCategory("all-series");
      }
      return;
    }

    const loadCategories = async () => {
      try {
        const endpoint = contentType === 'series' ? '/api/series' : '/api/movies';
        const response = await fetch(`${endpoint}?page=1&limit=80`);
        if (response.ok) {
          const json = await response.json();
          const items = Array.isArray(json) ? json : (json.data || []);
          if (Array.isArray(items)) {
            const extracted = [
              ...new Map(
                items
                  .filter(item => item.category)
                  .map(item => [
                    item.category.id,
                    {
                      id: item.category.id,
                      nameAr: item.category.nameAr || item.category.name,
                      nameEn: item.category.nameEn || item.category.name,
                      library: item.category.externalSource || item.externalSource || "xui2"
                    },
                  ])
              ).values(),
            ];
            setDynamicCategories(extracted as any);
          }
        }
      } catch (e) {
        console.error("Failed to load dynamic categories", e);
      }
    };
    loadCategories();
  }, [contentType, currentServer]);

  // Reset category when content type changes
  useEffect(() => {
    if (currentServer === "server2") {
      if (contentType === "movie") {
        setActiveCategory("all-movies");
      } else {
        setActiveCategory("all-series");
      }
    } else {
      setActiveCategory("most-viewed");
    }
    setPage(1);
  }, [contentType, currentServer]);

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



  const [sort, setSort] = useState<string>("newest");
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [year, setYear] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [tag, setTag] = useState<string>("");

  const isAr = language === "ar";
  const t = translations[language];

  // Play movie in-page by setting the selectedMovie state
  const playMovie = async (movie: Movie) => {
    setLoading(true);
    // Detect if this movie is from Server 2 (especially in global search results)
    const isServer2Result = (movie as any).category?.id === "search" || (movie as any).library === "server2";
    const targetServer = isServer2Result ? "server2" : currentServer;

    try {
      if (targetServer === "server2") {
        // Fetch details from server 2 details proxy
        const slugVal = (movie as any).slug || movie.id;
        const res = await fetch(`/api/server2/detail?slug=${encodeURIComponent(slugVal)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.data) {
            // Map Server 2 detail to Movie schema
            const fullMovie = mappedDetail(json.data, movie);
            setSelectedMovie(fullMovie as any);
            if (isServer2Result) {
              setCurrentServer("server2");
            }
            return;
          }
        }
        throw new Error("Failed to load details from Server 2");
      }

      if (contentType === 'series') {
        // Fetch details including episodes
        try {
          const response = await fetch(`/api/series/${movie.id}`);
          if (response.ok) {
             const fullMovie = await response.json();
             setSelectedMovie(fullMovie);
             return;
          }
        } catch (e) {
          console.error("Failed to fetch series details", e);
        }
      }
      setSelectedMovie(movie);
    } catch (e) {
      console.error("Error loading play details:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleVLCStream = (streamUrl: string) => {
    // Clean URL and remove protocol
    const cleanUrl = streamUrl.replace(/^https?:\/\//, '');
    
    // Custom links for platform/OS
    const vlcLink = "vlc://" + cleanUrl;         // iOS/iPadOS
    const androidLink = "intent://" + cleanUrl + "#Intent;scheme=http;package=org.videolan.vlc;end"; // Android
    
    // Detect platform
    const isAndroid = /Android/i.test(navigator.userAgent);
    const finalLink = isAndroid ? androidLink : vlcLink;

    // Try to open application
    window.location.href = finalLink;

    // Fallback if app doesn't open - Redirect to Download
    setTimeout(() => {
      if (document.hasFocus()) {
        const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
        const downloadUrl = isAndroid 
          ? "https://play.google.com/store/apps/details?id=org.videolan.vlc" 
          : isIOS 
            ? "https://apps.apple.com/app/vlc-for-mobile/id650377962"
            : "https://www.videolan.org/vlc/";
        window.open(downloadUrl, "_blank");
      }
    }, 2500);
  };

  // Fetch movies handler
  const fetchMovies = async () => {
    setLoading(true);
    setError(null);
    setMovies([]); // Clear movies before fetching new ones
    try {
      if (searchQuery.trim().length > 0) {
        // Global Search - Search both servers and both types
        const [s1MoviesRes, s1SeriesRes, s2SearchRes] = await Promise.all([
          fetch(`/api/movies?search=${encodeURIComponent(searchQuery)}&page=1&limit=20`),
          fetch(`/api/series?search=${encodeURIComponent(searchQuery)}&page=1&limit=20`),
          fetch(`/api/server2/search?q=${encodeURIComponent(searchQuery)}`)
        ]);

        let s1MoviesData: any[] = [];
        let s1SeriesData: any[] = [];
        let s2Results: any[] = [];

        if (s1MoviesRes.ok) {
          const json = await s1MoviesRes.json();
          s1MoviesData = Array.isArray(json) ? json : (json.data || []);
        }
        if (s1SeriesRes.ok) {
          const json = await s1SeriesRes.json();
          s1SeriesData = Array.isArray(json) ? json : (json.data || []);
        }
        if (s2SearchRes.ok) {
          const json = await s2SearchRes.json();
          const items = Array.isArray(json) ? json : (json.items || json.data || []);
          s2Results = items.map((item: any) => ({
            id: item.slug || item.subject_id || item.id || `s2-${Math.random()}`,
            title: item.name,
            titleAr: item.name,
            titleEn: item.name,
            posterUrl: item.poster_url,
            backdropUrl: item.poster_url,
            year: item.year ? parseInt(item.year) : null,
            rating: item.rating ? parseFloat(item.rating) : null,
            viewCount: 0,
            genre: item.badge || item.genre || null,
            genreAr: item.badge || item.genreAr || null,
            genreEn: item.badge || item.genreEn || null,
            duration: item.duration || item.runtime || null,
            type: item.type || 'movie',
            sources: [],
            category: { id: "search", name: "Server 2", nameAr: "سيرفر 2", nameEn: "Server 2", icon: "🌐", sortOrder: 1 },
            library: "server2",
            externalMetadata: { cast: "", director: "" },
            slug: item.slug || item.subject_id || item.id,
            subject_id: item.subject_id || item.slug
          }));
        }

        const merged = [...s1MoviesData, ...s1SeriesData, ...s2Results];
        setMovies(merged);
        setTotalPages(1);
        if (merged.length > 0 && featuredMovies.length === 0) {
          setFeaturedMovies(merged.slice(0, 6));
        }
        return;
      }

      let url = "";
      
      // Handle Server 2
      if (currentServer === "server2") {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          section: activeCategory,
          sort: sort,
          order: order
        });
        if (searchQuery.trim().length > 0) queryParams.append('search', searchQuery);
        if (year) queryParams.append('year', year);
        if (genre) queryParams.append('genre', genre);
        if (tag) queryParams.append('tag', tag);

        if (contentType === 'movie') {
          url = `/api/server2/movies?${queryParams.toString()}`;
        } else {
          url = `/api/server2/tv-series?${queryParams.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Failed to receive data from Server 2");
        }
        
        const json = await response.json();
        
        // Map Server 2 items to our Movie schema
        const items = Array.isArray(json) ? json : (json.items || json.data || []);
        const mapped = items.map((item: any) => ({
          id: item.slug || item.subject_id || item.id || `s2-${Math.random()}`,
          title: item.name,
          titleAr: item.name,
          titleEn: item.name,
          posterUrl: item.poster_url,
          backdropUrl: item.poster_url,
          year: item.year ? parseInt(item.year) : null,
          rating: item.rating ? parseFloat(item.rating) : null,
          viewCount: 0,
          genre: item.badge || item.genre || null,
          genreAr: item.badge || item.genreAr || null,
          genreEn: item.badge || item.genreEn || null,
          duration: item.duration || item.runtime || null,
          type: item.type || contentType,
          sources: [],
          library: "server2",
          category: {
            id: activeCategory,
            name: "Server 2",
            nameAr: "سيرفر 2",
            nameEn: "Server 2",
            icon: "🌐",
            sortOrder: 1
          },
          externalMetadata: {
            cast: "",
            director: ""
          },
          slug: item.slug || item.subject_id || item.id,
          subject_id: item.subject_id || item.slug
        }));

        setMovies(mapped);
        
        // Handle pagination
        const total = json.total || items.length;
        const perPage = json.per_page || 15;
        setTotalPages(Math.max(1, Math.ceil(total / perPage)));
        
        // Set featuredMovies for slider on Server 2
        if (mapped.length > 0 && !searchQuery) {
          setFeaturedMovies(mapped.slice(0, 6));
        }
        
        return;
      }

      // Handle Server 1
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: '40', // Using 40 as per API examples
        contentType: contentType, // movie or series
        sort: sort,
        order: order
      });
      if (searchQuery.trim().length > 0) queryParams.append('search', searchQuery);
      if (year) queryParams.append('year', year);
      if (genre) queryParams.append('genre', genre);
      if (tag) queryParams.append('tag', tag);
      
      // Use the standard catalog endpoint for most cases
      let endpoint = contentType === 'series' ? '/api/series' : '/api/movies';

      // 1. If searching, fetch from search endpoint
      if (searchQuery.trim().length > 0) {
        // already handled by queryParams
      } 
      // 2. If most-viewed
      else if (activeCategory === "most-viewed") {
        endpoint = `${endpoint}/most-viewed`;
      } 
      // 3. If recently-added
      else if (activeCategory === "recently-added") {
        queryParams.set('sort', 'newest');
      }
      // 4. Else standard category paginated endpoint
      else if (activeCategory && activeCategory !== "most-viewed" && !activeCategory.startsWith("all-")) {
        // GoLive API often uses /category/:id or ?category_id=
        // Based on previous code, it used /category/:id
        endpoint = `${endpoint}/category/${activeCategory}`;
      }

      url = `${endpoint}?${queryParams.toString()}`;

      const response = await fetch(url);
      if (!response.ok) {
        let errorMessage = "Failed to receive data from server";
        try {
          const errorJson = await response.json();
          if (errorJson.details) errorMessage += `: ${errorJson.details}`;
          else if (errorJson.error) errorMessage = errorJson.error;
        } catch (e) {
          // not a json error
        }
        throw new Error(errorMessage);
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

  // Fetch site statistics on mount
  useEffect(() => {
    const fetchStats = async () => {
      try {
        // User requested specific stats: 1761 pages for movies, 568 pages for series
        // Each page has 24 items
        const moviePages = 1761;
        const seriesPages = 568;
        
        setSiteStats({
          movies: moviePages * 24,
          series: seriesPages * 24
        });
        
        // We still fetch to check connectivity but prioritize the requested numbers
        const [moviesRes, seriesRes] = await Promise.all([
          fetch("/api/movies?page=1&limit=1"),
          fetch("/api/series?page=1&limit=1")
        ]);
        
        if (moviesRes.ok && seriesRes.ok) {
          const moviesData = await moviesRes.json();
          const seriesData = await seriesRes.json();
          
          // If the API actually provides meta data, we could use it, 
          // but the user explicitly asked for these specific page counts.
          // Total = totalPages * 24 as requested
          if (moviesData.meta?.totalPages > 1000) { // Only override if API seems to match user's massive scale
             setSiteStats(prev => ({
               ...prev,
               movies: moviesData.meta.totalPages * 24,
               series: seriesData.meta.totalPages * 24
             }));
          }
        }
      } catch (e) {
        console.error("Failed to fetch site statistics", e);
      }
    };
    fetchStats();
  }, []);

  // Fetch featured content specifically from API to populate slider with mixed content from both servers
  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const results: Movie[] = [];
        
        // 1. Fetch Server 1 Movies (Top 3)
        try {
          const m1Res = await fetch('/api/movies/most-viewed?limit=4');
          if (m1Res.ok) {
            const data = await m1Res.json();
            if (Array.isArray(data)) results.push(...data.slice(0, 3));
          }
        } catch (e) { console.error("S1 Movies fetch error", e); }

        // 2. Fetch Server 1 Series (Top 3)
        try {
          const s1Res = await fetch('/api/series/most-viewed?limit=4');
          if (s1Res.ok) {
            const data = await s1Res.json();
            if (Array.isArray(data)) results.push(...data.slice(0, 3));
          }
        } catch (e) { console.error("S1 Series fetch error", e); }

        // 3. Fetch Server 2 Content (Top 4)
        try {
          const s2Res = await fetch('/api/server2/movies?section=most-viewed&limit=6');
          if (s2Res.ok) {
            const json = await s2Res.json();
            const items = Array.isArray(json) ? json : (json.items || json.data || []);
            const mapped = items.slice(0, 4).map((item: any) => ({
              id: item.slug || item.subject_id || item.id || `s2-feat-${Math.random()}`,
              title: item.name,
              titleAr: item.name,
              titleEn: item.name,
              posterUrl: item.poster_url,
              backdropUrl: item.poster_url,
              year: item.year ? parseInt(item.year) : null,
              rating: item.rating ? parseFloat(item.rating) : 8.5,
              viewCount: 0,
              genre: item.badge || null,
              genreAr: item.badge || null,
              genreEn: item.badge || null,
              sources: [],
              library: "server2",
              category: { id: "featured", name: "Featured", nameAr: "مميز", nameEn: "Featured", icon: "⭐", sortOrder: 1 },
              externalMetadata: { cast: "", director: "" },
              slug: item.slug || item.subject_id || item.id,
              subject_id: item.subject_id || item.slug
            }));
            results.push(...mapped);
          }
        } catch (e) { console.error("S2 Content fetch error", e); }

        // Interleave or shuffle results slightly to make it mixed
        const mixed = results.sort(() => Math.random() - 0.5);
        if (mixed.length > 0) {
          setFeaturedMovies(mixed);
        }
      } catch (error) {
        console.error("Failed to fetch featured content for slider:", error);
      }
    };
    fetchFeatured();
  }, []); // Run once on mount to populate global slider

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
  }, [activeCategory, page, contentType, searchQuery, currentServer]);

  // Handle Search triggers
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMovies();
  };

  const clearSearch = () => {
    setSearchQuery("");
    setPage(1);
    setSort("newest");
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
    setSort("newest");
  };

  return (
    <div 
      dir={isAr ? "rtl" : "ltr"} 
      className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-red-600 selection:text-white font-sans flex flex-col"
    >
      <AnimatePresence>
        {!isLicenseActive && !isCheckingLicense && (
          <LicenseActivationScreen 
          isAr={isAr} 
          t={t} 
          onActivate={handleActivate}
          error={licenseError}
          isActivating={isActivating}
        />
        )}
      </AnimatePresence>

      {isCheckingLicense ? (
        <div className="fixed inset-0 z-[60] bg-zinc-950 flex flex-col items-center justify-center gap-4">
           <RefreshCw className="h-10 w-10 text-red-600 animate-spin" />
           <span className="text-zinc-500 font-bold tracking-widest uppercase text-xs">Checking License...</span>
        </div>
      ) : isLicenseActive && (
        <>
          {/* Dynamic Background Backdrop subtle glow */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[500px] bg-red-600/5 rounded-full blur-[120px] pointer-events-none" />

      {/* Navbar Header */}
      <header className="sticky top-0 z-40 bg-zinc-950/95 backdrop-blur-xl border-b border-zinc-900/80 px-4 py-3 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Logo & Toggles Group */}
          <div className="flex flex-col items-center md:items-start gap-4">
            <div 
              className="cursor-pointer group flex flex-col items-center md:items-start mb-1 select-none"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("most-viewed");
                setPage(1);
              }}
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-105">
                {isAr ? (
                  <>
                    <span className="text-white">ليبيـ</span>
                    <span className="text-red-600">فليكس</span>
                  </>
                ) : (
                  <>
                    <span className="text-white">LIBY</span>
                    <span className="text-red-600">FLIX</span>
                  </>
                )}
              </h1>
              <div className="h-1 w-full bg-gradient-to-r from-red-600 to-transparent rounded-full mt-0.5 opacity-50" />
            </div>

            {/* Toggles Row */}
            <div className="flex items-center gap-3">
              {/* Content Type Toggle */}
              <button
                onClick={() => setContentType(contentType === "movie" ? "series" : "movie")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all duration-300 font-black text-[10px] uppercase tracking-tighter cursor-pointer shadow-md active:scale-95 ${
                  contentType === "movie" 
                    ? "bg-red-600 border-red-600 text-white" 
                    : "bg-blue-600 border-blue-600 text-white"
                }`}
              >
                {contentType === "movie" ? <Film className="h-3.5 w-3.5" /> : <Tv className="h-3.5 w-3.5" />}
                <span>{contentType === "movie" ? (isAr ? "أفلام" : "Movies") : (isAr ? "مسلسلات" : "Series")}</span>
              </button>

              {/* Server Toggle */}
              <button
                onClick={() => handleServerSwitch(currentServer === "server1" ? "server2" : "server1")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 bg-zinc-900/50 border-zinc-800 transition-all duration-300 font-black text-[10px] uppercase tracking-tighter cursor-pointer shadow-md active:scale-95 text-zinc-300 hover:border-red-600/50 hover:text-white`}
              >
                <Globe className="h-3.5 w-3.5 text-red-600" />
                <span>{currentServer === "server1" ? (isAr ? "السيرفر 1" : "Server 1") : (isAr ? "السيرفر 2" : "Server 2")}</span>
              </button>

              {/* Remaining Days */}
              {licenseInfo && licenseInfo.remainingDays !== undefined && (
                <div className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-amber-500/30 bg-amber-500/10 text-amber-500 font-black text-[10px] uppercase tracking-tighter shadow-md">
                  <Hourglass className="h-3.5 w-3.5 animate-pulse" />
                  <span>{licenseInfo.remainingDays} {isAr ? "أيام متبقية" : "Days Left"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Search bar & Language Toggle */}
          <div className="flex items-center gap-4 w-full md:w-auto flex-1 max-w-2xl justify-end">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full group">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/40 hover:bg-zinc-900 border-2 border-zinc-800/80 focus:border-red-600/60 rounded-2xl pl-12 pr-4 py-3 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-red-600/5 transition-all duration-300"
                />
                <div className={`absolute inset-y-0 ${isAr ? "right-4" : "left-4"} flex items-center text-zinc-500 group-focus-within:text-red-500 transition-colors`}>
                  <Search className="h-4.5 w-4.5" />
                </div>
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className={`absolute inset-y-0 ${isAr ? "left-4" : "right-4"} text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest`}
                  >
                    {isAr ? "مسح" : "Clear"}
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-2xl text-sm font-black transition-all shadow-lg shadow-red-600/20 active:scale-95"
              >
                {isAr ? "بحث" : "Search"}
              </button>
            </form>

            <button
              onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
              className="flex items-center gap-2 px-3 py-3 rounded-2xl bg-zinc-900/50 border-2 border-zinc-800 text-[10px] font-black text-zinc-400 hover:text-white hover:border-zinc-600 transition-all cursor-pointer backdrop-blur-md hidden sm:flex"
            >
              <Globe className="h-3.5 w-3.5 text-red-600" />
              <span>{isAr ? "EN" : "AR"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sorting & Filtering Bar */}
      <div className="sticky top-[86px] md:top-[74px] z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 px-4 py-2">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide text-xs">
          <select 
            value={sort} 
            onChange={(e) => { setSort(e.target.value); setPage(1); }} 
            className="bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-red-600"
          >
            <option value="newest">{isAr ? "الأحدث" : "Newest"}</option>
            <option value="oldest">{isAr ? "الأقدم" : "Oldest"}</option>
            <option value="trending">{isAr ? "الأكثر مشاهدة" : "Trending"}</option>
            <option value="popular">{isAr ? "الأكثر شعبية" : "Popular"}</option>
            <option value="rating">{isAr ? "التقييم" : "Rating"}</option>
            <option value="title">{isAr ? "الاسم" : "Title"}</option>
            <option value="recently_added">{isAr ? "المضافة حديثاً" : "Recently Added"}</option>
          </select>

          <select 
            value={order} 
            onChange={(e) => { setOrder(e.target.value as "asc" | "desc"); setPage(1); }} 
            className="bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1.5 text-zinc-300 focus:outline-none focus:border-red-600"
          >
            <option value="asc">{isAr ? "تصاعدي" : "Asc"}</option>
            <option value="desc">{isAr ? "تنازلي" : "Desc"}</option>
          </select>
        </div>
      </div>

      {/* Featured Movies Slider (Only shown when not searching and on home category) */}
      {!loading && !error && (activeCategory === "most-viewed" || activeCategory === "all-movies" || activeCategory === "all-series") && !searchQuery && featuredMovies.length > 0 && (
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
                    src={movie.backdropUrl || movie.posterUrl || "https://i.top4top.io/p_3839qx2t30.png"}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-[0.55] saturate-[1.1] scale-100"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://i.top4top.io/p_3839qx2t30.png";
                    }}
                  />

                  {/* Hero text details overlay */}
                  <div className="absolute inset-0 z-20 flex items-center">
                    <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
                      <div className="max-w-2xl flex flex-col items-start gap-3 sm:gap-4 text-zinc-100">
                        
                        {/* Tag */}
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                          <span className={`text-white text-[10px] sm:text-[11px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-lg ${movie.library === 'server2' ? 'bg-blue-600 shadow-blue-600/20' : 'bg-red-600 shadow-red-600/20'}`}>
                            {movie.library === 'server2' ? (isAr ? "سيرفر 2" : "SERVER 2") : (isAr ? "سيرفر 1" : "SERVER 1")}
                          </span>
                          <span className="bg-zinc-800/80 border border-zinc-700 text-white text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                            {movie.library === 'server2' ? (movie.type === 'series' ? (isAr ? "مسلسل" : "SERIES") : (isAr ? "فيلم" : "MOVIE")) : ((movie.sources && movie.sources.length > 0) || movie.type === 'movie' ? (isAr ? "فيلم" : "MOVIE") : (isAr ? "مسلسل" : "SERIES"))}
                          </span>
                          <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                            {isAr ? (movie.genreAr || movie.genre || "منوع") : (movie.genreEn || movie.genre || "General")}
                          </span>
                          {movie.duration && !isNaN(Number(movie.duration)) && (movie.type === 'movie' || (movie.sources && movie.sources.length > 0) || (!movie.type && !movie.episodes)) && (
                            <span className="bg-zinc-800/80 border border-zinc-700 text-zinc-300 text-[11px] font-bold px-2 py-0.5 rounded uppercase">
                              {Math.floor(Number(movie.duration) / 60) > 0 ? `${Math.floor(Number(movie.duration) / 60)}${isAr ? 'س ' : 'h '}` : ''}
                              {Number(movie.duration) % 60 > 0 ? `${Number(movie.duration) % 60}${isAr ? 'د' : 'm'}` : ''}
                            </span>
                          )}
                          {movie.rating && (
                            <span className="bg-zinc-800/80 border border-zinc-700 text-amber-500 text-[11px] font-bold px-2 py-0.5 rounded">
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
            {currentServer !== "server2" && STATIC_CATEGORIES.map((cat) => (
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
            {(currentServer === "server2" ? dynamicCategories : dynamicCategories.slice(0, 3)).map((cat) => (
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
            {currentServer !== "server2" && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white"
              >
                {isAr ? "المزيد" : "More"}
              </button>
            )}
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
                {dynamicCategories.map((cat) => (
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
                      ? (currentServer === "server2" ? dynamicCategories : [...STATIC_CATEGORIES, ...dynamicCategories]).find(c => c.id === activeCategory)?.nameAr 
                      : (currentServer === "server2" ? dynamicCategories : [...STATIC_CATEGORIES, ...dynamicCategories]).find(c => c.id === activeCategory)?.nameEn)}
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1 font-medium">
                {isAr ? `${movies.length} مسلسل متاح حالياً` : `${movies.length} series available currently`}
              </p>
            </div>
          </div>

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
              key={`${activeCategory}-${page}-${searchQuery}-${sort}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex flex-col gap-10"
            >
              {searchQuery ? (
                <div className="flex flex-col gap-12 w-full">
                  {/* Server 1 Section */}
                  {movies.filter(m => (m as any).library !== "server2").length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 px-1">
                        <div className="h-6 w-1 bg-red-600 rounded-full" />
                        <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                          <Play className="h-4 w-4 text-red-600 fill-current" />
                          {isAr ? "السيرفر الأول" : "Server 1"}
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent ml-4" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies
                          .filter(m => (m as any).library !== "server2")
                          .map((movie) => (
                            <MovieCard
                              key={movie.id}
                              movie={movie}
                              language={language}
                              onClick={() => playMovie(movie)}
                            />
                          ))}
                      </div>
                    </div>
                  )}

                  {/* Server 2 Section */}
                  {movies.filter(m => (m as any).library === "server2").length > 0 && (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3 px-1">
                        <div className="h-6 w-1 bg-blue-600 rounded-full" />
                        <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
                          <Globe className="h-4 w-4 text-blue-500" />
                          {isAr ? "السيرفر الثاني" : "Server 2"}
                        </h2>
                        <div className="h-px flex-1 bg-gradient-to-r from-zinc-800 to-transparent ml-4" />
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {movies
                          .filter(m => (m as any).library === "server2")
                          .map((movie) => (
                            <MovieCard
                              key={movie.id}
                              movie={movie}
                              language={language}
                              onClick={() => playMovie(movie)}
                            />
                          ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div 
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                >
                  {movies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      language={language}
                      onClick={() => playMovie(movie)}
                    />
                  ))}
                </div>
              )}

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
      <footer className="mt-auto border-t border-zinc-900 bg-zinc-950 py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Site Stats Footer Dashboard */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10 pb-10 border-b border-zinc-900/50">
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-2">{isAr ? "إجمالي الأفلام" : "Total Movies"}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tighter">{(siteStats.movies).toLocaleString()}</span>
                <span className="text-[10px] text-zinc-600 font-bold uppercase">{isAr ? "محتوى" : "Titles"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-2">{isAr ? "إجمالي المسلسلات" : "Total Series"}</span>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-white tracking-tighter">{(siteStats.series).toLocaleString()}</span>
                <span className="text-[10px] text-zinc-600 font-bold uppercase">{isAr ? "محتوى" : "Series"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-2">{isAr ? "حالة الخدمة" : "Service Status"}</span>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-sm font-black text-emerald-500 uppercase tracking-wider">{isAr ? "متصل" : "Live"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-2">{isAr ? "دقة البث" : "Streaming Quality"}</span>
              <span className="text-sm font-black text-red-600 uppercase tracking-widest">4K UHD / HDR</span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 text-center text-xs text-zinc-500 font-medium pt-8 border-t border-zinc-900/50">
            <div className="flex flex-col items-center md:items-start gap-3">
              <div className="flex items-center gap-1 text-2xl font-black tracking-tighter">
                {isAr ? (
                  <>
                    <span className="text-zinc-300">ليبيـ</span>
                    <span className="text-red-600">فليكس</span>
                  </>
                ) : (
                  <>
                    <span className="text-zinc-300">LIBY</span>
                    <span className="text-red-600">FLIX</span>
                  </>
                )}
              </div>
              <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.3em]">© 2026 {t.allRightsReserved}</span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {licenseInfo && (
                <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-800/80 px-5 py-2.5 rounded-2xl shadow-xl">
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{t.licenseStatus}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-black text-white uppercase">{t.active}</span>
                    </div>
                  </div>
                  <div className="h-8 w-px bg-zinc-800" />
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] text-zinc-500 font-black uppercase tracking-widest">{t.remainingDays}</span>
                    <span className="text-sm font-black text-red-500">{licenseInfo.remainingDays} {t.days}</span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 bg-zinc-900/20 border border-zinc-800 px-4 py-2.5 rounded-2xl">
                <Activity className="h-4 w-4 text-emerald-500" />
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">System Status: Secured</span>
              </div>
              
              <div className="flex items-center gap-1.5 justify-center bg-zinc-900/40 border border-zinc-850 px-5 py-2 rounded-2xl text-zinc-400 font-extrabold text-[11px] transition-all hover:border-red-600/30 hover:text-white">
                <span>صنع ❤️ البيضاء ليبيا</span>
              </div>
            </div>

            <div className="flex items-center gap-8">
              <a href="#" className="hover:text-red-500 transition-colors uppercase tracking-[0.2em] font-black text-[10px]">{isAr ? "سياسة الخصوصية" : "Privacy"}</a>
              <a href="#" className="hover:text-red-500 transition-colors uppercase tracking-[0.2em] font-black text-[10px]">{isAr ? "الشروط" : "Terms"}</a>
              <a href="#" className="hover:text-red-500 transition-colors uppercase tracking-[0.2em] font-black text-[10px]">{isAr ? "الدعم" : "Support"}</a>
            </div>
          </div>
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

              {/* Interactive Inline Player for Server 2 */}
              {currentServer === "server2" && (
                <div className="w-full bg-black border-b border-zinc-800/80 overflow-hidden relative shadow-2xl">
                  {/* Subtle decorative glow */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-0.5 bg-gradient-to-r from-transparent via-red-600/60 to-transparent blur-sm z-10 pointer-events-none" />
                  <div className="w-full aspect-video max-h-[500px] relative">
                    <iframe
                      src={
                        selectedMovie.episodes && selectedMovie.episodes.length > 0
                          ? `${window.location.origin}/api/server2/stream?subject_id=${selectedMovie.id || selectedMovie.slug}&se=${activeSeason}&ep=${activeEpisode}&source_index=${activeSourceIndex}`
                          : `${window.location.origin}/api/server2/stream?subject_id=${selectedMovie.id || selectedMovie.slug}&source_index=${activeSourceIndex}`
                      }
                      className="w-full h-full border-none shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                      allowFullScreen
                      allow="autoplay; encrypted-media; picture-in-picture"
                      title={selectedMovie.title}
                      sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                      referrerPolicy="no-referrer"
                    />
                    
                    {/* Pop-up Ad Blocker Indicator Overlay */}
                    
                </div>
              )}


              {/* Movie Details Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 bg-gradient-to-b from-zinc-900 to-zinc-950">
                
                {/* Main Details Panel */}
                <div className="md:col-span-8 flex flex-col gap-5">
                  <div className="flex gap-6 items-start">
                    <div className="w-24 h-36 md:w-32 md:h-48 relative shadow-2xl border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                      <img 
                        src={selectedMovie.posterUrl || selectedMovie.backdropUrl || "https://i.top4top.io/p_3839qx2t30.png"} 
                        alt={selectedMovie.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://i.top4top.io/p_3839qx2t30.png";
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
                        {selectedMovie.duration && !isNaN(Number(selectedMovie.duration)) && (
                          <span className="bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-zinc-400" />
                            {(selectedMovie.type === 'movie' || (selectedMovie.sources && selectedMovie.sources.length > 0) || (!selectedMovie.type && (!selectedMovie.episodes || selectedMovie.episodes.length === 0))) ? (
                              <>
                                {Math.floor(Number(selectedMovie.duration) / 60) > 0 ? `${Math.floor(Number(selectedMovie.duration) / 60)}${isAr ? 'س ' : 'h '}` : ''}
                                {Number(selectedMovie.duration) % 60 > 0 ? `${Number(selectedMovie.duration) % 60}${isAr ? 'د' : 'm'}` : ''}
                              </>
                            ) : (
                              <>{selectedMovie.duration} {isAr ? "حلقة" : "eps"}</>
                            )}
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
                        {isAr ? ((selectedMovie.type === 'movie' || (selectedMovie.sources && selectedMovie.sources.length > 0) || (!selectedMovie.type && (!selectedMovie.episodes || selectedMovie.episodes.length === 0))) ? "قصة الفيلم" : "قصة المسلسل") : "Synopsis"}
                      </h4>
                      <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-medium">
                        {isAr ? selectedMovie.descriptionAr || selectedMovie.description : selectedMovie.descriptionEn || selectedMovie.description}
                      </p>
                    </div>
                  )}

                  {/* Episodes List */}
                  {selectedMovie.episodes && selectedMovie.episodes.length > 0 && (
                    <div className="flex flex-col gap-3 pt-3 border-t border-zinc-800/60">
                      <h4 className="text-xs font-black uppercase tracking-wider text-red-500">
                        {isAr ? "الحلقات" : "Episodes"} ({selectedMovie.episodes.length})
                      </h4>
                      <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                        {selectedMovie.episodes
                          .sort((a, b) => a.seasonNumber - b.seasonNumber || a.episodeNumber - b.episodeNumber)
                          .map((ep) => (
                          <div key={ep.id} className="bg-zinc-900 border border-zinc-800 p-3 rounded-xl flex items-center gap-3">
                            <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-1 rounded bg-zinc-800/50 text-zinc-500 shrink-0 ${isAr ? "order-last" : ""}`}>
                              {isAr ? (
                                `م${ep.seasonNumber} ح${ep.episodeNumber}`
                              ) : (
                                `S${ep.seasonNumber}E${ep.episodeNumber}`
                              )}
                            </span>
                            <span className={`text-sm font-bold text-zinc-200 flex-1 ${isAr ? "text-right" : "text-left"}`}>
                              {isAr && ep.title.toLowerCase().startsWith("episode") 
                                ? ep.title.replace(/episode/i, "الحلقة") 
                                : ep.title}
                            </span>
                            {currentServer === "server2" ? (
                              <button
                                onClick={() => {
                                  setActiveSeason(ep.seasonNumber);
                                  setActiveEpisode(ep.episodeNumber);
                                }}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all cursor-pointer ${
                                  activeSeason === ep.seasonNumber && activeEpisode === ep.episodeNumber
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
                                    : "bg-zinc-800 hover:bg-zinc-750 text-zinc-300"
                                }`}
                              >
                                {activeSeason === ep.seasonNumber && activeEpisode === ep.episodeNumber
                                  ? (isAr ? "مشغّل الآن" : "Playing Now")
                                  : (isAr ? "شاهد" : "Watch")}
                              </button>
                            ) : ep.sources.length > 0 && (
                              <button
                                onClick={() => handleVLCStream(ep.sources[0].streamUrl)}
                                className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[10px] font-black"
                              >
                                {isAr ? "شاهد" : "Watch"}
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
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
                  {selectedMovie.sources && selectedMovie.sources.length > 0 ? (
                    <div className="pt-4 border-t border-zinc-800/60 flex flex-col sm:flex-row sm:items-center gap-3">
                      <div className="flex flex-wrap gap-2 shrink-0 w-full sm:w-auto">
                        {currentServer !== "server2" ? (
                          <>
                            <p className="text-xs font-bold text-zinc-400 leading-relaxed flex-1 sm:hidden">
                              {isAr 
                                ? "يمكنك مشاهدة الفيلم مباشرة في مشغل خارجي:" 
                                : "You can watch the movie directly in an external player:"}
                            </p>
                            <button
                              onClick={() => {
                                const url = selectedMovie.sources[activeSourceIndex]?.streamUrl;
                                if (url) {
                                  handleVLCStream(url);
                                }
                              }}
                              className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 border border-red-500 text-sm font-bold text-white transition-all flex items-center justify-center gap-2 cursor-pointer flex-1 sm:flex-initial shadow-lg shadow-red-600/10"
                            >
                              <Play className="h-4 w-4 text-white fill-current" />
                              <span>
                                {isAr ? "تشغيل في VLC" : "Play in VLC"}
                              </span>
                            </button>
                          </>
                        ) : null}
                      </div>
                    </div>
                  ) : (!selectedMovie.episodes || selectedMovie.episodes.length === 0) && currentServer !== "server2" && (
                    <div className="pt-4 border-t border-zinc-800/60">
                      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center flex flex-col items-center justify-center gap-3">
                        <WifiOff className="h-8 w-8 text-red-500 mb-1" />
                        <h4 className="text-sm font-black text-zinc-200">
                          {isAr ? "السيرفر غير متاح حالياً" : "Server Unavailable"}
                        </h4>
                        <p className="text-xs font-medium text-zinc-500 leading-relaxed">
                          {isAr ? "عذراً، لا توجد روابط مشاهدة متاحة لهذا المحتوى في الوقت الحالي." : "Sorry, there are no streaming links available for this content right now."}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sidebar Details Panel */}
                <div className={`md:col-span-4 flex flex-col gap-6 pt-6 md:pt-0 ${isAr ? "md:border-r border-zinc-850 md:pr-6 md:pl-0" : "md:border-l border-zinc-850 md:pl-6 md:pr-0"}`}>
                  
                  {/* Poster Thumbnail */}
                  <img
                    src={selectedMovie.posterUrl || selectedMovie.backdropUrl || "https://i.top4top.io/p_3839qx2t30.png"}
                    alt={selectedMovie.title}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[2/3] object-cover rounded-2xl border border-zinc-800 hidden md:block shadow-lg"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "https://i.top4top.io/p_3839qx2t30.png";
                    }}
                  />

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

      {/* Activation Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 relative overflow-hidden shadow-2xl flex flex-col items-center"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-green-600/10 to-transparent pointer-events-none" />
              <div className="h-20 w-20 bg-green-600/20 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-black text-white text-center mb-2">
                {isAr ? "تم التفعيل بنجاح!" : "Activated Successfully!"}
              </h2>
              <p className="text-sm text-zinc-400 text-center mb-6">
                {isAr ? "مرحباً بك في عالم الترفيه مع ليبيـفليكس" : "Welcome to the entertainment world of LibyFlix"}
              </p>
              
              <div className="w-full bg-zinc-800/50 rounded-2xl p-4 mb-6 border border-zinc-700/50 flex flex-col gap-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold">{isAr ? "كود التفعيل" : "License Code"}</span>
                  <span className="text-white font-mono">{licenseCode}</span>
                </div>
                {licenseInfo && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-bold">{isAr ? "الأيام المتبقية" : "Days Remaining"}</span>
                    <span className="text-green-500 font-black">{licenseInfo.remainingDays} {isAr ? "يوم" : "Days"}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-zinc-500 font-bold">{isAr ? "معرف الجهاز" : "Device ID"}</span>
                  <span className="text-white font-mono">{getDeviceId().substring(0, 8)}</span>
                </div>
              </div>

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-green-600/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {isAr ? "اغلاق والبدء بالمشاهدة" : "Close & Start Watching"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </>
  )}
</div>
);
}
