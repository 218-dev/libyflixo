import React, { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, Film, Flame, Globe, LayoutGrid, AlertCircle, RefreshCw, Loader2, Hourglass,
  ChevronLeft, ChevronRight, Play, Info, Trophy, Tv, Calendar, Clock, Activity, Zap,
  Bell, Sparkles, X, ExternalLink, Eye, Star, Download, Volume2, VolumeX, Music, WifiOff,
  Heart, Hand, Smartphone, Monitor
} from "lucide-react";
import { Movie, Language } from "./types";
import MovieCard from "./components/MovieCard";
import ImageWithFallback from "./components/ImageWithFallback";

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
    noMatches: "No matches scheduled for today.",
    recentSearches: "Recent Searches",
    clearHistory: "Clear",
    licenseTitle: "Activate Subscription",
    licenseSubtitle: "Please enter your activation code to access all Libyflix features",
    licensePlaceholder: "Enter activation code here...",
    activate: "Activate Now",
    activating: "Activating...",
    licenseStatus: "Subscription Status",
    active: "Active",
    expired: "Expired",
    remainingDays: "Days Remaining",
    invalidCode: "Invalid or expired activation code",
    errorCode: "An error occurred during activation. Please try again later.",
    days: "Days",
    installApp: "Install App",
    pwaModalTitle: "Install Libyflix App",
    pwaModalDesc: "Install Libyflix on your device for a full-screen, lightning-fast cinema experience on your Computer, Mobile, Tablet, or Smart TV.",
    pwaNativeInstallBtn: "Install App on this Device",
    pwaHowToTitle: "Installation Guide by Device",
    pwaSafariInstructions: "Apple iOS / Safari (iPhone & iPad)",
    pwaSafariStep1: "Tap the Share button in Safari's bottom navigation bar.",
    pwaSafariStep2: "Scroll down and select 'Add to Home Screen'.",
    pwaSafariStep3: "Tap 'Add' in the top right corner to complete installation.",
    pwaAndroidInstructions: "Android / Chrome Mobile",
    pwaAndroidStep1: "Tap the 3-dots menu in Chrome's top right corner.",
    pwaAndroidStep2: "Select 'Install app' or 'Add to Home screen' from the menu.",
    pwaTvInstructions: "Android TV / Smart TV",
    pwaTvStep1: "Open this website using a browser on your TV (such as TV Bro, JioPages, or Chrome).",
    pwaTvStep2: "Using your remote, navigate to browser options and select 'Install app' or 'Pin to Home Screen'.",
    pwaDesktopInstructions: "Computer (PC / Mac)",
    pwaDesktopStep1: "Click the small Install icon in Chrome's URL bar (top right).",
    pwaDesktopStep2: "Alternatively, click the 3-dots browser menu and choose 'Install Libyflix'.",
    close: "Close",
    offlineTitle: "You are Offline",
    offlineDesc: "It seems you are not connected to the internet right now. Please check your network connection and try again.",
    offlineSavedHint: "Don't worry, Libyflix is installed as a PWA and is ready to load on your device as soon as you reconnect!"
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
    days: "أيام",
    recentSearches: "عمليات البحث الأخيرة",
    clearHistory: "مسح الكل",
    installApp: "تثبيت التطبيق",
    pwaModalTitle: "تثبيت تطبيق ليبيفليكس",
    pwaModalDesc: "قم بتثبيت التطبيق على جهازك للاستمتاع بتجربة مشاهدة سينمائية سريعة وبملء الشاشة على الكمبيوتر، الهاتف، الآيباد أو شاشات التلفزيون الذكية.",
    pwaNativeInstallBtn: "تثبيت التطبيق على هذا الجهاز",
    pwaHowToTitle: "دليل التثبيت حسب نوع الجهاز",
    pwaSafariInstructions: "أجهزة آبل (آيفون وآيباد) - سفاري",
    pwaSafariStep1: "اضغط على زر المشاركة (Share) في شريط سفاري السفلي.",
    pwaSafariStep2: "قم بالتمرير لأسفل واضغط على خيار 'إضافة إلى الشاشة الرئيسية' (Add to Home Screen).",
    pwaSafariStep3: "اضغط على 'إضافة' (Add) في أعلى اليمين لإتمام التثبيت.",
    pwaAndroidInstructions: "أندرويد وهواتف كروم",
    pwaAndroidStep1: "اضغط على زر الخيارات (3 نقاط) في أعلى يمين متصفح كروم.",
    pwaAndroidStep2: "اختر 'تثبيت التطبيق' أو 'إضافة إلى الشاشة الرئيسية' من القائمة.",
    pwaTvInstructions: "شاشات التلفزيون الذكية (Smart TV / Android TV)",
    pwaTvStep1: "افتح الموقع في متصفح الشاشة (مثل متصفح TV Bro أو Chrome أو JioPages).",
    pwaTvStep2: "باستخدام جهاز التحكم (الريموت)، افتح خيارات المتصفح واختر 'إضافة للصفحة الرئيسية' أو 'تثبيت'.",
    pwaDesktopInstructions: "أجهزة الكمبيوتر واللابتوب",
    pwaDesktopStep1: "انقر على أيقونة التثبيت الصغيرة في شريط العنوان (أعلى اليمين) لمتصفح كروم.",
    pwaDesktopStep2: "أو افتح قائمة المتصفح (3 نقاط) واختر 'تثبيت ليبيفليكس' (Install Libyflix).",
    close: "إغلاق",
    offlineTitle: "أنت غير متصل بالإنترنت",
    offlineDesc: "يبدو أنك غير متصل بالشبكة حالياً. يرجى التحقق من اتصال الإنترنت وجهاز التوجيه الخاص بك ثم المحاولة مجدداً.",
    offlineSavedHint: "لا تقلق! تطبيق ليبيفليكس يدعم التشغيل دون إنترنت كـ PWA، وسيتم إعادة الاتصال تلقائياً بمجرد توفر الخدمة."
  }
};

const STATIC_CATEGORIES = [
  { id: "most-viewed", nameAr: "الأكثر مشاهدة", nameEn: "Most Viewed" },
  { id: "recently-added", nameAr: "المضافة حديثاً", nameEn: "Recently Added" },
];

const SERVER1_MOVIE_CATEGORIES = [
  { id: "2185cd2d-f379-4584-8caa-5884bced7150", nameAr: "أفلام عربية", nameEn: "Arabic Movies", icon: "🇸🇦", library: "server1" },
  { id: "9ec354e5-4707-4161-9dab-b51f899b29d8", nameAr: "أفلام أجنبية", nameEn: "Foreign Movies", icon: "🌍", library: "server1" },
  { id: "baa2d0f9-19ef-4317-adb6-5ef89ff1448e", nameAr: "أفلام هندية", nameEn: "Indian Movies", icon: "🇮🇳", library: "server1" },
  { id: "3443bc74-5492-4abb-a8f1-26b15f6bb814", nameAr: "أفلام آسيوية", nameEn: "Asian Movies", icon: "🎎", library: "server1" },
  { id: "69e9a8d2-2e75-415c-b5f2-cb87b2171f1c", nameAr: "رياضة", nameEn: "Sports", icon: "⚽", library: "server1" }
];

const SERVER1_SERIES_CATEGORIES = [
  { id: "dd185bc6-1dfd-45c2-9189-13c47f672e5a", nameAr: "مسلسلات عربية", nameEn: "Arabic Series", icon: "🇸🇦", library: "server1" },
  { id: "32d17563-00ee-4433-8b59-ddf969a51230", nameAr: "مسلسلات تركية", nameEn: "Turkish Series", icon: "🇹🇷", library: "server1" },
  { id: "1bf63825-0b85-4ed8-8964-4cf2efb854d6", nameAr: "مسلسلات أجنبية", nameEn: "Foreign Series", icon: "🌍", library: "server1" },
  { id: "0669005a-e8dd-4a00-8986-a905826eaca3", nameAr: "مسلسلات آسيوية", nameEn: "Asian Series", icon: "🎎", library: "server1" },
  { id: "2660c480-65f2-4a30-a0c9-eda017ea660b", nameAr: "مسلسلات مدبلجة", nameEn: "Dubbed Series", icon: "🗣️", library: "server1" }
];

const SERVER1_GENRES: Record<string, { id: string; nameAr: string; nameEn: string; icon: string }[]> = {
  "9ec354e5-4707-4161-9dab-b51f899b29d8": [
    { id: "8d52c9b1-78d7-409f-be9c-c85858faca64", nameAr: "أكشن", nameEn: "Action", icon: "💥" },
    { id: "31f47cc2-83fa-49a5-a9cf-f09bed8b9d6e", nameAr: "كوميديا", nameEn: "Comedy", icon: "🎭" },
    { id: "e8e00aa8-8b3d-4ecd-ad6f-a116f06b5923", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "a3635dda-d79e-4f53-923a-bb3ac07e8cd2", nameAr: "رعب", nameEn: "Horror", icon: "👻" },
    { id: "96866eb1-2329-43f0-881a-65e8534e2eac", nameAr: "إثارة", nameEn: "Thriller", icon: "😱" },
    { id: "f22a2327-8a0f-4fdf-8c79-67c1a6223cc1", nameAr: "رومانسي", nameEn: "Romance", icon: "❤️" },
    { id: "4c5550aa-4eee-4981-92e4-9788d08a0f63", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "b8c4d6fd-e916-44a7-83a5-73cdba8c17b6", nameAr: "مغامرة", nameEn: "Adventure", icon: "🏔️" },
    { id: "9f179389-c0a2-4ad5-884b-c94465139a4e", nameAr: "خيال علمي", nameEn: "Science Fiction", icon: "🛸" },
    { id: "daefd309-176d-4e75-a1d9-025558bc0079", nameAr: "موسيقي", nameEn: "Music", icon: "🎵" },
    { id: "409f5762-8b43-4c96-8f3d-68197aa1b657", nameAr: "غموض", nameEn: "Mystery", icon: "🔍" },
    { id: "3dd6c8b4-a839-49a9-b993-e9cea50ef699", nameAr: "تاريخي", nameEn: "History", icon: "📜" },
    { id: "7d815264-a4bc-421a-a4c3-bff920866ac3", nameAr: "غربي", nameEn: "Western", icon: "🤠" },
    { id: "40cc573c-d7cc-4af4-a811-b8cae6934452", nameAr: "عائلي", nameEn: "Family", icon: "👨‍👩‍👧‍👦" },
    { id: "24292879-c3a5-4922-9642-4f7e8e8d9663", nameAr: "فانتازيا", nameEn: "Fantasy", icon: "🧙" },
    { id: "65aad78c-8ee9-44c0-b9f6-12c5ec0f1a19", nameAr: "وثائقي", nameEn: "Documentary", icon: "🎥" },
    { id: "7d7385fa-7743-4baf-9ae1-40e93b3e990b", nameAr: "أفلام تلفزيونية", nameEn: "TV Movie", icon: "📺" }
  ],
  "baa2d0f9-19ef-4317-adb6-5ef89ff1448e": [
    { id: "85442355-2bc1-409e-828a-4a650c4f7c81", nameAr: "أكشن", nameEn: "Action", icon: "💥" },
    { id: "c294f549-0332-490b-8c9f-49aa795b54f6", nameAr: "كوميديا", nameEn: "Comedy", icon: "🎭" },
    { id: "8eb3c746-6cf9-41f4-a5d0-ed2154b375ff", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "749bc937-9f85-4685-a9fe-b92b7b722a46", nameAr: "رومانسي", nameEn: "Romance", icon: "❤️" },
    { id: "8d14cf14-8441-4715-b42a-35226a95e6be", nameAr: "إثارة", nameEn: "Thriller", icon: "😱" },
    { id: "2a704fc5-597d-4421-944d-d66368603f8c", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "4780c79d-f0f3-47fe-bd90-6798726521df", nameAr: "رعب", nameEn: "Horror", icon: "👻" },
    { id: "f9ef9707-a08d-474a-aab9-e2c8031a8f22", nameAr: "مغامرة", nameEn: "Adventure", icon: "🏔️" },
    { id: "25956dba-df73-4615-a306-ab53b38e20a3", nameAr: "تاريخي", nameEn: "History", icon: "📜" },
    { id: "6afb7fd3-625f-488d-b474-fbf9c930841e", nameAr: "غموض", nameEn: "Mystery", icon: "🔍" },
    { id: "99ed061b-1632-4fec-beb9-f78e353e3c42", nameAr: "فانتازيا", nameEn: "Fantasy", icon: "🧙" },
    { id: "350c5e28-2e88-4141-bf09-3dc830ba46df", nameAr: "عائلي", nameEn: "Family", icon: "👨‍👩‍👧‍👦" }
  ],
  "3443bc74-5492-4abb-a8f1-26b15f6bb814": [
    { id: "61f848f7-422e-4c77-9ed1-8bbd114e7df4", nameAr: "أكشن", nameEn: "Action", icon: "💥" },
    { id: "90cbd416-7584-46c9-a7a8-0041c5bc0bad", nameAr: "كوميديا", nameEn: "Comedy", icon: "🎭" },
    { id: "12dd7009-13e8-4dce-89ff-a0838a616420", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "2f2042c1-23e7-406c-8545-496c0f9bae42", nameAr: "رومانسي", nameEn: "Romance", icon: "❤️" },
    { id: "748c52b5-b747-4d16-9083-a34f002b10f5", nameAr: "رعب", nameEn: "Horror", icon: "👻" },
    { id: "a79010f7-6112-4dd4-b983-dc883927c3d3", nameAr: "إثارة", nameEn: "Thriller", icon: "😱" },
    { id: "05eaddbd-1bac-4b55-bbb5-6fc3b0dc30c1", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "65eb4264-edf6-4e10-84cf-ac0ee6c4919d", nameAr: "مغامرة", nameEn: "Adventure", icon: "🏔️" },
    { id: "22bf150a-85f0-41c8-8574-0fa2fa0e0e3c", nameAr: "غموض", nameEn: "Mystery", icon: "🔍" },
    { id: "62172ad0-ccff-43df-a55d-2af68dd37f96", nameAr: "فانتازيا", nameEn: "Fantasy", icon: "🧙" },
    { id: "8dd7197f-9fe5-4d4a-a0f0-79b79753c2c8", nameAr: "تاريخي", nameEn: "History", icon: "📜" },
    { id: "07e0a5c5-9068-40a2-9aa9-8fb409241e97", nameAr: "خيال علمي", nameEn: "Science Fiction", icon: "🛸" }
  ],
  "2185cd2d-f379-4584-8caa-5884bced7150": [
    { id: "9e85a8f5-7204-4081-abf1-55b6831f8d0f", nameAr: "أكشن", nameEn: "Action", icon: "💥" },
    { id: "c1ef04e2-32d2-4f26-acd9-9eedd77f4fd8", nameAr: "كوميدي", nameEn: "Comedy", icon: "😂" },
    { id: "67f55b85-6069-4e4b-a9f3-71d7561200f7", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "8115ce26-3932-4d50-833e-7568a448361d", nameAr: "رومنسية", nameEn: "Romance", icon: "❤️" },
    { id: "7de289ea-1bcb-4f15-8516-a9406729c9da", nameAr: "إثارة", nameEn: "Thriller", icon: "😱" },
    { id: "f0064e46-ede1-4669-ab36-aa86c827bee0", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "673a3885-86cd-403c-b186-8a3bdf31df47", nameAr: "رعب", nameEn: "Horror", icon: "👻" },
    { id: "e3e557c4-de3b-4e94-80cf-fd7e521e1837", nameAr: "مغامرة", nameEn: "Adventure", icon: "🏔️" },
    { id: "b3709836-b02c-450a-8d28-0f3d2eb3e6c2", nameAr: "فانتازيا", nameEn: "Fantasy", icon: "🧙" },
    { id: "ea20e758-5621-4efe-9391-e52d57e98174", nameAr: "عائلي", nameEn: "Family", icon: "👨‍👩‍👧‍👦" }
  ],
  "0669005a-e8dd-4a00-8986-a905826eaca3": [
    { id: "comedy:0669005a-e8dd-4a00-8986-a905826eaca3", nameAr: "كوميديا", nameEn: "Comedy", icon: "🎭" },
    { id: "a5352e3c-a554-413d-a969-4926e08c980a", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "d9c31b77-524f-418d-a833-e50ec952f4cc", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "e01fb8f6-e639-479a-b392-9b2ec9c3ac37", nameAr: "خيال علمي وفانتازيا", nameEn: "Sci-Fi & Fantasy", icon: "🧙" }
  ],
  "2660c480-65f2-4a30-a0c9-eda017ea660b": [
    { id: "41534be3-fdd6-4af0-8196-5c869de0d5ed", nameAr: "عائلي", nameEn: "Family", icon: "👨‍👩‍👧‍👦" },
    { id: "58cd7505-7b4e-4e81-b504-44eac8434b44", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "6b56f4e1-8c81-4fd1-a534-cf6cb7cc3d1e", nameAr: "حركة ومغامرة", nameEn: "Action & Adventure", icon: "⚔️" },
    { id: "e8ece59d-300c-492a-9e7d-4561d0299120", nameAr: "دراما (XUI)", nameEn: "Drama (XUI)", icon: "🎭" }
  ],
  "1bf63825-0b85-4ed8-8964-4cf2efb854d6": [
    { id: "44b9f66f-c75a-4a18-a437-75ea1b69ec11", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "6c82b233-c942-44dd-b3ef-38e1362789ab", nameAr: "كوميديا", nameEn: "Comedy", icon: "🎭" },
    { id: "6f41aa2a-3b31-464d-a88a-8952dcc55fce", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "b6e63f3d-856e-4140-b595-aaba33105fa2", nameAr: "خيال علمي وفانتازيا", nameEn: "Sci-Fi & Fantasy", icon: "🧙" },
    { id: "c0cd5998-5972-471e-9b1f-55e1d9eb60a3", nameAr: "أكشن ومغامرة", nameEn: "Action & Adventure", icon: "⚔️" }
  ],
  "dd185bc6-1dfd-45c2-9189-13c47f672e5a": [
    { id: "51dfe1e3-4471-410d-b82c-8a4b5438af13", nameAr: "غموض", nameEn: "Mystery", icon: "🔍" },
    { id: "91af69ae-b34d-4f57-bf71-3bf42d51f203", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "c4a4948a-a30a-4a6e-95dc-5a142f2577d2", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "cf6cbb02-d268-43e6-ae12-e14e4135a569", nameAr: "أكشن ومغامرة", nameEn: "Action & Adventure", icon: "⚔️" }
  ],
  "32d17563-00ee-4433-8b59-ddf969a51230": [
    { id: "7908785e-8d52-44ba-931d-1ada5cb85b24", nameAr: "دراما", nameEn: "Drama", icon: "🎭" },
    { id: "7be9c77f-721f-46ab-aad3-8167fe5e99c6", nameAr: "كوميديا", nameEn: "Comedy", icon: "🎭" },
    { id: "86590ab0-27f6-436a-b0d0-f995885f04ab", nameAr: "جريمة", nameEn: "Crime", icon: "🔪" },
    { id: "c1ab0c13-f9a0-4c55-b583-e10a647dd012", nameAr: "حرب وسياسة", nameEn: "War & Politics", icon: "🎖️" }
  ]
};

function LicenseActivationScreen({ isAr, t, onActivate, error, isActivating, onInstallPWA, isInstallable }: { isAr: boolean, t: any, onActivate: (code: string) => void, error: string | null, isActivating: boolean, onInstallPWA?: () => void, isInstallable?: boolean }) {
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
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-start lg:justify-center bg-zinc-950 p-4 sm:p-6 md:p-8 overflow-y-auto">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,rgba(220,38,38,0.15),transparent_70%)]" />
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-5xl flex flex-col lg:flex-row items-center gap-6 lg:gap-12 relative z-10 py-6 lg:py-12">
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
                        <ImageWithFallback 
                          src={featuredContent[activeSlide].posterUrl || "https://i.top4top.io/p_3839qx2t30.png"} 
                          alt={featuredContent[activeSlide].title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          maxRetries={3}
                          fallbackSrc="https://i.top4top.io/p_3839qx2t30.png"
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

            <div className="mt-4 pt-6 border-t border-zinc-800/50 w-full flex flex-col items-center gap-4">
              {isInstallable && onInstallPWA && (
                <button
                  type="button"
                  onClick={onInstallPWA}
                  className="w-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700/80 text-zinc-300 hover:text-white font-black py-3.5 px-4 rounded-2xl transition-all flex items-center justify-center gap-2.5 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-600/60"
                >
                  <Download className="h-4.5 w-4.5 text-red-500 group-hover:scale-115 transition-all duration-300" />
                  <span className="text-xs uppercase tracking-wider">{t.installApp}</span>
                </button>
              )}

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

const getDeviceOS = (): "android" | "ios" | "other" => {
  if (typeof window === "undefined" || !window.navigator) return "other";
  const userAgent = window.navigator.userAgent || window.navigator.vendor || (window as any).opera || "";
  if (/android/i.test(userAgent)) {
    return "android";
  }
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) {
    return "ios";
  }
  if (navigator.maxTouchPoints && navigator.maxTouchPoints > 2 && /MacIntel/.test(navigator.platform)) {
    return "ios";
  }
  return "other";
};

export default function App() {
  const [language, setLanguage] = useState<Language>("ar");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Navigation & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("libyflix_recent_searches");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const saveRecentSearch = (query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item !== trimmed);
      const updated = [trimmed, ...filtered].slice(0, 8);
      try {
        localStorage.setItem("libyflix_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent searches", e);
      }
      return updated;
    });
  };

  const removeRecentSearch = (query: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((item) => item !== query);
      try {
        localStorage.setItem("libyflix_recent_searches", JSON.stringify(updated));
      } catch (e) {
        console.error("Failed to save recent searches", e);
      }
      return updated;
    });
  };

  const clearAllRecentSearches = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("libyflix_recent_searches");
    } catch (e) {
      console.error("Failed to clear recent searches", e);
    }
  };
  const [activeCategory, setActiveCategory] = useState("most-viewed");
  const [contentType, setContentType] = useState<"movie" | "series">("series");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [siteStats, setSiteStats] = useState<{ movies: number | null; series: number | null }>({ movies: null, series: null });
  
  // PWA Installer State & Listeners
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(() => {
    if (typeof window === "undefined") return false;
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    return !isStandalone;
  });
  const [showPWAModal, setShowPWAModal] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Check again if already standalone
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
      if (isStandalone) {
        setIsInstallable(false);
        return;
      }
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      console.log("[PWA] App installed successfully.");
      setIsInstallable(false);
      setDeferredPrompt(null);
    };

    const handleOnline = () => {
      setIsOnline(true);
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Double check standalone state
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches || (window.navigator as any).standalone === true;
    if (isStandalone) {
      console.log("[PWA] App is running in standalone mode.");
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        console.log(`[PWA] Installation user decision: ${outcome}`);
        if (outcome === "accepted") {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.warn("[PWA] Prompt failed, showing instructions instead:", err);
        setShowPWAModal(true);
      }
    } else {
      setShowPWAModal(true);
    }
  };
  
  // Selection
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const isSelectedMovieServer2 = selectedMovie 
    ? ((selectedMovie as any).library === "server2" || (selectedMovie as any).subject_id || (selectedMovie as any).slug)
    : false;
  const [activeSourceIndex, setActiveSourceIndex] = useState<number>(0);
  const [dynamicCategories, setDynamicCategories] = useState<{id: string, nameAr: string, nameEn: string, library: string}[]>([]);

  // Episode Selection for Server 2 Player
  const [activeSeason, setActiveSeason] = useState(1);
  const [activeEpisode, setActiveEpisode] = useState(1);

  // Continue Watching list state
  const [continueWatching, setContinueWatching] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("libyflix_continue_watching");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Favorites list state
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    try {
      const stored = localStorage.getItem("libyflix_favorites");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleFavorite = (movie: Movie) => {
    setFavorites((prev) => {
      const isAlreadyFav = prev.some((m) => m.id === movie.id);
      let updated;
      if (isAlreadyFav) {
        updated = prev.filter((m) => m.id !== movie.id);
      } else {
        updated = [...prev, movie];
      }
      localStorage.setItem("libyflix_favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const resumeItem = (item: any) => {
    const movieToPlay = {
      ...item.movie,
      _resumeSeason: item.season,
      _resumeEpisode: item.episode,
    };
    playMovie(movieToPlay);
  };

  useEffect(() => {
    if (selectedMovie) {
      if ((selectedMovie as any)._resumeSeason !== undefined) {
        setActiveSeason((selectedMovie as any)._resumeSeason);
        setActiveEpisode((selectedMovie as any)._resumeEpisode || 1);
        try {
          delete (selectedMovie as any)._resumeSeason;
          delete (selectedMovie as any)._resumeEpisode;
        } catch (e) {}
      } else {
        setActiveSeason(1);
        setActiveEpisode(1);
      }
    }
  }, [selectedMovie]);

  // Track continue watching updates
  useEffect(() => {
    if (!selectedMovie) return;
    
    const timer = setTimeout(() => {
      setContinueWatching((prev) => {
        const filtered = prev.filter((item) => item.movie.id !== selectedMovie.id);
        const isSeries = selectedMovie.episodes && selectedMovie.episodes.length > 0;
        const newItem = {
          movie: selectedMovie,
          updatedAt: Date.now(),
          ...(isSeries ? { season: activeSeason, episode: activeEpisode } : {})
        };
        const updated = [newItem, ...filtered].slice(0, 15);
        localStorage.setItem("libyflix_continue_watching", JSON.stringify(updated));
        return updated;
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [selectedMovie, activeSeason, activeEpisode]);

  // Active Server State
  const [currentServer, setCurrentServer] = useState<"server1" | "server2">(() => {
    return (localStorage.getItem("libyflix_current_server") as "server1" | "server2") || "server1";
  });
  const [showServer2AdBlockNotice, setShowServer2AdBlockNotice] = useState<boolean>(false);
  const [adBlockCountdown, setAdBlockCountdown] = useState<number>(30);
  const [dontShowAgain, setDontShowAgain] = useState<boolean>(false);

  // Ad block notice countdown effect
  useEffect(() => {
    if (!showServer2AdBlockNotice) return;
    
    const interval = setInterval(() => {
      setAdBlockCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setShowServer2AdBlockNotice(false);
          if (dontShowAgain) {
            localStorage.setItem("libyflix_hide_server2_notice", "true");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showServer2AdBlockNotice, dontShowAgain]);

  const handleCloseAdBlockNotice = () => {
    setShowServer2AdBlockNotice(false);
    if (dontShowAgain) {
      localStorage.setItem("libyflix_hide_server2_notice", "true");
    }
  };

  const handleServerSwitch = (server: "server1" | "server2") => {
    setCurrentServer(server);
    localStorage.setItem("libyflix_current_server", server);
    setMovies([]);
    setPage(1);
    setSearchQuery("");
    // Reset category to correct default when switching servers
    if (server === "server2") {
      setActiveCategory(contentType === "movie" ? "all-movies" : "all-series");
      if (localStorage.getItem("libyflix_hide_server2_notice") !== "true") {
        setAdBlockCountdown(30);
        setShowServer2AdBlockNotice(true);
      }
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
          { id: "eygpt-fl", nameAr: "أفلام مصرية", nameEn: "Egyptian Movies", library: "server2" },
          { id: "moviestr", nameAr: "أفلام تركية", nameEn: "Turkish Movies", library: "server2" },
          { id: "netfilx-fl", nameAr: "أفلام Netflix", nameEn: "Netflix Movies", library: "server2" },
          { id: "inada-flim", nameAr: "أفلام هندية", nameEn: "Indian Movies", library: "server2" },
          { id: "movies-arabic", nameAr: "أفلام عربية", nameEn: "Arabic Movies", library: "server2" },
          { id: "movies-asian", nameAr: "أفلام آسيوية", nameEn: "Asian Movies", library: "server2" },
          { id: "movies-classic", nameAr: "أفلام كلاسيكية", nameEn: "Classic Movies", library: "server2" },
          { id: "movies-dubbed", nameAr: "أفلام مدبلجة", nameEn: "Dubbed Movies", library: "server2" },
          { id: "movies-animation", nameAr: "أفلام أنيميشن", nameEn: "Animation Movies", library: "server2" },
          { id: "plays", nameAr: "مسرحيات", nameEn: "Plays", library: "server2" },
          { id: "wrestling", nameAr: "مصارعة", nameEn: "Wrestling", library: "server2" },
          { id: "movies-no-trans", nameAr: "أفلام أجنبية بدون ترجمة", nameEn: "Foreign Movies (No Sub)", library: "server2" }
        ]);
        setActiveCategory("all-movies");
      } else {
        setDynamicCategories([
          { id: "all-series", nameAr: "كل المسلسلات", nameEn: "All Series", library: "server2" },
          { id: "aflsa", nameAr: "مسلسلات تركية", nameEn: "Turkish Series", library: "server2" },
          { id: "mslas-sg", nameAr: "مسلسلات أجنبية", nameEn: "Foreign Series", library: "server2" },
          { id: "trki", nameAr: "مسلسلات مصرية", nameEn: "Egyptian Series", library: "server2" },
          { id: "series-arabic", nameAr: "مسلسلات عربية", nameEn: "Arabic Series", library: "server2" },
          { id: "series-korean", nameAr: "مسلسلات كورية", nameEn: "Korean Series", library: "server2" },
          { id: "series-cartoon", nameAr: "مسلسلات كرتون", nameEn: "Cartoon Series", library: "server2" },
          { id: "mslas-no-trans", nameAr: "مسلسلات بدون ترجمة", nameEn: "Series (No Sub)", library: "server2" },
          { id: "series", nameAr: "مسلسلات متنوعة", nameEn: "Various Series", library: "server2" }
        ]);
        setActiveCategory("all-series");
      }
      return;
    }

    if (currentServer === "server1") {
      if (contentType === "movie") {
        setDynamicCategories(SERVER1_MOVIE_CATEGORIES);
      } else {
        setDynamicCategories(SERVER1_SERIES_CATEGORIES);
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
    setGenre("");
    setPage(1);
  }, [contentType, currentServer]);

  // Reset active source when movie selection changes
  useEffect(() => {
    setActiveSourceIndex(0);
  }, [selectedMovie]);
  
  // Hero Slider State
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  const filteredFeaturedMovies = featuredMovies.filter((movie) => {
    const isS2 = (movie as any).library === "server2" || (movie as any).subject_id || (movie as any).slug;
    return currentServer === "server2" ? isS2 : !isS2;
  });

  useEffect(() => {
    setCurrentSlide(0);
  }, [currentServer]);

  // Islamic Prayer Reminder State
  const [showReminder, setShowReminder] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("libyflix_prayer_reminder_acknowledged") !== "true";
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
    // Determine the actual server of the movie
    const isServer2 = (movie as any).library === "server2" || (movie as any).subject_id || (movie as any).slug;
    const targetServer = isServer2 ? "server2" : "server1";

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
            setSelectedMovie({ ...fullMovie, library: "server2" } as any);
            setCurrentServer("server2");
            return;
          }
        }
        throw new Error("Failed to load details from Server 2");
      }

      // Handle Server 1
      const isSeries = movie.type === 'series' || (movie.episodes && movie.episodes.length > 0);
      if (isSeries) {
        // Fetch details including episodes
        try {
          const response = await fetch(`/api/series/${movie.id}`);
          if (response.ok) {
             const fullMovie = await response.json();
             const enriched = { ...fullMovie, library: "server1", type: "series" };
             setSelectedMovie(enriched);
             setCurrentServer("server1");
             return;
          }
        } catch (e) {
          console.error("Failed to fetch series details", e);
        }
      }
      const enrichedMovie = { ...movie, library: "server1", type: movie.type || "movie" };
      setSelectedMovie(enrichedMovie);
      setCurrentServer("server1");
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
          const items = Array.isArray(json) ? json : (json.data || []);
          s1MoviesData = items.map((item: any) => ({ ...item, library: "server1", type: "movie" }));
        }
        if (s1SeriesRes.ok) {
          const json = await s1SeriesRes.json();
          const items = Array.isArray(json) ? json : (json.data || []);
          s1SeriesData = items.map((item: any) => ({ ...item, library: "server1", type: "series" }));
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
        const mappedS1 = json.map((item: any) => ({
          ...item,
          library: "server1",
          type: item.type || contentType
        }));
        setMovies(mappedS1);
        setTotalPages(1);
        
        // Fallback to populate slider if empty on first load
        if (activeCategory === "most-viewed" && mappedS1.length > 0 && !searchQuery && featuredMovies.length === 0) {
          setFeaturedMovies(mappedS1.slice(0, 6));
        }
      } else if (json && Array.isArray(json.data)) {
        const mappedS1 = json.data.map((item: any) => ({
          ...item,
          library: "server1",
          type: item.type || contentType
        }));
        setMovies(mappedS1);
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
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          if (data && typeof data.movies === "number" && typeof data.series === "number") {
            setSiteStats({
              movies: data.movies,
              series: data.series
            });
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
            if (Array.isArray(data)) {
              results.push(...data.slice(0, 3).map((item: any) => ({
                ...item,
                library: "server1",
                type: "movie"
              })));
            }
          }
        } catch (e) { console.error("S1 Movies fetch error", e); }

        // 2. Fetch Server 1 Series (Top 3)
        try {
          const s1Res = await fetch('/api/series/most-viewed?limit=4');
          if (s1Res.ok) {
            const data = await s1Res.json();
            if (Array.isArray(data)) {
              results.push(...data.slice(0, 3).map((item: any) => ({
                ...item,
                library: "server1",
                type: "series"
              })));
            }
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
    if (filteredFeaturedMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % filteredFeaturedMovies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [filteredFeaturedMovies]);



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
      localStorage.setItem("libyflix_prayer_reminder_acknowledged", "true");
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
    if (activeCategory === "favorites") {
      const filteredFavs = favorites.filter((movie) => {
        const isMovie = movie.type === 'movie' || (movie.sources && movie.sources.length > 0) || (movie.category?.id?.includes('movie') || false) || (!movie.type && !movie.episodes);
        return contentType === 'movie' ? isMovie : !isMovie;
      });
      setMovies(filteredFavs);
      setTotalPages(1);
    } else {
      fetchMovies();
    }
  }, [activeCategory, page, contentType, searchQuery, currentServer, genre, sort, order, year, favorites]);

  // Handle Search triggers
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      saveRecentSearch(searchQuery);
    }
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
    setGenre("");
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
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-zinc-950 flex flex-col p-4 md:p-8 overflow-y-auto"
          >
            {/* Background subtle radial glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(239,68,68,0.08),transparent_70%)] pointer-events-none" />
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none animate-pulse" />

            <div className="max-w-4xl w-full mx-auto flex-grow flex flex-col relative z-10">
              {/* Header */}
              <div className="flex items-center justify-between py-4 border-b border-zinc-900 mb-8 shrink-0">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-black tracking-tighter flex items-center gap-1 select-none">
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
                  <span className="px-2.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] text-zinc-400 font-bold tracking-widest uppercase">
                    {isAr ? "أوفلاين" : "Offline"}
                  </span>
                </div>

                {/* Language Toggle */}
                <button
                  type="button"
                  onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                  className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                >
                  {isAr ? "English" : "العربية"}
                </button>
              </div>

              {/* Main Content Area */}
              <div className="flex-grow flex flex-col items-center justify-center text-center max-w-xl mx-auto py-6 shrink-0">
                {/* Pulsing Offline Graphic */}
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-red-600/20 rounded-full blur-2xl scale-150 animate-pulse" />
                  <div className="relative p-6 bg-zinc-900/60 border border-zinc-800 rounded-full text-red-500 shadow-xl shadow-red-950/20">
                    <WifiOff className="h-10 w-10 animate-bounce" />
                  </div>
                </div>

                <h2 className="text-xl md:text-2xl font-black tracking-tight mb-3">
                  {t.offlineTitle}
                </h2>
                <p className="text-zinc-400 text-xs md:text-sm leading-relaxed mb-6">
                  {t.offlineDesc}
                </p>

                {/* Buttons */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRetrying(true);
                      setTimeout(() => {
                        setIsRetrying(false);
                        setIsOnline(navigator.onLine);
                      }, 1000);
                    }}
                    disabled={isRetrying}
                    className="w-full sm:w-auto bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-black py-3 px-6 rounded-2xl shadow-lg shadow-red-950/40 transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    {isRetrying ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <RefreshCw className="h-4 w-4" />
                    )}
                    <span className="text-xs uppercase tracking-wider">{t.retry}</span>
                  </button>

                  {isInstallable && (
                    <button
                      type="button"
                      onClick={handleInstallPWA}
                      className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white font-black py-3 px-6 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Download className="h-4 w-4 text-red-500" />
                      <span className="text-xs uppercase tracking-wider">{t.installApp}</span>
                    </button>
                  )}
                </div>

                <p className="text-[10px] text-zinc-500 mt-6 leading-normal">
                  {t.offlineSavedHint}
                </p>
              </div>

              {/* Offline Saved / Favorites section */}
              {(favorites.length > 0 || continueWatching.length > 0) && (
                <div className="mt-8 pt-8 border-t border-zinc-900 pb-8 shrink-0">
                  <div className="flex items-center gap-2 mb-4">
                    <Sparkles className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-black uppercase tracking-wider text-zinc-300">
                      {isAr ? "محتواك المحفوظ محلياً" : "Your Locally Saved Content"}
                    </h3>
                  </div>

                  {/* Grid showing Continue Watching or Favorites */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {/* Render Favorites */}
                    {favorites.slice(0, 6).map((movie) => {
                      const title = isAr ? (movie.titleAr || movie.title) : (movie.titleEn || movie.title);
                      return (
                        <div
                          key={`offline-fav-${movie.id}`}
                          className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden p-2 flex flex-col h-full"
                        >
                          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-950">
                            <img
                              src={movie.posterUrl || "https://i.top4top.io/p_3839qx2t30.png"}
                              alt={title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover opacity-80"
                            />
                            <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm border border-zinc-800 p-1.5 rounded-full">
                              <Heart className="h-3 w-3 fill-red-500 text-red-500" />
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <h4 className="line-clamp-1 text-[11px] font-bold text-zinc-300">
                              {title}
                            </h4>
                            <span className="text-[9px] text-zinc-500 font-mono mt-0.5 block">
                              {movie.year || "—"} | {isAr ? "مفضل" : "Favorite"}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {/* Render Continue Watching if no Favorites */}
                    {favorites.length === 0 && continueWatching.slice(0, 6).map((item) => {
                      const title = isAr ? (item.movie.titleAr || item.movie.title) : (item.movie.titleEn || item.movie.title);
                      return (
                        <div
                          key={`offline-cw-${item.movie.id}`}
                          className="group relative bg-zinc-900/40 border border-zinc-800/60 rounded-xl overflow-hidden p-2 flex flex-col h-full"
                        >
                          <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-zinc-950">
                            <img
                              src={item.movie.posterUrl || "https://i.top4top.io/p_3839qx2t30.png"}
                              alt={title}
                              referrerPolicy="no-referrer"
                              className="h-full w-full object-cover opacity-80"
                            />
                            {item.season && item.episode && (
                              <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/80 backdrop-blur-sm border border-zinc-800 px-1.5 py-0.5 rounded-lg text-[8px] text-zinc-400 font-bold flex justify-between">
                                <span>S{item.season}</span>
                                <span className="text-red-500">E{item.episode}</span>
                              </div>
                            )}
                          </div>
                          <div className="mt-2 text-center">
                            <h4 className="line-clamp-1 text-[11px] font-bold text-zinc-300">
                              {title}
                            </h4>
                            <span className="text-[9px] text-zinc-500 font-mono mt-0.5 block">
                              {isAr ? "متابعة" : "Resume"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLicenseActive && !isCheckingLicense && (
          <LicenseActivationScreen 
            isAr={isAr} 
            t={t} 
            onActivate={handleActivate}
            error={licenseError}
            isActivating={isActivating}
            onInstallPWA={handleInstallPWA}
            isInstallable={isInstallable}
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
      <header className="bg-zinc-950 border-b border-zinc-900/80 px-4 py-5 md:px-8 shadow-2xl">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-5">
          
          {/* Row 1: Logo & Info */}
          <div className="w-full flex items-center justify-between gap-4">
            {/* Logo Group */}
            <div 
              className="cursor-pointer group flex items-center gap-3 select-none"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("most-viewed");
                setPage(1);
              }}
            >
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter transition-transform duration-300 group-hover:scale-102 flex items-center gap-1">
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
            </div>

            {/* License Remaining Days Countdown & PWA Install */}
            <div className="flex items-center gap-2 md:gap-3">
              {isInstallable && (
                <button
                  type="button"
                  onClick={handleInstallPWA}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-zinc-800 hover:border-zinc-700 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Download className="h-3 w-3 text-red-500" />
                  <span>{t.installApp}</span>
                </button>
              )}

              {licenseInfo && licenseInfo.remainingDays !== undefined && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-500 text-[10px] font-bold uppercase tracking-wider shadow-sm select-none">
                  <Hourglass className="h-3 w-3 animate-pulse" />
                  <span>{licenseInfo.remainingDays} {isAr ? "أيام متبقية" : "Days Left"}</span>
                </div>
              )}
            </div>
          </div>

          {/* Row 2: Search Box */}
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full group">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-zinc-900/40 hover:bg-zinc-900/80 border-2 border-zinc-800/80 focus:border-red-600/60 rounded-2xl pl-12 pr-12 py-3.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-4 focus:ring-red-600/5 transition-all duration-300 shadow-inner"
                />
                <div className="absolute inset-y-0 left-4 flex items-center text-zinc-500 group-focus-within:text-red-500 transition-colors">
                  <Search className="h-4.5 w-4.5" />
                </div>
                
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-4 text-[10px] font-black text-zinc-500 hover:text-white uppercase tracking-widest"
                  >
                    {isAr ? "مسح" : "Clear"}
                  </button>
                )}
              </div>
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-7 py-3.5 rounded-2xl text-sm font-black transition-all shadow-lg shadow-red-600/20 active:scale-95 cursor-pointer"
              >
                {isAr ? "بحث" : "Search"}
              </button>
            </form>

            {recentSearches.length > 0 && (
              <div className="w-full mt-3 px-1 flex flex-col gap-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 select-none">
                    <Clock className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="font-bold tracking-tight">{t.recentSearches}</span>
                  </div>
                  <button
                    type="button"
                    onClick={clearAllRecentSearches}
                    className="text-[10px] font-bold text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    {t.clearHistory}
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 py-0.5">
                  {recentSearches.map((query, idx) => (
                    <div
                      key={`${query}-${idx}`}
                      className="group/chip flex items-center bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800/60 hover:border-zinc-700/80 rounded-xl transition-all duration-200 overflow-hidden"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery(query);
                          setPage(1);
                        }}
                        className={`px-3 py-1.5 text-xs text-zinc-300 hover:text-white font-medium transition-colors cursor-pointer truncate max-w-[150px] ${
                          isAr ? "text-right" : "text-left"
                        }`}
                      >
                        {query}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeRecentSearch(query)}
                        className={`p-1.5 text-zinc-500 hover:text-red-500 hover:bg-red-500/10 transition-all border-zinc-800/50 ${
                          isAr ? "border-r pr-2 pl-2" : "border-l pl-2 pr-2"
                        }`}
                        aria-label={`Remove ${query}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Row 3: Server Switcher & Content Types (Toggles Row with Premium Custom Checkboxes) */}
          <div className="w-full flex flex-wrap items-center justify-center gap-y-3 gap-x-5 bg-zinc-900/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-zinc-900/80 shadow-inner">
            {/* Content Type Selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1 select-none">
                <LayoutGrid className="h-3.5 w-3.5 text-red-600/50" />
                <span>{isAr ? "القسم:" : "Section:"}</span>
              </span>
              
              <div className="flex items-center gap-2">
                {/* Movie Checkbox */}
                <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer select-none group ${
                  contentType === "movie"
                    ? "bg-red-950/25 border-red-500/40 text-white shadow-md shadow-red-950/20"
                    : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}>
                  <input
                    type="checkbox"
                    id="checkbox-movie"
                    checked={contentType === "movie"}
                    onChange={() => {
                      if (contentType !== "movie") {
                        setContentType("movie");
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                    contentType === "movie"
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-zinc-900 border-zinc-800 text-transparent group-hover:border-zinc-700"
                  }`}>
                    <svg className="w-2 h-2 stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight">
                    {isAr ? "أفلام" : "Movies"}
                  </span>
                </label>

                {/* Series Checkbox */}
                <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer select-none group ${
                  contentType === "series"
                    ? "bg-red-950/25 border-red-500/40 text-white shadow-md shadow-red-950/20"
                    : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}>
                  <input
                    type="checkbox"
                    id="checkbox-series"
                    checked={contentType === "series"}
                    onChange={() => {
                      if (contentType !== "series") {
                        setContentType("series");
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                    contentType === "series"
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-zinc-900 border-zinc-800 text-transparent group-hover:border-zinc-700"
                  }`}>
                    <svg className="w-2 h-2 stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight">
                    {isAr ? "مسلسلات" : "Series"}
                  </span>
                </label>
              </div>
            </div>

            {/* Divider */}
            <div className="hidden sm:block h-4 w-px bg-zinc-800" />

            {/* Server Selector */}
            <div className="flex items-center gap-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-zinc-500 flex items-center gap-1 select-none">
                <Globe className="h-3.5 w-3.5 text-red-600/50" />
                <span>{isAr ? "السيرفر:" : "Server:"}</span>
              </span>
              
              <div className="flex items-center gap-2">
                {/* Server 1 Checkbox */}
                <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer select-none group ${
                  currentServer === "server1"
                    ? "bg-red-950/25 border-red-500/40 text-white shadow-md shadow-red-950/20"
                    : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}>
                  <input
                    type="checkbox"
                    id="checkbox-server1"
                    checked={currentServer === "server1"}
                    onChange={() => {
                      if (currentServer !== "server1") {
                        handleServerSwitch("server1");
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                    currentServer === "server1"
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-zinc-900 border-zinc-800 text-transparent group-hover:border-zinc-700"
                  }`}>
                    <svg className="w-2 h-2 stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight">
                    {isAr ? "سيرفر 1" : "Server 1"}
                  </span>
                </label>

                {/* Server 2 Checkbox */}
                <label className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all duration-300 cursor-pointer select-none group ${
                  currentServer === "server2"
                    ? "bg-red-950/25 border-red-500/40 text-white shadow-md shadow-red-950/20"
                    : "bg-zinc-950/20 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:border-zinc-800"
                }`}>
                  <input
                    type="checkbox"
                    id="checkbox-server2"
                    checked={currentServer === "server2"}
                    onChange={() => {
                      if (currentServer !== "server2") {
                        handleServerSwitch("server2");
                      }
                    }}
                    className="sr-only"
                  />
                  <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center border transition-all duration-300 ${
                    currentServer === "server2"
                      ? "bg-red-600 border-red-500 text-white"
                      : "bg-zinc-900 border-zinc-800 text-transparent group-hover:border-zinc-700"
                  }`}>
                    <svg className="w-2 h-2 stroke-[4]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-xs font-bold tracking-tight">
                    {isAr ? "سيرفر 2" : "Server 2"}
                  </span>
                </label>
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Sticky Scrollable Categories Bar */}
      <div className="sticky top-0 z-30 bg-zinc-950/95 backdrop-blur-md border-b border-zinc-900 px-4 py-3 shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center gap-2 overflow-x-auto scrollbar-hide py-1">
          {/* Universal Favorites Pill */}
          <button
            onClick={() => selectCategory("favorites")}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 ${
              activeCategory === "favorites" && !searchQuery
                ? "bg-red-600 text-white shadow-lg shadow-red-900/40 ring-1 ring-red-500"
                : "bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-800"
            }`}
          >
            <Heart className={`h-3.5 w-3.5 ${activeCategory === "favorites" ? "fill-current animate-pulse text-white" : "text-red-500"}`} />
            <span>{isAr ? "المفضلة" : "Favorites"}</span>
          </button>

          {currentServer !== "server2" && STATIC_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                activeCategory === cat.id && !searchQuery
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/40 ring-1 ring-red-500"
                  : "bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-800"
              }`}
            >
              <span>{isAr ? cat.nameAr : cat.nameEn}</span>
            </button>
          ))}

          {(currentServer === "server2" ? dynamicCategories : (currentServer === "server1" ? dynamicCategories : dynamicCategories.slice(0, 3))).map((cat) => (
            <button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 shrink-0 focus:outline-none focus:ring-2 focus:ring-red-500 ${
                activeCategory === cat.id && !searchQuery
                  ? "bg-red-600 text-white shadow-lg shadow-red-900/40 ring-1 ring-red-500"
                  : "bg-zinc-900/50 hover:bg-zinc-800/80 border border-zinc-800 text-zinc-300 hover:text-white focus:text-white focus:bg-zinc-800"
              }`}
            >
              {(cat as any).icon && <span className="text-sm">{(cat as any).icon}</span>}
              <span>{isAr ? cat.nameAr : cat.nameEn}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Movies Slider (Only shown when not searching and on home category) */}
      {!loading && !error && (activeCategory === "most-viewed" || activeCategory === "all-movies" || activeCategory === "all-series") && !searchQuery && filteredFeaturedMovies.length > 0 && (
        <section className="relative w-full h-[400px] sm:h-[480px] md:h-[550px] bg-black overflow-hidden border-b border-zinc-900">
          <AnimatePresence mode="wait">
            {filteredFeaturedMovies.map((movie, idx) => {
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
                  <ImageWithFallback
                    src={movie.backdropUrl || movie.posterUrl || "https://i.top4top.io/p_3839qx2t30.png"}
                    alt={movie.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-[0.55] saturate-[1.1] scale-100"
                    maxRetries={3}
                    fallbackSrc="https://i.top4top.io/p_3839qx2t30.png"
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
        
        {/* Continue Watching Section */}
        {continueWatching.length > 0 && !searchQuery && (
          <section className="flex flex-col gap-4 bg-zinc-950/25 border border-zinc-900 rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-red-500 animate-pulse" />
                <h3 className="text-base font-black text-white tracking-tight">
                  {isAr ? "متابعة المشاهدة" : "Continue Watching"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setContinueWatching([]);
                  localStorage.removeItem("libyflix_continue_watching");
                }}
                className="text-[10px] font-black uppercase tracking-wider text-zinc-500 hover:text-red-500 transition-colors bg-zinc-900/40 border border-zinc-850 px-2.5 py-1 rounded-lg cursor-pointer"
              >
                {isAr ? "مسح السجل" : "Clear History"}
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {continueWatching.slice(0, 6).map((item) => {
                const title = isAr 
                  ? (item.movie.titleAr || item.movie.title) 
                  : (item.movie.titleEn || item.movie.title);
                const isItemMovie = item.movie.type === 'movie' || (item.movie.sources && item.movie.sources.length > 0) || (item.movie.category?.id?.includes('movie') || false) || (!item.movie.type && !item.movie.episodes);

                return (
                  <div
                    key={`${item.movie.id}-${item.updatedAt}`}
                    onClick={() => resumeItem(item)}
                    className="group relative bg-zinc-950/40 border border-zinc-900/80 rounded-2xl overflow-hidden cursor-pointer hover:border-red-500/50 hover:shadow-[0_12px_24px_-10px_rgba(239,68,68,0.25)] transition-all duration-300 flex flex-col h-full"
                  >
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
                      <ImageWithFallback
                        src={item.movie.posterUrl || "https://i.top4top.io/p_3839qx2t30.png"}
                        alt={title}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        maxRetries={3}
                        fallbackSrc="https://i.top4top.io/p_3839qx2t30.png"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div className="p-3 rounded-full bg-red-600 text-white shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <Play className="h-4 w-4 fill-current ml-0.5" />
                        </div>
                      </div>
                      {!isItemMovie && item.season && item.episode && (
                        <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm border border-zinc-800 px-2 py-1 rounded-xl text-[10px] text-zinc-300 font-bold flex justify-between items-center">
                          <span>{isAr ? `الموسم ${item.season}` : `S${item.season}`}</span>
                          <span className="text-red-500">{isAr ? `الحلقة ${item.episode}` : `E${item.episode}`}</span>
                        </div>
                      )}
                    </div>
                    <div className="p-3 flex flex-col flex-grow justify-between gap-1 bg-zinc-950/20">
                      <h4 className="line-clamp-1 text-xs font-bold text-zinc-200 group-hover:text-red-500 transition-colors leading-tight">
                        {title}
                      </h4>
                      <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5 text-zinc-600" />
                        {new Date(item.updatedAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Server 1 Genre Selection Bar */}
        {currentServer === "server1" && SERVER1_GENRES[activeCategory] && (
          <section className="flex flex-col gap-2 bg-zinc-950/20 border border-zinc-900 rounded-2xl p-4">
            <h4 className="text-xs font-semibold text-zinc-500 flex items-center gap-2 uppercase tracking-wider select-none">
              <span>🎭</span>
              <span>{isAr ? "القسم الفرعي / النوع" : "Genre / Subcategory"}</span>
            </h4>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => {
                  setGenre("");
                  setPage(1);
                }}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                  !genre
                    ? "bg-red-600/20 text-red-400 border border-red-500/30 ring-1 ring-red-500/30"
                    : "bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                <span>🌐</span>
                <span>{isAr ? "الكل" : "All"}</span>
              </button>
              {SERVER1_GENRES[activeCategory].map((g) => (
                <button
                  key={g.id}
                  onClick={() => {
                    setGenre(g.id);
                    setPage(1);
                  }}
                  className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    genre === g.id
                      ? "bg-red-600/20 text-red-400 border border-red-500/30 ring-1 ring-red-500/30"
                      : "bg-zinc-900/40 border border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                  }`}
                >
                  {g.icon && <span className="text-sm">{g.icon}</span>}
                  <span>{isAr ? g.nameAr : g.nameEn}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Section Heading */}
        <div className="flex flex-col gap-4 border-b border-zinc-900 pb-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {searchQuery 
                  ? `${t.showingResults}: "${searchQuery}"`
                  : activeCategory === "favorites"
                    ? (isAr ? "المفضلة" : "Favorites")
                    : (isAr 
                        ? (currentServer === "server2" ? dynamicCategories : [...STATIC_CATEGORIES, ...dynamicCategories]).find(c => c.id === activeCategory)?.nameAr 
                        : (currentServer === "server2" ? dynamicCategories : [...STATIC_CATEGORIES, ...dynamicCategories]).find(c => c.id === activeCategory)?.nameEn)}
              </h2>
              <p className="text-[11px] text-zinc-500 mt-1 font-medium">
                {isAr 
                  ? `${movies.length} ${contentType === 'movie' ? 'فيلم متاح حالياً' : 'مسلسل متاح حالياً'}`
                  : `${movies.length} ${contentType === 'movie' ? 'movies' : 'series'} available currently`}
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
                              isFavorite={favorites.some((m) => m.id === movie.id)}
                              onToggleFavorite={() => toggleFavorite(movie)}
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
                              isFavorite={favorites.some((m) => m.id === movie.id)}
                              onToggleFavorite={() => toggleFavorite(movie)}
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
                      isFavorite={favorites.some((m) => m.id === movie.id)}
                      onToggleFavorite={() => toggleFavorite(movie)}
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
                {siteStats.movies === null ? (
                  <div className="flex items-center gap-1 py-2.5 h-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></span>
                  </div>
                ) : (
                  <span className="text-2xl font-black text-white tracking-tighter">{(siteStats.movies).toLocaleString()}</span>
                )}
                <span className="text-[10px] text-zinc-600 font-bold uppercase">{isAr ? "محتوى" : "Titles"}</span>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-start">
              <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.2em] mb-2">{isAr ? "إجمالي المسلسلات" : "Total Series"}</span>
              <div className="flex items-baseline gap-1">
                {siteStats.series === null ? (
                  <div className="flex items-center gap-1 py-2.5 h-8">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></span>
                  </div>
                ) : (
                  <span className="text-2xl font-black text-white tracking-tighter">{(siteStats.series).toLocaleString()}</span>
                )}
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

            <div className="flex items-center gap-6">
              {/* Language Switcher Button in Footer */}
              <button
                onClick={() => setLanguage(language === "ar" ? "en" : "ar")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900 border border-zinc-800 text-xs font-bold text-zinc-400 hover:text-white hover:border-zinc-700 transition-all cursor-pointer backdrop-blur-md"
              >
                <Globe className="h-3.5 w-3.5 text-red-600" />
                <span>{isAr ? "EN" : "AR"}</span>
              </button>
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
              {isSelectedMovieServer2 && (
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
                  </div>
                </div>
              )}


              {/* Movie Details Content Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-8 bg-gradient-to-b from-zinc-900 to-zinc-950">
                
                {/* Main Details Panel */}
                <div className="md:col-span-8 flex flex-col gap-5">
                  <div className="flex gap-6 items-start">
                    <div className="w-24 h-36 md:w-32 md:h-48 relative shadow-2xl border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center">
                      <ImageWithFallback 
                        src={selectedMovie.posterUrl || selectedMovie.backdropUrl || "https://i.top4top.io/p_3839qx2t30.png"} 
                        alt={selectedMovie.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                        maxRetries={3}
                        fallbackSrc="https://i.top4top.io/p_3839qx2t30.png"
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
                            {isSelectedMovieServer2 ? (
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
                        {!isSelectedMovieServer2 ? (
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
                  ) : (!selectedMovie.episodes || selectedMovie.episodes.length === 0) && !isSelectedMovieServer2 && (
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
                  <ImageWithFallback
                    src={selectedMovie.posterUrl || selectedMovie.backdropUrl || "https://i.top4top.io/p_3839qx2t30.png"}
                    alt={selectedMovie.title}
                    referrerPolicy="no-referrer"
                    className="w-full aspect-[2/3] object-cover rounded-2xl border border-zinc-800 hidden md:block shadow-lg"
                    maxRetries={3}
                    fallbackSrc="https://i.top4top.io/p_3839qx2t30.png"
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

      {/* Server 2 Ad Blocker Notice Modal */}
      <AnimatePresence>
        {showServer2AdBlockNotice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl flex flex-col text-right"
              dir="rtl"
            >
              <div className="absolute top-4 left-4">
                <button
                  onClick={handleCloseAdBlockNotice}
                  className="p-2 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-all duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 shrink-0 animate-pulse">
                  <Hand className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">تنويه هام للمشتركين</h2>
                  <p className="text-xs text-zinc-500 mt-1">بخصوص إعلانات المشغل في السيرفر الثاني</p>
                </div>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-850 rounded-2xl p-5 mb-4 text-xs md:text-sm text-zinc-300 leading-relaxed font-semibold whitespace-pre-line">
                {`السلام عليكم ورحمة الله وبركاته،
عزيزي المشترك،

تم حذف جميع الإعلانات من المشغل قدر الإمكان. في حال ظهور أي إعلان داخل المشغل، يُرجى الضغط عليه في أي مكان وسيختفي فوراً. أما إذا فُتح إعلان في صفحة جديدة، ننصحك بتثبيت أحد تطبيقات حظر الإعلانات من متجر هاتفك.

موقعي خالٍ تماماً من الإعلانات بنسبة 100%، وما قد يظهر أحياناً هو خارج عن إرادتنا، ويكون مصدره من مزود رابط البث.
شكراً لتفهمك وصبرك. 🙏`}
              </div>

              {/* Clear checkbox to avoid showing again */}
              <label className="flex items-center gap-3 cursor-pointer select-none group bg-zinc-950/50 hover:bg-zinc-950/80 p-3.5 rounded-2xl border border-zinc-800/80 hover:border-red-500/30 transition-all mb-5">
                <input
                  type="checkbox"
                  checked={dontShowAgain}
                  onChange={(e) => setDontShowAgain(e.target.checked)}
                  className="w-5 h-5 rounded border-zinc-700 text-red-600 focus:ring-red-600/20 bg-zinc-800 accent-red-600 cursor-pointer"
                />
                <span className="text-xs font-black text-zinc-300 group-hover:text-white transition-colors">
                  عدم عرض هذا التنويه مرة أخرى عند التبديل للسيرفر الثاني
                </span>
              </label>

              <div className="border-t border-zinc-800/60 pt-5">
                <span className="text-xs font-bold text-zinc-500 block mb-3">ننصحك باستخدام تطبيق AdGuard لتجربة خالية تماماً من الإعلانات المزعجة:</span>
                
                {(() => {
                  const os = getDeviceOS();
                  if (os === "android") {
                    return (
                      <div className="flex flex-col gap-3">
                        <a
                          href="https://play.google.com/store/apps/details?id=com.adguard.android.contentblocker"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-emerald-600/20 active:scale-95 flex items-center justify-center gap-2.5"
                        >
                          <Download className="h-5 w-5" />
                          <span>تحميل AdGuard للأندرويد (Google Play)</span>
                        </a>
                      </div>
                    );
                  } else if (os === "ios") {
                    return (
                      <div className="flex flex-col gap-3">
                        <a
                          href="https://apps.apple.com/app/adguard-adblock-privacy/id1047223162"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-4 bg-sky-600 hover:bg-sky-500 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-sky-600/20 active:scale-95 flex items-center justify-center gap-2.5"
                        >
                          <Download className="h-5 w-5" />
                          <span>تحميل AdGuard للأيفون (App Store)</span>
                        </a>
                      </div>
                    );
                  } else {
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <a
                          href="https://play.google.com/store/apps/details?id=com.adguard.android.contentblocker"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-4 bg-emerald-600/20 hover:bg-emerald-600 border border-emerald-500/30 hover:border-emerald-500 text-emerald-400 hover:text-white rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2.5"
                        >
                          <Download className="h-5 w-5" />
                          <span>تحميل للأندرويد (Android)</span>
                        </a>
                        <a
                          href="https://apps.apple.com/app/adguard-adblock-privacy/id1047223162"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-4 bg-sky-600/20 hover:bg-sky-600 border border-sky-500/30 hover:border-sky-500 text-sky-400 hover:text-white rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2.5"
                        >
                          <Download className="h-5 w-5" />
                          <span>تحميل للأيفون (iOS)</span>
                        </a>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Countdown timer visual bar */}
              <div className="flex items-center justify-between text-[11px] text-zinc-500 font-bold mt-6 mb-2 px-1">
                <span>سيغلق التنويه تلقائياً خلال {adBlockCountdown} ثانية...</span>
                <span className="h-1 flex-1 mx-4 bg-zinc-800 rounded-full overflow-hidden relative">
                  <span 
                    className="absolute inset-y-0 right-0 bg-red-600 transition-all duration-1000"
                    style={{ width: `${(adBlockCountdown / 30) * 100}%` }}
                  />
                </span>
              </div>

              <button
                onClick={handleCloseAdBlockNotice}
                className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white rounded-2xl font-black text-sm transition-all border border-zinc-700/50 active:scale-95 flex items-center justify-center"
              >
                متابعة وإغلاق التنويه
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* PWA Install Instructions Modal */}
        {showPWAModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl overflow-hidden text-zinc-100 flex flex-col"
            >
              {/* Background gradient decor */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

              {/* Header */}
              <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-red-600/10 rounded-xl border border-red-500/20 text-red-500">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black tracking-tight">{t.pwaModalTitle}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{isAr ? "دليل التثبيت لجميع الأجهزة" : "Installation guide for all systems"}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowPWAModal(false)}
                  className="p-1.5 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-700 hover:text-white transition-all cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Description */}
              <p className="text-zinc-300 text-xs md:text-sm leading-relaxed mb-6 bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60">
                {t.pwaModalDesc}
              </p>

              {/* Native Prompt Button if available */}
              {deferredPrompt && (
                <button
                  type="button"
                  onClick={async () => {
                    await handleInstallPWA();
                    setShowPWAModal(false);
                  }}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-3.5 px-4 rounded-2xl shadow-xl shadow-red-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 mb-6 cursor-pointer"
                >
                  <Sparkles className="h-4.5 w-4.5 animate-pulse" />
                  <span>{t.pwaNativeInstallBtn}</span>
                </button>
              )}

              {/* Dynamic device-specific instructions tabs */}
              <div className="space-y-4">
                <h4 className="text-xs font-black tracking-widest text-zinc-400 uppercase select-none">{t.pwaHowToTitle}</h4>
                
                <div className="space-y-3.5 max-h-[280px] overflow-y-auto pr-1">
                  {/* Apple / Safari */}
                  <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-800 rounded-2xl transition-colors">
                    <div className="flex items-center gap-2.5 text-zinc-200 font-bold text-xs mb-3">
                      <Smartphone className="h-4 w-4 text-sky-500" />
                      <span>{t.pwaSafariInstructions}</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-400">
                      <li>{t.pwaSafariStep1}</li>
                      <li>{t.pwaSafariStep2}</li>
                      <li>{t.pwaSafariStep3}</li>
                    </ol>
                  </div>

                  {/* Android / Chrome */}
                  <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-800 rounded-2xl transition-colors">
                    <div className="flex items-center gap-2.5 text-zinc-200 font-bold text-xs mb-3">
                      <Smartphone className="h-4 w-4 text-emerald-500" />
                      <span>{t.pwaAndroidInstructions}</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-400">
                      <li>{t.pwaAndroidStep1}</li>
                      <li>{t.pwaAndroidStep2}</li>
                    </ol>
                  </div>

                  {/* Computer (PC/Mac) */}
                  <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-800 rounded-2xl transition-colors">
                    <div className="flex items-center gap-2.5 text-zinc-200 font-bold text-xs mb-3">
                      <Monitor className="h-4 w-4 text-purple-500" />
                      <span>{t.pwaDesktopInstructions}</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-400">
                      <li>{t.pwaDesktopStep1}</li>
                      <li>{t.pwaDesktopStep2}</li>
                    </ol>
                  </div>

                  {/* Android TV / Smart TV */}
                  <div className="p-4 bg-zinc-950/50 border border-zinc-800/50 hover:border-zinc-800 rounded-2xl transition-colors">
                    <div className="flex items-center gap-2.5 text-zinc-200 font-bold text-xs mb-3">
                      <Tv className="h-4 w-4 text-red-500" />
                      <span>{t.pwaTvInstructions}</span>
                    </div>
                    <ol className="list-decimal list-inside space-y-2 text-xs text-zinc-400">
                      <li>{t.pwaTvStep1}</li>
                      <li>{t.pwaTvStep2}</li>
                    </ol>
                  </div>
                </div>
              </div>

              {/* Close Footer button */}
              <button
                type="button"
                onClick={() => setShowPWAModal(false)}
                className="w-full mt-6 py-3 bg-zinc-800 hover:bg-zinc-700/80 text-zinc-300 hover:text-white rounded-2xl text-xs font-bold transition-all border border-zinc-700/30 cursor-pointer"
              >
                {t.close}
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
