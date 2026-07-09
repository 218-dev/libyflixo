import React, { useState, useEffect, useRef } from "react";
import { 
  Tv, Search, RefreshCw, AlertTriangle 
} from "lucide-react";
import { io } from "socket.io-client";
import Hls from "hls.js";
import mpegts from "mpegts.js";

interface Category {
  id: string;
  title: string;
  titleAr: string;
  titleEn: string;
  channelsCount: number;
}

interface Source {
  id: string;
  channelId: string;
  label: string;
  streamUrl: string;
  isExternalServer: boolean;
}

interface Channel {
  id: string;
  categoryId: string;
  name: string;
  nameAr: string;
  nameEn: string;
  logoUrl: string | null;
  sources: Source[];
}

interface LiveTvScreenProps {
  isAr: boolean;
}

export default function LiveTvScreen({ isAr }: LiveTvScreenProps) {
  // State
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [isLoadingChannels, setIsLoadingChannels] = useState(false);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [playingUrl, setPlayingUrl] = useState<string>("");
  const [playerError, setPlayerError] = useState("");
  const [isPlayerLoading, setIsPlayerLoading] = useState(false);
  const [channelStatuses, setChannelStatuses] = useState<Record<string, boolean>>({});

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Fetch Categories on Mount
  useEffect(() => {
    async function loadCategories() {
      setIsLoadingCategories(true);
      try {
        const response = await fetch("/api/live/categories");
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        
        const sorted = (Array.isArray(data) ? data : []).filter(
          (cat: any) => cat.isActive !== false
        );
        setCategories(sorted);

        if (sorted.length > 0) {
          setSelectedCategory(sorted[0]);
        }
      } catch (err) {
        console.error("Error loading live categories:", err);
      } finally {
        setIsLoadingCategories(false);
      }
    }
    loadCategories();
  }, []);

  // Fetch Channels
  useEffect(() => {
    if (!selectedCategory) return;

    async function loadChannels() {
      setIsLoadingChannels(true);
      setChannels([]);
      setChannelStatuses({});
      try {
        const response = await fetch(`/api/live/channels?categoryId=${selectedCategory?.id}`);
        if (!response.ok) throw new Error("Failed to fetch channels");
        const data = await response.json();
        const loadedChannels = Array.isArray(data) ? data : [];
        setChannels(loadedChannels);

        // Batch check statuses
        const statuses: Record<string, boolean> = {};
        await Promise.all(loadedChannels.map(async (ch: Channel) => {
          if (ch.sources && ch.sources.length > 0) {
            try {
              const res = await fetch(`/api/stream/status?url=${encodeURIComponent(ch.sources[0].streamUrl)}`);
              const json = await res.json();
              statuses[ch.id] = json.status;
            } catch {
              statuses[ch.id] = false;
            }
          } else {
            statuses[ch.id] = false;
          }
        }));
        setChannelStatuses(statuses);
      } catch (err) {
        console.error("Error loading channels:", err);
      } finally {
        setIsLoadingChannels(false);
      }
    }
    loadChannels();
  }, [selectedCategory]);

  // Update stream source URL
  useEffect(() => {
    if (!activeChannel) {
      setPlayingUrl("");
      return;
    }

    const sources = activeChannel.sources || [];
    if (sources.length === 0) {
      setPlayerError(isAr ? "لا توجد مصادر بث متاحة لهذه القناة" : "No streaming sources available");
      setPlayingUrl("");
      return;
    }

    // Default to first source
    setPlayingUrl(sources[0].streamUrl);
  }, [activeChannel, isAr]);

  // Real-time updates via Socket.IO
  useEffect(() => {
    if (!activeChannel) return;

    const socket = io("https://admin.golive-pro.online", {
      transports: ["websocket"]
    });

    socket.on("connect", () => {
      console.log("Connected to GoLive real-time streaming sockets");
    });

    socket.on("stream:url:change", (data: any) => {
      if (data && (data.channelId === activeChannel.id || data.id === activeChannel.id)) {
        const newUrl = data.streamUrl || data.url;
        if (newUrl) {
          setPlayingUrl(newUrl);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [activeChannel]);

  // Video Player Instantiation (HLS / MPEG-TS)
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !playingUrl) return;

    let hlsInstance: Hls | null = null;
    let mpegtsPlayer: any = null;

    setIsPlayerLoading(true);
    setPlayerError("");

    const isHls = playingUrl.includes(".m3u8") || playingUrl.toLowerCase().includes("hls");
    const isMpegTs = playingUrl.includes(".ts") || playingUrl.includes(".flv") || playingUrl.includes("/odai/") || playingUrl.includes(":443/odai");

    const proxiedUrl = `/api/stream?url=${encodeURIComponent(playingUrl)}`;

    if (isHls) {
      if (Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 60
        });
        hlsInstance.loadSource(playingUrl);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch((err) => console.warn("HLS play blocked:", err.message));
          setIsPlayerLoading(false);
        });
        hlsInstance.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                hlsInstance?.loadSource(proxiedUrl);
                hlsInstance?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                hlsInstance?.recoverMediaError();
                break;
              default:
                setPlayerError(isAr ? "تعذر الاتصال بسيرفر البث" : "Could not connect to streaming server");
                setIsPlayerLoading(false);
                break;
            }
          }
        });
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = playingUrl;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch((err) => console.warn("Native Safari play blocked:", err.message));
          setIsPlayerLoading(false);
        });
        video.addEventListener("error", () => {
          video.src = proxiedUrl;
        });
      } else {
        setPlayerError(isAr ? "متصفحك لا يدعم صيغة هذا البث (HLS)" : "Your browser does not support HLS streaming");
        setIsPlayerLoading(false);
      }
    } else if (isMpegTs) {
      if (mpegts.isSupported()) {
        mpegtsPlayer = mpegts.createPlayer({
          type: "mse",
          url: playingUrl,
          isLive: true
        }, {
          enableStashBuffer: false,
          liveBufferLatencyChaser: true,
          stashInitialSize: 128
        });
        mpegtsPlayer.attachMediaElement(video);
        mpegtsPlayer.load();
        mpegtsPlayer.play().catch(() => {
          mpegtsPlayer?.destroy();
          mpegtsPlayer = mpegts.createPlayer({
            type: "mse",
            url: proxiedUrl,
            isLive: true
          });
          mpegtsPlayer.attachMediaElement(video);
          mpegtsPlayer.load();
          mpegtsPlayer.play().catch((e: any) => console.error("MPEG-TS Proxy failed:", e));
        });
        setIsPlayerLoading(false);

        mpegtsPlayer.on(mpegts.Events.ERROR, () => {
          setPlayerError(isAr ? "حدث خطأ في فك تشفير البث الحي" : "Decoding error in Live Stream");
          setIsPlayerLoading(false);
        });
      } else {
        video.src = proxiedUrl;
        video.addEventListener("loadedmetadata", () => {
          video.play().catch((err) => console.warn("Fallback direct play blocked:", err.message));
          setIsPlayerLoading(false);
        });
        video.addEventListener("error", () => {
          setPlayerError(isAr ? "متصفحك لا يدعم صيغة MPEG-TS" : "Your browser does not support MPEG-TS codec");
          setIsPlayerLoading(false);
        });
      }
    } else {
      video.src = playingUrl;
      video.addEventListener("loadedmetadata", () => {
        video.play().catch((err) => console.warn("Generic play blocked:", err.message));
        setIsPlayerLoading(false);
      });
      video.addEventListener("error", () => {
        setPlayerError(isAr ? "فشل تشغيل رابط البث المباشر" : "Failed to load stream link");
        setIsPlayerLoading(false);
      });
    }

    return () => {
      if (hlsInstance) hlsInstance.destroy();
      if (mpegtsPlayer) mpegtsPlayer.destroy();
    };
  }, [playingUrl, isAr]);

  const filteredChannels = channels.filter(channel => {
    const title = isAr ? channel.nameAr : channel.nameEn || channel.name;
    return title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 animate-fadeIn pb-12 px-4" id="livetv-screen-container">
      
      {/* 1. Search */}
      <input 
        type="text"
        placeholder={isAr ? "ابحث عن قناة..." : "Search for a channel..."}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-zinc-900/30 border border-zinc-900 rounded-2xl p-4 text-xs text-zinc-200 focus:outline-none focus:border-red-600"
      />
      
      {/* 2. Categories Scroll */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-800">
        {categories.map((cat) => {
          const isActive = selectedCategory?.id === cat.id;
          const title = isAr ? cat.titleAr : cat.titleEn || cat.title;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                isActive 
                  ? "bg-red-600 border-red-500 text-white" 
                  : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800"
              }`}
            >
              {title}
            </button>
          );
        })}
      </div>

      {/* Persistent Video Player Frame */}
      {activeChannel && (
        <div className="w-full bg-zinc-950 border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative" id="livetv-player-container">
          <div className="relative aspect-video w-full bg-black flex items-center justify-center">
            <video 
              ref={videoRef}
              className="w-full h-full object-contain"
              controls
              playsInline
              id="livetv-video-tag"
            />
            {isPlayerLoading && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3">
                <RefreshCw className="h-10 w-10 text-red-600 animate-spin" />
              </div>
            )}
            {playerError && (
              <div className="absolute inset-0 bg-zinc-950/95 flex flex-col items-center justify-center p-6 text-center gap-4">
                <p className="text-xs text-red-500">{playerError}</p>
                <button
                  type="button"
                  onClick={() => {
                    const oldUrl = playingUrl;
                    setPlayingUrl("");
                    setTimeout(() => setPlayingUrl(oldUrl), 50);
                  }}
                  className="bg-red-600 text-white text-xs font-bold px-6 py-2 rounded-full"
                >
                  {isAr ? "إعادة المحاولة" : "Retry"}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {isLoadingChannels ? (
            <div className="col-span-full text-center py-24">
              <RefreshCw className="h-8 w-8 text-red-500 animate-spin mx-auto" />
            </div>
        ) : (
          filteredChannels.map((channel) => {
            const isActive = activeChannel?.id === channel.id;
            const isWorking = channelStatuses[channel.id];
            const title = isAr ? channel.nameAr : channel.nameEn || channel.name;
            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => {
                  setActiveChannel(channel);
                }}
                className={`group flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? "bg-red-950/20 border-red-500/40 shadow-xl"
                    : "bg-zinc-900/20 border-zinc-900/60 hover:bg-zinc-900/40"
                }`}
              >
                <div className="relative h-14 w-14 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center p-2">
                  {channel.logoUrl ? (
                    <img src={channel.logoUrl} alt={channel.name} className="h-full w-full object-contain" />
                  ) : (
                    <Tv className="h-6 w-6 text-zinc-500" />
                  )}
                  {/* Status Dot */}
                  <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-zinc-950 ${isWorking ? "bg-green-500" : "bg-red-500"}`} />
                </div>
                <span className="text-[11px] font-black leading-tight text-center">
                  {title}
                </span>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
