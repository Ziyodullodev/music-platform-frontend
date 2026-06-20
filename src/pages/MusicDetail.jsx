import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'
import { useAudio } from '../context/AudioContext'

function fmt(sec) {
  if (!sec || isNaN(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MusicDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: trackData, loading } = useApi(() => api.getMusicDetail(id), [id])
  const { track, isPlaying, current, duration, playTrack, togglePlay, seek, skip } = useAudio()

  useEffect(() => {
    if (trackData?.music_data) {
      playTrack(trackData)
    }
  }, [trackData?.id])

  const t = trackData || track
  const progress = duration ? (current / duration) * 100 : 0
  const lyricsLines = t?.lirics ? t.lirics.split('\n').filter(l => l.trim()) : []

  function handleSeek(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    seek(((e.clientX - rect.left) / rect.width) * duration)
  }

  return (
    <div className="min-h-screen bg-background text-on-background overflow-hidden">

      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-[20px] h-16 bg-surface/40 backdrop-blur-md">
        <button
          className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container active:scale-95 transition-transform"
          onClick={() => navigate(-1)}
        >
          <span className="material-symbols-outlined text-on-surface">expand_more</span>
        </button>
        <div className="flex flex-col items-center">
          <span className="text-[11px] font-medium text-on-surface-variant uppercase tracking-widest">Now Playing</span>
          <span className="text-[13px] font-semibold text-primary truncate max-w-[180px]">{t?.name || ''}</span>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full bg-surface-container active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-on-surface">more_vert</span>
        </button>
      </header>

      <main className="pt-24 pb-56 px-[20px] flex flex-col items-center">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[150%] h-[60%] pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_0%,#d0bcff_0%,transparent_60%)]" />

        {/* Album Art */}
        <div className="relative w-full aspect-square max-w-sm mb-8">
          <div className={`absolute inset-0 bg-primary blur-3xl opacity-20 transition-transform duration-700 ${isPlaying ? 'scale-100' : 'scale-90'}`} />
          {loading ? (
            <div className="w-full h-full rounded-2xl shimmer relative z-10" />
          ) : (t?.picture || t?.image) ? (
            <img
              src={t.picture || t.image}
              alt={t.name}
              className={`w-full h-full object-cover rounded-2xl relative z-10 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] transition-transform duration-500 ${isPlaying ? 'scale-100' : 'scale-95'}`}
            />
          ) : (
            <div className="w-full h-full rounded-2xl bg-surface-container-high relative z-10 flex items-center justify-center">
              <span className={`material-symbols-outlined text-[80px] text-on-surface-variant transition-transform duration-500 ${isPlaying ? 'scale-100' : 'scale-90'}`}>music_note</span>
            </div>
          )}
        </div>

        {/* Title + Like */}
        <div className="w-full max-w-sm flex justify-between items-center mb-6">
          <div className="flex-1 pr-4 min-w-0">
            <h1 className="font-headline text-[24px] font-bold text-on-surface truncate">
              {loading ? <span className="h-7 w-48 shimmer rounded-full inline-block" /> : t?.name || ''}
            </h1>
            <p className="text-[16px] text-on-surface-variant mt-1 truncate">{t?.source || t?.author_name || ''}</p>
          </div>
          <button className="w-12 h-12 flex items-center justify-center rounded-full glass-panel active:scale-90 transition-all shrink-0">
            <span className="material-symbols-outlined text-on-surface">favorite</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full max-w-sm mb-8">
          <div className="relative h-2 w-full bg-surface-container-highest rounded-full cursor-pointer group" onClick={handleSeek}>
            <div className="absolute left-0 top-0 h-full bg-primary rounded-full shadow-[0_0_10px_rgba(208,188,255,0.6)]" style={{ width: `${progress}%` }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white shadow-lg opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: `calc(${progress}% - 8px)` }} />
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-[12px] text-on-surface-variant">{fmt(current)}</span>
            <span className="text-[12px] text-on-surface-variant">{fmt(duration || t?.duration)}</span>
          </div>
        </div>

        {/* Lyrics */}
        {lyricsLines.length > 0 && (
          <div
            className="w-full max-w-sm h-40 overflow-y-auto flex flex-col gap-4 items-center py-2 scroll-smooth"
            style={{ maskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)', WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 20%, black 80%, transparent)' }}
          >
            {lyricsLines.map((line, i) => (
              <p key={i} className="font-headline text-[18px] text-center text-on-surface-variant opacity-50">{line}</p>
            ))}
          </div>
        )}
      </main>

      {/* Player Controls */}
      <nav className="fixed bottom-0 w-full z-50 glass-panel rounded-t-3xl pt-6 pb-10 px-8 flex flex-col gap-5 items-center">
        <div className="flex items-center justify-between w-full max-w-sm">
          <button className="text-on-surface-variant active:scale-90">
            <span className="material-symbols-outlined text-[26px]">shuffle</span>
          </button>
          <div className="flex items-center gap-6">
            <button className="text-on-surface active:scale-90 transition-transform" onClick={() => skip(-10)}>
              <span className="material-symbols-outlined text-[32px]">replay_10</span>
            </button>
            <button
              className="w-20 h-20 flex items-center justify-center rounded-full bg-primary text-on-primary shadow-xl shadow-primary/20 active:scale-95 transition-all"
              onClick={togglePlay}
            >
              {loading ? (
                <span className="w-6 h-6 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {isPlaying ? 'pause' : 'play_arrow'}
                </span>
              )}
            </button>
            <button className="text-on-surface active:scale-90 transition-transform" onClick={() => skip(10)}>
              <span className="material-symbols-outlined text-[32px]">forward_10</span>
            </button>
          </div>
          <button className="text-on-surface-variant active:scale-90">
            <span className="material-symbols-outlined text-[26px]">repeat</span>
          </button>
        </div>
        <div className="flex items-center justify-between w-full max-w-sm px-2">
          <button className="flex items-center gap-1 text-on-surface-variant active:scale-90">
            <span className="material-symbols-outlined text-[20px]">queue_music</span>
            <span className="text-[12px] font-medium">Queue</span>
          </button>
          <button className="text-on-surface-variant active:scale-90">
            <span className="material-symbols-outlined text-[20px]">share</span>
          </button>
        </div>
      </nav>
    </div>
  )
}
