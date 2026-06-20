import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'

export default function UploadMusic() {
  const navigate = useNavigate()
  const { data: playlistData } = useApi(() => api.getPlaylists())
  const playlists = playlistData?.results || []

  const [isDragging, setIsDragging] = useState(false)
  const [musicFiles, setMusicFiles] = useState([])
  const [picture, setPicture] = useState(null)
  const [picturePreview, setPicturePreview] = useState(null)
  const [name, setName] = useState('')
  const [source, setSource] = useState('')
  const [lirics, setLirics] = useState('')
  const [playlist, setPlaylist] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleDrop(e) {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('audio/'))
    if (files.length) setMusicFiles(files)
  }

  function handleMusicFiles(e) {
    const files = Array.from(e.target.files)
    if (files.length) setMusicFiles(files)
  }

  function handlePicture(e) {
    const file = e.target.files[0]
    if (!file) return
    setPicture(file)
    setPicturePreview(URL.createObjectURL(file))
  }

  async function handleSubmit() {
    if (!name.trim()) { setError('Musiqa nomini kiriting'); return }
    if (musicFiles.length === 0) { setError('Audio fayl tanlang'); return }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', name)
      formData.append('is_public', isPublic ? 'true' : 'false')
      musicFiles.forEach(f => formData.append('music_data', f))
      if (picture) formData.append('picture', picture)
      if (lirics.trim()) formData.append('lirics', lirics)
      if (source.trim()) formData.append('source', source)
      if (playlist) formData.append('playlist', playlist)

      await api.createMusic(formData)
      setSuccess(true)
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setError(err.data ? Object.values(err.data).flat().join(' ') : err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 text-center px-6">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="material-symbols-outlined text-primary text-[48px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
        </div>
        <h2 className="font-headline text-[24px] font-bold text-on-surface">Yuklandi!</h2>
        <p className="text-[14px] text-on-surface-variant">Musiqa muvaffaqiyatli qo'shildi</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-[20px] h-16">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 transition-transform text-on-surface" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline text-[20px] font-semibold text-primary">Upload Music</h1>
        </div>
      </header>

      <main className="pt-20 pb-36 px-[20px] max-w-2xl mx-auto space-y-6 mt-4">

        {/* Audio Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-[16px] flex flex-col items-center justify-center gap-4 py-12 transition-all cursor-pointer ${
            isDragging ? 'border-secondary bg-secondary/10' : musicFiles.length ? 'border-primary bg-primary/10' : 'border-secondary/30 glass-panel'
          }`}
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('music-input').click()}
        >
          <input id="music-input" type="file" accept="audio/*" multiple className="hidden" onChange={handleMusicFiles} />
          {musicFiles.length > 0 ? (
            <>
              <span className="material-symbols-outlined text-primary text-[56px]" style={{ fontVariationSettings: "'FILL' 1" }}>audio_file</span>
              <div className="text-center">
                {musicFiles.map((f, i) => (
                  <p key={i} className="text-[15px] font-semibold text-on-surface">{f.name}</p>
                ))}
                <p className="text-[12px] text-on-surface-variant mt-1">
                  {musicFiles.length} fayl • {(musicFiles.reduce((a, f) => a + f.size, 0) / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="w-16 h-16 rounded-full glass-panel flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary text-[36px]">upload_file</span>
              </div>
              <div className="text-center">
                <p className="text-[16px] font-semibold text-on-surface">Audio fayl tanlang</p>
                <p className="text-[13px] text-on-surface-variant mt-1">yoki bu yerga tashlang</p>
              </div>
              <div className="flex gap-2">
                {['MP3', 'WAV', 'FLAC', 'AAC'].map(fmt => (
                  <span key={fmt} className="px-3 py-1 rounded-full bg-surface-container text-[11px] font-semibold text-on-surface-variant border border-outline-variant">{fmt}</span>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Cover Picture */}
        <div className="flex items-center gap-4">
          <input id="picture-input" type="file" accept="image/*" className="hidden" onChange={handlePicture} />
          <div
            className="w-20 h-20 rounded-[12px] border-2 border-dashed border-secondary/30 glass-panel flex flex-col items-center justify-center gap-1 cursor-pointer shrink-0 active:scale-95 transition-transform overflow-hidden"
            onClick={() => document.getElementById('picture-input').click()}
          >
            {picturePreview ? (
              <img src={picturePreview} alt="cover" className="w-full h-full object-cover" />
            ) : (
              <>
                <span className="material-symbols-outlined text-secondary text-[26px]">add_a_photo</span>
                <span className="text-[10px] font-medium text-on-surface-variant">Cover</span>
              </>
            )}
          </div>
          <div>
            <p className="text-[14px] font-semibold text-on-surface">Muqova rasm</p>
            <p className="text-[12px] text-on-surface-variant mt-1">Ixtiyoriy • 500×500px tavsiya etiladi</p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-primary uppercase tracking-wider ml-1">Nomi *</label>
            <input
              className="w-full h-14 px-4 bg-surface-container-high border border-white/10 rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all text-[16px]"
              placeholder="Musiqa nomini kiriting..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-primary uppercase tracking-wider ml-1">Ijrochi / Manba</label>
            <input
              className="w-full h-14 px-4 bg-surface-container-high border border-white/10 rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all text-[16px]"
              placeholder="Masalan: Ali Aliyev"
              value={source}
              onChange={e => setSource(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-primary uppercase tracking-wider ml-1">Playlist</label>
            <div className="relative">
              <select
                className="w-full h-14 px-4 bg-surface-container-high border border-white/10 rounded-[12px] appearance-none focus:border-primary outline-none text-on-surface text-[16px]"
                value={playlist}
                onChange={e => setPlaylist(e.target.value)}
              >
                <option value="">Playlist tanlang (ixtiyoriy)</option>
                {playlists.map(p => (
                  <option key={p.id} value={p.id}>{p.name || p.title}</option>
                ))}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-primary uppercase tracking-wider ml-1">So'zlar (lyrics)</label>
            <textarea
              className="w-full px-4 py-3 bg-surface-container-high border border-white/10 rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all text-[15px] resize-none"
              placeholder="Qo'shiq so'zlarini kiriting..."
              rows={4}
              value={lirics}
              onChange={e => setLirics(e.target.value)}
            />
          </div>

          <div className="glass-panel rounded-[12px] px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-[15px] font-medium text-on-surface">Ommaviy</p>
              <p className="text-[12px] text-on-surface-variant">Barcha foydalanuvchilar ko'ra oladi</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
              <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
            </label>
          </div>

        </div>

        {error && (
          <div className="px-4 py-3 bg-error-container/30 border border-error/30 rounded-[12px] text-error text-[14px]">
            {error}
          </div>
        )}

        <button
          className="w-full h-14 rounded-full text-[14px] font-semibold transition-all active:scale-95 bg-primary text-on-primary shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !name.trim() || musicFiles.length === 0}
          onClick={handleSubmit}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-on-primary/40 border-t-on-primary rounded-full animate-spin" />
              Yuklanmoqda...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span className="material-symbols-outlined">cloud_upload</span>
              Yuklash
            </span>
          )}
        </button>

      </main>
    </div>
  )
}
