import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

type SoundType = 'click' | 'win' | 'lose' | 'spin' | 'cashout'

export function useSound() {
  const { soundEnabled } = useGameStore()
  const audioContextRef = useRef<AudioContext | null>(null)
  
  useEffect(() => {
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
    return () => {
      audioContextRef.current?.close()
    }
  }, [])
  
  const playTone = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!soundEnabled || !audioContextRef.current) return
    
    const oscillator = audioContextRef.current.createOscillator()
    const gainNode = audioContextRef.current.createGain()
    
    oscillator.connect(gainNode)
    gainNode.connect(audioContextRef.current.destination)
    
    oscillator.frequency.value = frequency
    oscillator.type = type
    
    gainNode.gain.setValueAtTime(0.3, audioContextRef.current.currentTime)
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration)
    
    oscillator.start(audioContextRef.current.currentTime)
    oscillator.stop(audioContextRef.current.currentTime + duration)
  }
  
  const play = (type: SoundType) => {
    if (!soundEnabled) return
    
    switch (type) {
      case 'click':
        playTone(800, 0.1, 'sine')
        break
      case 'win':
        // Победная мелодия (мажорное трезвучие)
        setTimeout(() => playTone(523.25, 0.2, 'sine'), 0)    // C5
        setTimeout(() => playTone(659.25, 0.2, 'sine'), 100)  // E5
        setTimeout(() => playTone(783.99, 0.3, 'sine'), 200)  // G5
        break
      case 'lose':
        // Негативный звук (нисходящий)
        setTimeout(() => playTone(400, 0.2, 'sawtooth'), 0)
        setTimeout(() => playTone(300, 0.3, 'sawtooth'), 150)
        break
      case 'spin':
        // Звук вращения
        playTone(200, 0.05, 'triangle')
        break
      case 'cashout':
        // Звук получения денег
        setTimeout(() => playTone(1046.50, 0.15, 'sine'), 0)   // C6
        setTimeout(() => playTone(1318.51, 0.2, 'sine'), 100)  // E6
        break
    }
  }
  
  return { play }
}
