import { useEffect, useRef } from 'react';
import keySound from '../assets/key.wav';

interface UseKeyboardSoundOptions {
  enabled?: boolean;
  volume?: number;
  excludeKeys?: string[];
}

/**
 * A hook that plays a keyboard sound effect when keys are pressed
 */
export const useKeyboardSound = (options: UseKeyboardSoundOptions = {}) => {
  const { 
    enabled = true, 
    volume = 0.5,
    excludeKeys = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']
  } = options;
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    // Create audio element
    if (!audioRef.current) {
      audioRef.current = new Audio(keySound);
      audioRef.current.volume = volume;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Skip excluded keys
      if (excludeKeys.includes(event.key)) return;
      
      // Play the sound
      if (audioRef.current) {
        // Reset the audio to start position to allow rapid key presses
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(err => {
          // Handle any autoplay restrictions
          console.warn('Could not play keyboard sound:', err);
        });
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, volume, excludeKeys]);

  // Return methods to manually control the sound
  return {
    playSound: () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        return audioRef.current.play();
      }
      return Promise.reject('Audio not initialized');
    },
    setVolume: (newVolume: number) => {
      if (audioRef.current) {
        audioRef.current.volume = newVolume;
      }
    }
  };
};
