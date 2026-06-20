import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'

export default function Playlists() {
  const navigate = useNavigate()
  const { data, loading } = useApi(() => api.getPlaylists())
  const playlists = data?.results || []

  return (
    <div className="min-h-screen bg-background text-on-background">
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-[20px] h-16">
        <h1 className="font-headline text-[24px] font-bold text-primary tracking-tighter">My Playlists</h1>
        <button className="active:scale-95 transition-transform text-on-surface" onClick={() => navigate('/playlists/new/edit')}>
          <span className="material-symbols-outlined">add</span>
        </button>
      </header>

      <main className="pt-20 pb-36 px-[20px]">
        {loading ? (
          <div className="flex flex-col gap-4 mt-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center gap-4 p-4 bg-surface-container rounded-[16px]">
                <div className="w-20 h-20 rounded-[12px] shimmer shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 shimmer rounded-full" />
                  <div className="h-3 w-1/2 shimmer rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : playlists.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="material-symbols-outlined text-[64px] text-outline-variant mb-4">library_music</span>
            <h3 className="font-headline text-[20px] font-semibold text-on-surface">No playlists yet</h3>
            <p className="text-[14px] text-on-surface-variant mt-2">Create your first playlist</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            {playlists.map(pl => (
              <div
                key={pl.id}
                className="flex items-center gap-4 p-4 bg-surface-container rounded-[16px] cursor-pointer active:scale-[0.98] transition-transform"
                onClick={() => navigate(`/playlists/${pl.id}`)}
              >
                {(pl.picture || pl.cover || pl.image) ? (
                  <img src={pl.picture || pl.cover || pl.image} alt={pl.name || pl.title} className="w-20 h-20 rounded-[12px] object-cover shrink-0 shadow-lg" />
                ) : (
                  <div className="w-20 h-20 rounded-[12px] bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-on-surface-variant">library_music</span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-headline text-[18px] font-bold text-on-surface truncate">{pl.name || pl.title}</p>
                  {pl.author_name && <p className="text-[12px] text-on-surface-variant mt-0.5">By {pl.author_name}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    {pl.music_count != null && (
                      <span className="text-[11px] font-semibold text-on-surface-variant bg-surface-container-high px-2 py-0.5 rounded-full">
                        {pl.music_count} songs
                      </span>
                    )}
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${pl.is_public ? 'text-secondary bg-secondary/10' : 'text-on-surface-variant bg-surface-container-high'}`}>
                      {pl.is_public ? 'Public' : 'Private'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <button
                    className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors"
                    onClick={e => { e.stopPropagation(); navigate(`/playlists/${pl.id}/edit`) }}
                  >
                    <span className="material-symbols-outlined text-[20px]">edit</span>
                  </button>
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
