import React, { useState, useRef, useEffect } from 'react';
import './audio-player.css';
import { VolumeKnob } from './volume-knob';
import { AudioVisualizer } from './audio-visualizer';
import { AudioContextManager } from './audio-context-manager';
import buttonClickSound from '../../assets/button_click.mp3';
import backgroundMusic from '../../assets/song.mp3';
import song2 from '../../assets/song2.mp3';
import song3 from '../../assets/song3.mp3';
import { Button } from '../button/button';

interface Props {
  children: React.ReactNode;
}

const songs = [
  { id: 1, title: "I Don't Want To Set The World On Fire", src: backgroundMusic },
  { id: 2, title: 'Into Each Life Some Rain Must Fall', src: song2 },
  { id: 3, title: 'We Three', src: song3 },
];

export const AudioPlayer: React.FC<Props> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(new Audio(songs[currentSongIndex].src));
  const buttonSoundRef = useRef(new Audio(buttonClickSound));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextManagerRef = useRef<AudioContextManager | null>(null);
  const visualizerRef = useRef<AudioVisualizer | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    audioContextManagerRef.current = new AudioContextManager(audioRef.current);
    visualizerRef.current = new AudioVisualizer(
      canvasRef.current,
      audioContextManagerRef.current.getAnalyzer()
    );

    return () => {
      visualizerRef.current?.stop();
      audioContextManagerRef.current?.cleanup();
    };
  }, []);

  const playAudio = async () => {
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
  };

  const pauseAudio = async () => {
    try {
      await buttonSoundRef.current.play();
      await new Promise(resolve => setTimeout(resolve, 200));
      audioRef.current.pause();
      setIsPlaying(false);
      visualizerRef.current?.stop();
    } catch (error) {
      console.error('Error pausing audio:', error);
    }
  };

  const changeSong = async (index: number) => {
    const wasPlaying = isPlaying;
    if (isPlaying) {
      await pauseAudio();
    }
    setCurrentSongIndex(index);
    audioRef.current.src = songs[index].src;
    if (wasPlaying) {
      await playAudio();
    }
  };

  return (
    <div className="audio-player">
      <div>

        <div className="song-list-container">
          {songs.map((song, index) => (
            <q key={song.id} onClick={() => changeSong(index)}
              className={`text-q text-q-content ${currentSongIndex === index ? 'selected' : ''}`}>
              {song.title}
            </q>
          ))}
        </div>
        <div className="canvas-container">
          <canvas
            ref={canvasRef}
            width="600"
            height="300"
            style={{
              width: '100%',
              height: '120px',
              backgroundColor: 'black',
              marginBottom: '20px',
              borderRadius: '8px',
            }}
          />
        </div>
      </div>
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
      <VolumeKnob audioRef={audioRef} initialVolume={50} />
    </div>
  );
};
