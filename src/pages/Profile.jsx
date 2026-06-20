import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'

const libraryTracks = [
  {
    id: 1,
    title: 'Neon Horizon',
    sub: 'Original Mix • 4:22',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDS3lgUq9uaPL1GT9Njk9xKp3ttR3ziVFxrE160Rz0m16_MViSu3LpT6hYWklvH-z4818d2Bo4rtOIRV5a3-FAGqGiy2yUDxpC1j3nAh08I36hD-neBlTo2mVUs6fktBRSGKJUpNZUp3iJN_g4CgjHJ1kgRWyOBd8Ycw2oTAZahV_8PPOq949x0W3b_GSJmI1GSOYGF-0sW6SHoNXTSkV7lB86MwdRv_nWikFQXEURIqNO4FhZYJ_2WNndgVue3DfD_L0W_d618rXh7',
  },
  {
    id: 2,
    title: 'Midnight Echo',
    sub: 'Original Mix • 3:45',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBDpUkV0ZC4qXay7aFFcq7FSaGSdVwWMbvJjMVy_d2GeBOa_ljbbKsHV8RRE3i06LVyMlZe2D0_vuduPyeSvFTbmCRbtz4Ogrhah50GqQMgdNgxYJ_mhokOTxnwg3_dPSnHubxwbG1dPIRi4knVtF6SBEGudfrdeE7vXX5gJyWdDPcgsINmWEGlfbvzkQocvdEvBZCymd7gvaD6a6J3zu8uHeQYcMGDqb6-s_mgEu5a8fUHaCgwFpcDvJt1SLB8dzLcMGEODluqKDEK',
  },
  {
    id: 3,
    title: 'Digital Pulse',
    sub: 'Original Mix • 5:10',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDyAlznUj2fHNk6-fKp_juYT7RfOmC0gKZyP39KtmyOxVMBtKLd7ueJicLibGpaCJBA_GeeuI_BoaMbA3RjprsadwaJfBFSse89w0GooLqTcBMXLlDBSlhMZoGk3q1adiLY2oUh-0scpc28P19dg0iHDZDy6noxz6GrlDQEWRs9LDVBXnoRD2HvHXOoWOxAKIzN58YPKE1ZiQ-5wByrZto18WHT3AToAOD-DiixAO7WGQwHl0KuG8AGH7ZvogqgRb64Ah-lL2yPR6ex',
  },
]

const preferences = [
  { icon: 'upload', color: 'text-primary bg-primary/10', label: 'Upload Music', sub: 'Share your latest tracks', route: '/upload', toggle: false },
  { icon: 'download_for_offline', color: 'text-primary bg-primary/10', label: 'Offline Mode', sub: 'Listen without internet', toggle: true },
  { icon: 'high_quality', color: 'text-secondary bg-secondary/10', label: 'Audio Quality', sub: 'Lossless (24-bit/192kHz)', toggle: false },
  { icon: 'notifications', color: 'text-tertiary bg-tertiary/10', label: 'Notification Settings', sub: 'Push, email & artist updates', toggle: false },
]

export default function Profile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const [offlineMode, setOfflineMode] = useState(false)

  const { data: musicData } = useApi(() => api.getMusics())
  const { data: playlistData } = useApi(() => api.getPlaylists())

  const musicCount = musicData?.count ?? 124
  const playlistCount = playlistData?.count ?? 18

  const displayTracks = musicData?.results?.length > 0
    ? musicData.results.slice(0, 3).map(t => ({
        id: t.id,
        title: t.name || t.title,
        sub: `${t.author_name || ''} • ${t.duration || ''}`.trim().replace(/^•\s*|•\s*$/, ''),
        cover: t.image || t.cover || null,
      }))
    : libraryTracks

  return (
    <div className="min-h-screen bg-background text-on-background">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-[20px] h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10">
        <button className="active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary">menu</span>
        </button>
        <h1 className="font-headline text-[24px] font-bold text-primary tracking-tighter">F-music</h1>
        <button className="active:scale-95 transition-transform">
          <span className="material-symbols-outlined text-primary">search</span>
        </button>
      </header>

      <main className="pt-24 pb-32 px-[20px]">

        {/* Profile Header */}
        <section className="flex flex-col items-center mb-8">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:bg-primary/40 transition-all duration-500" />
            <div className="w-32 h-32 rounded-full p-[3px] relative" style={{ background: 'linear-gradient(135deg, #d0bcff, #4cd7f6)' }}>
              <div className="w-full h-full rounded-full overflow-hidden border-4 border-surface">
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                  <span className="material-symbols-outlined text-[52px] text-on-surface-variant" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                </div>
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-on-primary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest shadow-lg border border-surface">
              Pro
            </div>
          </div>
          <h2 className="mt-4 font-headline text-[24px] font-bold text-on-surface">
            {user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : 'Senior Teamlead'}
          </h2>
          <p className="text-[14px] text-on-surface-variant opacity-70">Curator &amp; Creator</p>
        </section>

        {/* Stats */}
        <section className="grid grid-cols-3 gap-2 mb-8">
          {[
            { label: 'Tracks', value: musicCount },
            { label: 'Playlists', value: playlistCount },
            { label: 'Listeners', value: '2.4k' },
          ].map(s => (
            <div key={s.label} className="glass-panel rounded-[12px] py-3 flex flex-col items-center justify-center text-center">
              <span className="font-headline text-[20px] font-semibold text-primary">{s.value}</span>
              <span className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-tight mt-0.5">{s.label}</span>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <div className="flex gap-2">
            <button className="flex-1 bg-primary-container text-on-primary-container h-12 rounded-[12px] text-[14px] font-semibold flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg">
              <span className="material-symbols-outlined text-[20px]">edit</span>
              Edit Profile
            </button>
            <button
              className="w-12 h-12 glass-panel rounded-[12px] flex items-center justify-center text-on-surface active:scale-95 transition-all hover:bg-surface-variant"
              onClick={() => { logout(); navigate('/login') }}
              title="Logout"
            >
              <span className="material-symbols-outlined">logout</span>
            </button>
          </div>
        </section>

        {/* Your Library */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-headline text-[20px] font-semibold text-on-surface">Your Library</h3>
            <button className="text-[12px] font-semibold text-primary hover:underline">View all</button>
          </div>
          <div className="flex flex-col gap-3">
            {displayTracks.map(track => (
              <div
                key={track.id}
                className="glass-panel rounded-[12px] p-3 flex items-center gap-4 hover:bg-surface-container-high transition-colors group cursor-pointer active:scale-[0.98]"
                onClick={() => navigate(`/music/${track.id}`)}
              >
                <div className="w-14 h-14 rounded-[8px] overflow-hidden shrink-0 relative">
                  {track.cover ? (
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">music_note</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-[16px] font-medium text-on-surface truncate">{track.title}</h4>
                  <p className="text-[12px] text-on-surface-variant truncate">{track.sub}</p>
                </div>
                <button className="text-on-surface-variant hover:text-primary" onClick={e => e.stopPropagation()}>
                  <span className="material-symbols-outlined">more_vert</span>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Preferences */}
        <section>
          <h3 className="font-headline text-[20px] font-semibold text-on-surface mb-4">Preferences</h3>
          <div className="glass-panel rounded-[12px] divide-y divide-white/5">
            {preferences.map((pref, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-4 transition-colors ${!pref.toggle ? 'cursor-pointer hover:bg-surface-variant/30 active:scale-[0.99]' : ''}`}
                onClick={() => !pref.toggle && pref.route && navigate(pref.route)}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${pref.color}`}>
                    <span className="material-symbols-outlined text-[20px]">{pref.icon}</span>
                  </div>
                  <div>
                    <p className="text-[16px] text-on-surface">{pref.label}</p>
                    <p className="text-[10px] text-on-surface-variant opacity-60">{pref.sub}</p>
                  </div>
                </div>
                {pref.toggle ? (
                  <label className="relative inline-flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="sr-only peer" checked={offlineMode} onChange={e => setOfflineMode(e.target.checked)} />
                    <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                ) : (
                  <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
                )}
              </div>
            ))}
          </div>
        </section>

      </main>
    </div>
  )
}
