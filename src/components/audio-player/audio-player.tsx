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
  const [isAudioInitialized, setIsAudioInitialized] = useState(false);
  const { isSmall } = useScreenSize();

  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const buttonSoundRef = useRef<HTMLAudioElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextManagerRef = useRef<AudioContextManager | null>(null);
  const visualizerRef = useRef<AudioVisualizer | null>(null);

  // Context
  const { isScreenOn, registerOnScreenOff, unregisterOnScreenOff } = useScreen();

  // Initialize core audio elements that DON'T depend on the canvas
  useEffect(() => {
    const audioEl = new Audio();
    audioRef.current = audioEl;

    const buttonSoundEl = new Audio(buttonClickSound);
    buttonSoundRef.current = buttonSoundEl;

    const manager = new AudioContextManager(audioEl);
    audioContextManagerRef.current = manager;

    setIsAudioInitialized(true);

    return () => {
      // This cleanup runs when the component fully unmounts
      manager.cleanup();
    };
  }, []);

  // Initialize the visualizer, which DOES depend on the canvas
  useEffect(() => {
    // Wait for the canvas and the audio manager to be ready
    if (!canvasRef.current || !audioContextManagerRef.current) {
      return;
    }

    // A visualizer might exist from a previous render, so stop it.
    visualizerRef.current?.stop();

    const visualizer = new AudioVisualizer(
      canvasRef.current,
      audioContextManagerRef.current.getAnalyzer()
    );
    visualizerRef.current = visualizer;

    // If music was already playing when this effect runs, start the new visualizer.
    if (isPlaying) {
      visualizer.start();
    }

    return () => {
      visualizer.stop();
    };
  }, [isSmall, isAudioInitialized]);

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
          audioRef.current!.pause();
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
    if (!isScreenOn || !audioRef.current || !buttonSoundRef.current) return;
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
    if (!isScreenOn || !audioRef.current || !buttonSoundRef.current) return;
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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = songs[currentSongIndex].src;
      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Autoplay was prevented.
            setIsPlaying(false);
          });
        }
      }
    }
  }, [currentSongIndex]); // isPlaying is intentionally omitted to prevent loops

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
                  onClick={() => setCurrentSongIndex(index)}
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
            {isAudioInitialized && <VolumeKnob audioRef={audioRef} initialVolume={50} />}
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
                onClick={() => setCurrentSongIndex(index)}
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
