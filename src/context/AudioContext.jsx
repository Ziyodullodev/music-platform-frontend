import { createContext, useContext, useRef, useState, useEffect } from 'react'

const AudioCtx = createContext(null)

export function AudioProvider({ children }) {
  const audioRef = useRef(new Audio())
  const [track, setTrack] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [current, setCurrent] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const audio = audioRef.current
    const onTime = () => setCurrent(audio.currentTime)
    const onDuration = () => setDuration(audio.duration || 0)
    const onEnded = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDuration)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDuration)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [])

  function playTrack(newTrack) {
    const audio = audioRef.current
    if (track?.id === newTrack?.id) {
      audio.play()
      return
    }
    setTrack(newTrack)
    setCurrent(0)
    setDuration(0)
    audio.src = newTrack.music_data
    audio.load()
    audio.play().catch(() => {})
  }

  function togglePlay() {
    const audio = audioRef.current
    if (audio.paused) audio.play()
    else audio.pause()
  }

  function seek(time) {
    audioRef.current.currentTime = time
    setCurrent(time)
  }

  function skip(sec) {
    const audio = audioRef.current
    audio.currentTime = Math.min(Math.max(0, audio.currentTime + sec), duration)
  }

  return (
    <AudioCtx.Provider value={{ track, isPlaying, current, duration, playTrack, togglePlay, seek, skip }}>
      {children}
    </AudioCtx.Provider>
  )
}

export const useAudio = () => useContext(AudioCtx)
