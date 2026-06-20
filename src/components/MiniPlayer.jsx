import { useNavigate } from 'react-router-dom'
import { useAudio } from '../context/AudioContext'

export default function MiniPlayer() {
  const navigate = useNavigate()
  const { track, isPlaying, current, duration, togglePlay } = useAudio()

  if (!track) return null

  const progress = duration ? (current / duration) * 100 : 0

  return (
    <div
      className="fixed bottom-[68px] left-4 right-4 z-40 glass-panel rounded-2xl p-3 flex items-center gap-4 shadow-2xl cursor-pointer"
      onClick={() => navigate(`/music/${track.id}`)}
    >
      {(track.picture || track.image) ? (
        <img src={track.picture || track.image} alt={track.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-on-surface-variant text-[20px]">music_note</span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <h5 className="text-[14px] font-bold text-on-surface truncate">{track.name || track.title}</h5>
        <p className="text-[12px] text-on-surface-variant truncate">{track.source || track.author_name || ''}</p>
      </div>

      <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
        <button
          className="w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center active:scale-90 transition-transform shadow-lg"
          onClick={togglePlay}
        >
          <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
            {isPlaying ? 'pause' : 'play_arrow'}
          </span>
        </button>
      </div>

      <div className="absolute bottom-0 left-4 right-4 h-[2px] bg-white/10 rounded-full">
        <div className="h-full bg-primary rounded-full shadow-[0_0_6px_rgba(208,188,255,0.6)] transition-all" style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
