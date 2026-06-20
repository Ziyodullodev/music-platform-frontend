import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'
import { useAudio } from '../context/AudioContext'

export default function PlaylistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { playTrack, track: audioTrack } = useAudio()
  const [activeTrackId, setActiveTrackId] = useState(audioTrack?.id)
  const [showAddMusic, setShowAddMusic] = useState(false)
  const [allMusics, setAllMusics] = useState([])
  const [allMusicLoading, setAllMusicLoading] = useState(false)
  const [addingId, setAddingId] = useState(null)
  const [addedIds, setAddedIds] = useState(new Set())

  const { data: playlistData, loading: playlistLoading } = useApi(() => api.getPlaylistDetail(id), [id])
  const { data: musicData, loading: musicLoading, refetch: refetchPlaylistMusic } = useApi(() => api.getMusics({ playlist: id }), [id])

  const playlist = playlistData || {}
  const playlistTracks = musicData?.results || []
  const playlistTrackIds = new Set([...playlistTracks.map(t => t.id), ...addedIds])

  function handleTrackClick(track) {
    setActiveTrackId(track.id)
    playTrack(track)
  }

  async function openAddSheet() {
    setShowAddMusic(true)
    setAllMusicLoading(true)
    try {
      const data = await api.getMusics()
      setAllMusics(data?.results || [])
    } catch (e) {
      console.error(e)
    } finally {
      setAllMusicLoading(false)
    }
  }

  async function handleAddMusic(music) {
    setAddingId(music.id)
    try {
      const fd = new FormData()
      fd.append('playlist', id)
      await api.updateMusic(music.id, fd)
      setAddedIds(prev => new Set([...prev, music.id]))
      refetchPlaylistMusic()
    } catch (e) {
      console.error(e)
    } finally {
      setAddingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-[20px] h-16">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 transition-transform text-on-surface" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline text-[24px] font-bold text-primary tracking-tighter">F-music</h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="active:scale-95 transition-transform text-on-surface">
            <span className="material-symbols-outlined">search</span>
          </button>
          <button className="active:scale-95 transition-transform text-on-surface">
            <span className="material-symbols-outlined">more_vert</span>
          </button>
        </div>
      </header>

      <main className="pt-20 pb-40 min-h-screen px-[20px] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/20 to-transparent -z-10 blur-[100px]" />

        {/* Hero */}
        <section className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-8">
          <div className="w-64 h-64 shrink-0 relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-[16px] blur-lg group-hover:blur-xl transition-all" />
            {playlistLoading ? (
              <div className="w-full h-full rounded-[16px] shimmer relative z-10" />
            ) : (playlist.picture || playlist.cover || playlist.image) ? (
              <img
                src={playlist.picture || playlist.cover || playlist.image}
                alt={playlist.name || playlist.title}
                className="w-full h-full object-cover rounded-[16px] relative z-10 shadow-2xl"
              />
            ) : (
              <div className="w-full h-full rounded-[16px] bg-surface-container-high relative z-10 flex items-center justify-center">
                <span className="material-symbols-outlined text-[64px] text-on-surface-variant">library_music</span>
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left gap-2">
            <div className="flex items-center gap-2 px-3 py-1 bg-surface-container-high rounded-full border border-white/5">
              <span className="material-symbols-outlined text-[16px] text-secondary" style={{ fontVariationSettings: "'FILL' 1" }}>
                {playlist.is_public ? 'public' : 'lock'}
              </span>
              <span className="text-[12px] font-medium text-on-surface-variant">
                {playlist.is_public ? 'Public Playlist' : 'Private Playlist'}
              </span>
            </div>
            {playlistLoading ? (
              <div className="h-10 w-48 shimmer rounded-full mt-2" />
            ) : (
              <h2 className="font-headline text-[40px] font-black text-on-surface mt-2 leading-tight">
                {playlist.name || playlist.title || ''}
              </h2>
            )}
            <div className="flex items-center gap-2 text-on-surface-variant text-[13px] font-semibold flex-wrap justify-center md:justify-start">
              {playlist.author_name && <><span>Curated by {playlist.author_name}</span><span className="w-1 h-1 bg-on-surface-variant rounded-full" /></>}
              <span>{musicData?.count ?? 0} Songs</span>
            </div>
            <div className="flex items-center gap-3 mt-4 w-full md:w-auto">
              <button
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-full text-[14px] font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40"
                disabled={playlistTracks.length === 0}
                onClick={() => { if (playlistTracks[0]) { handleTrackClick(playlistTracks[0]); navigate(`/music/${playlistTracks[0].id}`) } }}
              >
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                Play All
              </button>
              <button
                className="w-12 h-12 rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center"
                onClick={() => navigate(`/playlists/${id}/edit`)}
              >
                <span className="material-symbols-outlined">edit</span>
              </button>
              <button className="w-12 h-12 rounded-full border border-error/30 text-error hover:bg-error/10 active:scale-95 transition-all flex items-center justify-center"
                onClick={async () => { if (window.confirm("O'chirilsinmi?")) { await api.deletePlaylist(id); navigate('/playlists') } }}>
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        </section>

        {/* Track List */}
        <section className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-1 mb-3">
            <h3 className="font-headline text-[18px] font-semibold text-on-surface">
              {musicData?.count ?? 0} ta qo'shiq
            </h3>
            <button
              className="flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-[13px] font-semibold active:scale-95 transition-all"
              onClick={openAddSheet}
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Qo'shiq qo'shish
            </button>
          </div>

          {musicLoading ? (
            [1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-[16px]">
                <div className="w-6 h-4 shimmer rounded" />
                <div className="w-12 h-12 rounded-[8px] shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 shimmer rounded-full" />
                  <div className="h-3 w-1/2 shimmer rounded-full" />
                </div>
              </div>
            ))
          ) : playlistTracks.length === 0 ? (
            <div className="flex flex-col items-center py-16 text-center">
              <span className="material-symbols-outlined text-[56px] text-outline-variant mb-3">queue_music</span>
              <p className="text-[16px] font-medium text-on-surface">Hali qo'shiq yo'q</p>
              <p className="text-[13px] text-on-surface-variant mt-1">Yuqoridagi tugmadan qo'shiq qo'shing</p>
            </div>
          ) : playlistTracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center gap-4 p-3 rounded-[16px] transition-all cursor-pointer group ${activeTrackId === track.id ? 'bg-surface-container-high shadow-[0_0_20px_rgba(208,188,255,0.15)]' : 'hover:bg-surface-container'}`}
              onClick={() => { handleTrackClick(track); navigate(`/music/${track.id}`) }}
            >
              {activeTrackId === track.id ? (
                <div className="w-6 flex justify-center">
                  <div className="flex items-end gap-[2px] h-4">
                    <div className="w-1 bg-primary animate-bounce h-full" style={{ animationDelay: '0ms' }} />
                    <div className="w-1 bg-primary animate-bounce h-2" style={{ animationDelay: '150ms' }} />
                    <div className="w-1 bg-primary animate-bounce h-3" style={{ animationDelay: '75ms' }} />
                  </div>
                </div>
              ) : (
                <>
                  <span className="w-6 text-center text-[14px] font-semibold text-on-surface-variant group-hover:hidden">{index + 1}</span>
                  <button className="w-6 text-center text-primary hidden group-hover:block">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                </>
              )}
              {(track.image || track.cover || track.picture) ? (
                <img src={track.image || track.cover || track.picture} alt={track.name || track.title} className="w-12 h-12 shrink-0 rounded-[8px] object-cover" />
              ) : (
                <div className="w-12 h-12 shrink-0 rounded-[8px] bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">music_note</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className={`text-[16px] truncate ${activeTrackId === track.id ? 'text-primary font-bold' : 'text-on-surface'}`}>{track.name || track.title}</h4>
                <p className="text-[12px] text-on-surface-variant truncate">{track.source || track.artist || track.author_name || ''}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[12px] w-10 text-right text-on-surface-variant">
                  {track.duration ? `${Math.floor(track.duration/60)}:${String(Math.floor(track.duration%60)).padStart(2,'0')}` : ''}
                </span>
                <button className="text-on-surface-variant hover:text-on-surface" onClick={e => e.stopPropagation()}>
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            </div>
          ))}
        </section>
      </main>

      {/* Add Music Bottom Sheet */}
      {showAddMusic && (
        <>
          <div className="fixed inset-0 bg-black/60 z-40" onClick={() => setShowAddMusic(false)} />
          <div className="fixed bottom-[68px] left-0 right-0 z-50 bg-surface rounded-t-[24px] max-h-[75vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
              <h3 className="font-headline text-[18px] font-semibold text-on-surface">Qo'shiq tanlang</h3>
              <button className="text-on-surface-variant active:scale-90 transition-transform" onClick={() => setShowAddMusic(false)}>
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="overflow-y-auto flex-1 pb-6">
              {allMusicLoading ? (
                <div className="flex flex-col gap-3 p-4">
                  {[1,2,3,4].map(i => (
                    <div key={i} className="flex items-center gap-4 p-3 rounded-[12px]">
                      <div className="w-12 h-12 rounded-[8px] shimmer shrink-0" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 shimmer rounded-full" />
                        <div className="h-3 w-1/2 shimmer rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : allMusics.length === 0 ? (
                <div className="flex flex-col items-center py-12 text-center px-6">
                  <span className="material-symbols-outlined text-[48px] text-outline-variant mb-3">music_off</span>
                  <p className="text-[15px] text-on-surface-variant">Hech qanday musiqa topilmadi</p>
                </div>
              ) : allMusics.map(music => {
                const inPlaylist = playlistTrackIds.has(music.id)
                const isAdding = addingId === music.id
                return (
                  <div
                    key={music.id}
                    className="flex items-center gap-4 px-5 py-3 hover:bg-surface-container transition-colors"
                  >
                    {(music.picture || music.image) ? (
                      <img src={music.picture || music.image} alt={music.name} className="w-12 h-12 rounded-[8px] object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-[8px] bg-surface-container-high flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-on-surface-variant">music_note</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-[15px] font-medium text-on-surface truncate">{music.name || music.title}</p>
                      <p className="text-[12px] text-on-surface-variant truncate">{music.source || music.author_name || ''}</p>
                    </div>
                    <button
                      className={`w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-90 ${
                        inPlaylist ? 'bg-primary/20 text-primary' : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                      disabled={inPlaylist || isAdding}
                      onClick={() => handleAddMusic(music)}
                    >
                      {isAdding ? (
                        <span className="w-4 h-4 border-2 border-primary/40 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <span className="material-symbols-outlined text-[18px]" style={inPlaylist ? { fontVariationSettings: "'FILL' 1" } : {}}>
                          {inPlaylist ? 'check' : 'add'}
                        </span>
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
