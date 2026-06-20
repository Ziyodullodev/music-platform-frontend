import { useNavigate } from 'react-router-dom'
import { useApi } from '../hooks/useApi'
import { api } from '../api/client'
import { useAudio } from '../context/AudioContext'

const artists = [
  {
    id: 1,
    name: 'Luna X',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCe87ol-LHpONKc0JFSx2efJv1s7dp_PIXnj5xDJ8QjWF-eRuTHBzXoa3oDZaHeEXf3gDmvq-dch8eV8JHn4pOe-pt4qQyq5GaiuEIU-48go3pXFKNidzNi3CwyeZsB6toBN1Puad3hV0FqhqeaargeNWh6aG9PROGTOxQifhvMFUnBlLATIlQbudK8oubOPdaaT6eZ_MPyb1CCQO1ixIJi-yWr8HZGS1ooGOzxAaSRpQ8SN3ekI824RSUOTYxjl1PTjI9xPC9EtYbE',
  },
  {
    id: 2,
    name: 'Jazz Soul',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBsEk5cVCkORgAzj6WoR2SoHGErEQm_3VdmyDeSx1f1b70Iuln-8Fn_1cf4_njrh3aowtFi9SkHHHRW_pt6E_J9eOMpwzitsYSHzF8_KaFhqWmdUH_upcXBhhTgoHVHp-Li5RsxRuqeFU0HRnSE7TW-F2sWaW6AvtLKeMv72b5RR7JCyi9Aev4zBFCnQGG_w1gz_yKjJ0ZeSEZuJ0WzOx5czoWL3_YZ9I7rNfsT2FDUGHV9u3FY0GCvENlza7bf3KQuXw4Ur1kwjobV',
  },
  {
    id: 3,
    name: 'Echo Box',
    img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDp_e_83AfSOB72x0vYPFpEpgOnNcJciX0Zuy0lOIqgJYcYD-BbQkc0PVfG0ouqTuEMPEQ1ymUyy6iVbeEdaSFEJG2Eqhql6OKwrPWL4ywUuuUIUu9k3X3KJZ08rAQcc47iwAHRiI6UBEmMrNJTxt9G2E3V3RJeeA7cMdWHqqbYzW9C1UcVEcMJnbpUK-0TOFV814eL2Glf3hPypUjmZLEr0fdg14oRCHfQA1feCkHHYe6yOFS5aDM0BG9-naelpwTIZk3eEPzqy_QG',
  },
]

const topMusics = [
  {
    id: 1,
    title: 'Cyber Drift',
    artist: 'Arcade High',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCb15649F3hMeW3f2VP1BjuFJsoekWvWO2LiGtHKxffYryPkObHGLviyd2RWustlw4Qo0-GxVekaU75Dj-VWGH_N0Nj_-kTTcwRaxEyNp1--_vvJcxnwGe8RB6pKBllZC34EUiTRYI8l1kAA-EA_elLJrHhhF5vUaSCDWAfsl5EoP2WtGJRTGa49OVOw5UB-JujLvWD1zhTNk5buerdUIBEWM7tun6qEkP3_u6NuavVWq8zjnEOq30LBBvBKxhgBt3qCtvD6i9mEXfR',
  },
  {
    id: 2,
    title: 'Synth City',
    artist: 'Neon Ghost',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAOSHD5dzMztXah8kR-TAM0Z1ghKLZUvHCnjR1Zyc-VwVgrY94olVc2Oh7hkZboVgOdjxFP8gop6ALyhZBzc5F-yAC2SFjyHge_4BUERgzUt7ZL0pL7OYHLN1cmx_fouMPuonqnKSN8tqM3UkPv68tTLk4A6pLV3ZS4d9Fu06HRvpyQSbu8HkkC5CjXrKpAD6OTgjAT6GJnZOlI13f8npD9xefCa3JCWkPnZsqKRX3eprdme1MHFhQyabJzk-NuxiWVPznysj6K26Qm',
  },
  {
    id: 3,
    title: 'Lunar Beats',
    artist: 'The Orbiters',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAeK8gOX0Au9J1pWtyGQk9dn6uQ2qQUjlj_LQxxcQdJN3qxlBe5c3Tg0fJK75SZNA15znTAnx012ldyb-8mzw-a1J02E-5zFLEjb6faH_B20VYBReptIHKwTj3D_pUZudGaQM6pLnGC7lYgeN5pSXaQZBFfG_EqwIbj74m9ts5aUHrmMKkisb6QvyzVaNsWaLYCoZrxmAXah97L3H2RRV0tuMnFtcVNi3ABNmMVmNiqNmQnge6F6QupzUiXSlULtOUQW2HEcDsu6YD',
  },
]

const favPlaylists = [
  {
    id: 'rainy',
    title: 'Rainy Night Lo-Fi',
    type: 'Private',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoSsZZDJhamJl4JBSoxS8b0IHhAEhwMU0tk6jg8mufcEGxZHTSTWU86Lp0CjG_HB-USZxo1LHC2LZJ6JlERx_vaUOm-fDF59oH-G7unYE2CLXaR4vabh2VaY9_r6T_66i7xRp_Uv82aaS3E23UHrmMMG8YP0a1DAf2KY7lB1rDuIEEbn32xJVOwr2v8wY2bujdL26iVaxzEKvzPEvZouvhAqp6pKiUUGjmSyoEFANz_yYX4d1iTHUXGi9iRJdy87bZ3qGetD2e24We',
    large: true,
  },
  {
    id: 'workout',
    title: 'Daily Workout',
    type: 'Public',
    cover: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUCOWflptEsqvzuMz3ayZV9g-0BDwYZ7LTLFuXqAeFiv4xvoudz1Yjs6bRQyKFCAF3EU20CxWr9vEPNSDvmcJ0njmSw1nM4TXSZAvdUxMwjN_UVLSMaviv-QrEp-9KxZ2l_rTO2tdORiFQYoqO3CTwlKu-bnOnYKz6n21FnvM1D8LTlAFxBXV66vecs-VvxBCT7eE8W2IeVcji2YUJ7IyGjoct_yTSau7R65Btq1-tqA78j6kjb9qvDaH9iYDEH1NjKIQa9-X3unMR',
    large: false,
  },
]

export default function Home() {
  const { playTrack } = useAudio()
  const navigate = useNavigate()
  const { data: musicData, loading: musicLoading } = useApi(() => api.getMusics())
  const { data: playlistData, loading: playlistLoading } = useApi(() => api.getPlaylists())
  const { data: favData } = useApi(() => api.getFavourites())
  const { data: favPlaylistData } = useApi(() => api.getFavouritePlaylists())

  const apiMusics = musicData?.results || []
  const apiPlaylists = playlistData?.results || []
  const apiFavMusics = favData?.results || []
  const apiFavPlaylists = favPlaylistData?.results || []

  // top musics: API bo'sh bo'lsa statik fallback
  const displayMusics = apiMusics.length > 0 ? apiMusics : topMusics
  const displayPlaylists = apiPlaylists.length > 0 ? apiPlaylists : []
  const displayFavPlaylists = apiFavPlaylists.length > 0
    ? apiFavPlaylists
    : favPlaylists

  return (
    <div className="min-h-screen bg-background text-on-background overflow-x-hidden">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-surface/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-[20px] h-16">
        <div className="flex items-center gap-4">
          <button className="active:scale-95 transition-transform text-primary">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="font-headline text-[24px] font-bold text-primary tracking-tighter">F-music</h1>
        </div>
        <button className="active:scale-95 transition-transform text-primary">
          <span className="material-symbols-outlined">search</span>
        </button>
      </header>

      <main className="pt-20 pb-36">

        {/* Top Playlists */}
        <section className="mb-12 px-[20px]">
          <h3 className="font-headline text-[20px] font-semibold text-on-surface mb-4">Top playlists</h3>
          <div className="flex overflow-x-auto gap-6 items-center" style={{ scrollbarWidth: 'none' }}>
            {/* Add button */}
            <button className="flex flex-col items-center gap-2 group shrink-0">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant group-hover:border-primary group-hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary text-[32px]">add</span>
              </div>
            </button>
            {/* Playlist circles — API */}
            {playlistLoading ? (
              <>
                {[1,2,3].map(i => (
                  <div key={i} className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full shimmer" />
                    <div className="w-14 h-3 shimmer rounded-full" />
                  </div>
                ))}
              </>
            ) : displayPlaylists.length > 0 ? displayPlaylists.map(pl => (
              <button
                key={pl.id}
                className="shrink-0 flex flex-col items-center gap-2 active:scale-95 transition-transform"
                onClick={() => navigate(`/playlists/${pl.id}`)}
              >
                <div className="w-20 h-20 rounded-full border-2 border-white/5 overflow-hidden">
                  {(pl.picture || pl.cover || pl.image) ? (
                    <img src={pl.picture || pl.cover || pl.image} alt={pl.name || pl.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">library_music</span>
                    </div>
                  )}
                </div>
                <span className="text-[11px] text-on-surface-variant text-center truncate w-20">
                  {pl.name || pl.title}
                </span>
              </button>
            )) : (
              <>
                {[1,2].map(i => (
                  <div key={i} className="shrink-0 flex flex-col items-center gap-2">
                    <div className="w-20 h-20 rounded-full shimmer" />
                    <div className="w-14 h-3 shimmer rounded-full" />
                  </div>
                ))}
              </>
            )}
          </div>
        </section>

        {/* Top Musics */}
        <section className="mb-12">
          <div className="px-[20px] flex justify-between items-end mb-4">
            <h3 className="font-headline text-[20px] font-semibold text-on-surface">Top musics</h3>
            <button className="text-[14px] font-semibold text-primary hover:opacity-80 transition-opacity">View all</button>
          </div>
          <div className="flex overflow-x-auto gap-4 px-[20px] snap-x" style={{ scrollbarWidth: 'none' }}>
            {musicLoading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="shrink-0 w-40 snap-start">
                  <div className="mb-3 aspect-square rounded-[12px] shimmer" />
                  <div className="h-4 w-3/4 shimmer rounded-full mb-2" />
                  <div className="h-3 w-1/2 shimmer rounded-full" />
                </div>
              ))
            ) : displayMusics.map(music => (
              <div
                key={music.id}
                className="shrink-0 w-40 snap-start group cursor-pointer"
                onClick={() => { playTrack(music); navigate(`/music/${music.id}`) }}
              >
                <div className="relative mb-3 aspect-square overflow-hidden rounded-[12px] bg-surface-variant transition-transform duration-300 group-hover:scale-105">
                  {(music.picture || music.cover || music.image) ? (
                    <img src={music.picture || music.cover || music.image} alt={music.name || music.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                      <span className="material-symbols-outlined text-[40px] text-on-surface-variant">music_note</span>
                    </div>
                  )}
                  <button
                    className="absolute bottom-2 right-2 w-10 h-10 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                    onClick={e => { e.stopPropagation(); playTrack(music); navigate(`/music/${music.id}`) }}
                  >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>play_arrow</span>
                  </button>
                </div>
                <h4 className="text-[16px] font-medium text-on-surface truncate">{music.name || music.title}</h4>
                <p className="text-[12px] text-on-surface-variant truncate">{music.source || music.artist || music.author_name || ''}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Favourite Musics (Artists) */}
        <section className="mb-12">
          <div className="px-[20px] mb-4">
            <h3 className="font-headline text-[20px] font-semibold text-on-surface">Favourite musics</h3>
          </div>
          <div className="flex overflow-x-auto gap-6 px-[20px] items-start" style={{ scrollbarWidth: 'none' }}>
            {artists.map(artist => (
              <div key={artist.id} className="flex flex-col items-center gap-2 group shrink-0">
                <div className="w-20 h-20 rounded-full border-2 border-primary/20 p-1 group-hover:border-primary transition-colors">
                  <img src={artist.img} alt={artist.name} className="w-full h-full object-cover rounded-full" />
                </div>
                <span className="text-[12px] font-medium text-on-surface-variant text-center truncate w-20">{artist.name}</span>
              </div>
            ))}
            {/* More button */}
            <button className="flex flex-col items-center gap-2 group shrink-0">
              <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center border-2 border-dashed border-outline-variant group-hover:border-primary group-hover:bg-surface-container-high transition-all">
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">add</span>
              </div>
              <span className="text-[12px] font-medium text-on-surface-variant">More</span>
            </button>
          </div>
        </section>

        {/* Favourite Playlists (Bento) */}
        <section className="px-[20px]">
          <h3 className="font-headline text-[20px] font-semibold text-on-surface mb-4">Favourite Playlists</h3>
          <div className="grid grid-cols-2 gap-4">
            {displayFavPlaylists.length > 0 ? (
              <>
                {/* Large card */}
                {displayFavPlaylists[0] && (
                  <div
                    className="col-span-2 relative overflow-hidden rounded-[16px] h-48 group cursor-pointer bg-surface-container active:scale-[0.98] transition-transform"
                    onClick={() => navigate(`/playlists/${displayFavPlaylists[0].playlist?.id || displayFavPlaylists[0].id}`)}
                  >
                    {(displayFavPlaylists[0].cover || displayFavPlaylists[0].image || displayFavPlaylists[0].playlist?.cover) && (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url('${displayFavPlaylists[0].cover || displayFavPlaylists[0].image || displayFavPlaylists[0].playlist?.cover}')` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <div>
                        <p className="text-[12px] font-medium text-secondary mb-1">
                          {displayFavPlaylists[0].is_public === false ? 'Private' : 'Public'}
                        </p>
                        <h4 className="font-headline text-[20px] font-semibold text-white">
                          {displayFavPlaylists[0].title || displayFavPlaylists[0].playlist?.title || 'Playlist'}
                        </h4>
                      </div>
                      <span className="material-symbols-outlined text-white">
                        {displayFavPlaylists[0].is_public === false ? 'lock' : 'public'}
                      </span>
                    </div>
                  </div>
                )}
                {/* Small card */}
                {displayFavPlaylists[1] && (
                  <div
                    className="relative overflow-hidden rounded-[16px] h-40 group cursor-pointer bg-surface-container active:scale-[0.98] transition-transform"
                    onClick={() => navigate(`/playlists/${displayFavPlaylists[1].playlist?.id || displayFavPlaylists[1].id}`)}
                  >
                    {(displayFavPlaylists[1].cover || displayFavPlaylists[1].image || displayFavPlaylists[1].playlist?.cover) && (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                        style={{ backgroundImage: `url('${displayFavPlaylists[1].cover || displayFavPlaylists[1].image || displayFavPlaylists[1].playlist?.cover}')` }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-[12px] font-semibold text-primary mb-1">
                        {displayFavPlaylists[1].is_public === false ? 'Private' : 'Public'}
                      </p>
                      <h4 className="text-[16px] font-bold text-white">
                        {displayFavPlaylists[1].title || displayFavPlaylists[1].playlist?.title || 'Playlist'}
                      </h4>
                    </div>
                  </div>
                )}
                {/* Skeleton if odd count */}
                {displayFavPlaylists.length % 2 !== 0 && (
                  <div className="h-40 rounded-[16px] shimmer" />
                )}
              </>
            ) : (
              <>
                {/* Static fallback cards */}
                {favPlaylists.map((pl, idx) => (
                  <div
                    key={pl.id}
                    className={`${idx === 0 ? 'col-span-2 h-48' : 'h-40'} relative overflow-hidden rounded-[16px] group cursor-pointer bg-surface-container active:scale-[0.98] transition-transform`}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url('${pl.picture || pl.cover || pl.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className={`absolute ${idx === 0 ? 'bottom-4 left-4 right-4 flex justify-between items-end' : 'bottom-3 left-3 right-3'}`}>
                      <div>
                        <p className={`text-[12px] font-semibold mb-1 ${pl.type === 'Private' ? 'text-secondary' : 'text-primary'}`}>{pl.type}</p>
                        <h4 className={`font-bold text-white ${idx === 0 ? 'font-headline text-[20px]' : 'text-[16px]'}`}>{pl.name || pl.title}</h4>
                      </div>
                      {idx === 0 && <span className="material-symbols-outlined text-white">lock</span>}
                    </div>
                  </div>
                ))}
                <div className="h-40 rounded-[16px] shimmer" />
              </>
            )}
          </div>
        </section>

      </main>
    </div>
  )
}
