import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

export default function EditPlaylist() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [picture, setPicture] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function handlePicture(file) {
    if (!file) return
    setPicture(file)
    setPreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    if (!name.trim()) { setError('Playlist nomini kiriting'); return }
    setLoading(true)
    setError('')
    try {
      const formData = new FormData()
      formData.append('name', name)
      if (picture) formData.append('picture', picture)
      const created = await api.createPlaylist(formData)
      navigate(`/playlists/${created.id}`, { replace: true })
    } catch (err) {
      setError(err.data ? Object.values(err.data).flat().join(' ') : err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Header */}
      <nav className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-[20px] h-16">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 transition-transform text-primary" onClick={() => navigate(-1)}>
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <h1 className="font-headline text-[20px] font-semibold text-primary">Create Playlist</h1>
        </div>
      </nav>

      <main className="pt-24 pb-32 px-[20px] max-w-2xl mx-auto space-y-8">

        {/* Cover Art */}
        <section className="flex flex-col items-center">
          <input
            id="picture-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handlePicture(e.target.files[0])}
          />
          <div
            className="relative group w-48 h-48 cursor-pointer"
            onClick={() => document.getElementById('picture-input').click()}
          >
            <div className="w-full h-full rounded-[16px] overflow-hidden shadow-2xl border-2 border-dashed border-secondary/30 relative">
              {preview ? (
                <>
                  <img src={preview} alt="cover" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-5xl">add_a_photo</span>
                    <span className="text-[12px] font-medium text-white">Change Cover</span>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-surface-container flex flex-col items-center justify-center gap-2 group-hover:bg-surface-container-high transition-colors">
                  <span className="material-symbols-outlined text-secondary text-5xl">add_a_photo</span>
                  <span className="text-[12px] font-medium text-on-surface-variant">Add Cover</span>
                </div>
              )}
            </div>
          </div>
          <p className="mt-3 text-[12px] text-on-surface-variant opacity-60">Recommended: 1024x1024px</p>
        </section>

        {/* Fields */}
        <section className="space-y-4">
          <div className="space-y-2">
            <label className="text-[13px] font-semibold text-primary ml-1 tracking-wide uppercase">Playlist Name</label>
            <input
              className="w-full h-14 px-4 bg-surface-container-high border border-white/10 rounded-[12px] focus:border-primary focus:ring-1 focus:ring-primary outline-none text-on-surface transition-all text-[16px]"
              type="text"
              placeholder="Playlist nomini kiriting..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        </section>

        {error && (
          <div className="px-4 py-3 bg-error-container/30 border border-error/30 rounded-[12px] text-error text-[14px]">
            {error}
          </div>
        )}

        <section className="pt-4">
          <button
            className="w-full h-14 bg-primary text-on-primary text-[14px] font-semibold rounded-full shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-60"
            onClick={handleSave}
            disabled={loading || !name.trim()}
          >
            {loading ? 'Yaratilmoqda...' : 'Create Playlist'}
          </button>
        </section>

      </main>
    </div>
  )
}
