import React, { useCallback, useEffect, useRef, useState } from 'react';
import buttonClickSound from '../../assets/button_click.mp3';
import backgroundMusic from '../../assets/song.mp3';
import song2 from '../../assets/song2.mp3';
import song3 from '../../assets/song3.mp3';
import { useScreen } from '../../context/ScreenContext';
import { useScreenSize } from '../../context/ScreenSizeContext';
import { Button } from '../button/button';
import { AudioContextManager } from './audio-context-manager';
import './audio-player.css';
import { AudioVisualizer } from './audio-visualizer';
import { VolumeKnob } from './volume-knob';
import MovingText from './free-palastine';

interface Props {
  children: React.ReactNode;
}

// Song data - defined outside component to prevent recreation on each render
const songs = [
  { id: 1, title: "I Don't Want To Set The World On Fire", src: backgroundMusic },
  { id: 2, title: 'Into Each Life Some Rain Must Fall', src: song2 },
  { id: 3, title: 'Civilization', src: song3 },
];

export const AudioPlayer: React.FC<Props> = ({ children }) => {
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const { isSmall } = useScreenSize();

  // Refs
  const audioRef = useRef<HTMLAudioElement>(new Audio(songs[currentSongIndex].src));
  const buttonSoundRef = useRef(new Audio(buttonClickSound));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextManagerRef = useRef<AudioContextManager | null>(null);
  const visualizerRef = useRef<AudioVisualizer | null>(null);

  // Context
  const { isScreenOn, registerOnScreenOff, unregisterOnScreenOff } = useScreen();

  // Initialize audio context and visualizer only once
  useEffect(() => {
    if (!canvasRef.current) return;

    // Only create the AudioContextManager if it doesn't exist
    if (!audioContextManagerRef.current) {
      audioContextManagerRef.current = new AudioContextManager(audioRef.current);
      visualizerRef.current = new AudioVisualizer(
        canvasRef.current,
        audioContextManagerRef.current.getAnalyzer()
      );
    }

    return () => {
      visualizerRef.current?.stop();
      audioContextManagerRef.current?.cleanup();
      audioContextManagerRef.current = null;
      visualizerRef.current = null;
    };
  }, []);

  // Handle screen state changes and glitching effect
  useEffect(() => {
    if (!visualizerRef.current) return;

    if (!isScreenOn) {
      // Screen turned off - ensure canvas is black
      visualizerRef.current.clearToBlack();
    } else {
      // Screen turned on - trigger glitching animation
      setIsGlitching(true);
      const timer = setTimeout(() => setIsGlitching(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [isScreenOn]);

  // Register screen off handler
  useEffect(() => {
    // Handle screen off event
    const handleScreenOff = async () => {
      if (isPlaying) {
        try {
          audioRef.current.pause();
          setIsPlaying(false);
          visualizerRef.current?.stop();
        } catch (error) {
          console.error('Error pausing audio when screen turned off:', error);
        }
      }
      visualizerRef.current?.clearToBlack();
    };

    registerOnScreenOff(handleScreenOff);
    return () => unregisterOnScreenOff();
  }, [registerOnScreenOff, unregisterOnScreenOff, isPlaying]);

  // Memoized audio control functions
  const playAudio = useCallback(async () => {
    if (!isScreenOn) return;
    try {
      await audioContextManagerRef.current?.resume();
      await buttonSoundRef.current.play();
      await new Promise(resolve => setTimeout(resolve, 200));
      await audioRef.current.play();
      setIsPlaying(true);
      visualizerRef.current?.start();
    } catch (error) {
      console.error('Error playing audio:', error);
    }
  }, [isScreenOn]);

  const pauseAudio = useCallback(async () => {
    if (!isScreenOn) return;
    try {
      await buttonSoundRef.current.play();
      await new Promise(resolve => setTimeout(resolve, 200));
      audioRef.current.pause();
      setIsPlaying(false);
      visualizerRef.current?.stop();
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  }, [isScreenOn]);

  const changeSong = useCallback(async (index: number) => {
    const wasPlaying = isPlaying;
    if (isPlaying) {
      await pauseAudio();
    }
    setCurrentSongIndex(index);
    audioRef.current.src = songs[index].src;
    if (wasPlaying) {
      await playAudio();
    }
  }, [isPlaying, pauseAudio, playAudio]);

  // Render component
  return (
    <div className={`audio-player ${isSmall ? 'small-screen' : ''}`}>
      {isSmall ? (
        // Mobile layout (under 800px)
        <>
          {/* Controls container for mobile layout */}
          <div className="controls-container">
            {/* Free Palestine moving text */}

            
            {/* Song list */}
            <div className={`song-list-container bg-screens ${!isScreenOn ? 'screen-off' : ''} ${isGlitching ? 'glitching' : ''}`}>
              {isScreenOn && songs.map((song, index) => (
                <q
                  key={song.id}
                  onClick={() => changeSong(index)}
                  className={`text-q text-q-content ${currentSongIndex === index ? 'selected' : ''}`}
                >
                  {song.title}
                </q>
              ))}
            </div>
            
            {/* Audio control buttons */}
            <div className="audio-player-buttons">
              <Button onClick={playAudio} disabled={isPlaying}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </Button>
              <Button onClick={pauseAudio} disabled={!isPlaying}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
                </svg>
              </Button>
              {children}
            </div>
          </div>
          
          {/* Volume knob */}
          <div className="volume-knob-container">
            <VolumeKnob audioRef={audioRef} initialVolume={50} />
          </div>
          
          {/* Audio visualizer canvas */}
          <canvas ref={canvasRef} />
        </>
      ) : (
        // Desktop layout
        <>
          
          <MovingText />
          <div className="audio-player-buttons">
            <Button onClick={playAudio} disabled={isPlaying}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </Button>
            <Button onClick={pauseAudio} disabled={!isPlaying}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6 4h4v16H6zm8 0h4v16h-4z" />
              </svg>
            </Button>
            {children}
          </div>
          
          <div className={`song-list-container bg-screens ${!isScreenOn ? 'screen-off' : ''} ${isGlitching ? 'glitching' : ''}`}>
            {isScreenOn && songs.map((song, index) => (
              <q
                key={song.id}
                onClick={() => changeSong(index)}
                className={`text-q text-q-content ${currentSongIndex === index ? 'selected' : ''}`}
              >
                {song.title}
              </q>
            ))}
          </div>
          
          <canvas ref={canvasRef} />
          
          <div className="volume-knob-container">
            <VolumeKnob audioRef={audioRef} initialVolume={50} />
          </div>
        </>
      )}
    </div>
  );
};
