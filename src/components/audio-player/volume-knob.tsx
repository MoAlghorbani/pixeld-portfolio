import React, { useEffect, useRef, useState } from 'react';
import './volume-knob.css';

interface VolumeKnobProps {
  audioRef: React.RefObject<HTMLAudioElement>;
  initialVolume?: number;
}

export const VolumeKnob: React.FC<VolumeKnobProps> = ({ audioRef, initialVolume = 50 }) => {
  const [volume, setVolume] = useState(initialVolume);
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = initialVolume / 100;
    }
    // Set initial rotation to match middle volume
    if (knobRef.current) {
      const rotation = (initialVolume * 270) / 100;
      knobRef.current.style.transform = `rotate(${rotation}deg)`;
    }
  }, []);

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (event: MouseEvent | TouchEvent) => {
    if (!isDragging || !knobRef.current) return;

    // Get the current position of the knob element
    const knobRect = knobRef.current.getBoundingClientRect();
    const knobCenterX = knobRect.width / 2 + knobRect.left;
    const knobCenterY = knobRect.height / 2 + knobRect.top;

    // Get the current mouse/touch position
    // Use clientX/Y instead of pageX/Y to handle scrolling correctly
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    // Calculate the angle between the center of the knob and the mouse position
    const adjacentSide = knobCenterX - clientX;
    const oppositeSide = knobCenterY - clientY;

    let angle = Math.atan2(adjacentSide, oppositeSide) * 180 / Math.PI;
    angle = -(angle - 135);

    // Constrain the angle to 0-270 degrees (the valid range for the knob)
    if (angle < 0) angle = 0;
    if (angle > 270) angle = 270;
    
    // Convert the angle to a volume value (0-100)
    const volumeValue = Math.floor(angle / (270 / 100));
    setVolume(volumeValue);

    // Update the audio element's volume
    if (audioRef.current) {
      audioRef.current.volume = volumeValue / 100;
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);


  return (
    <div className="volume-knob-main-container">
      <div className="volume-knob-container">
        <div className="knob-surround">
          <div className="knob-top">
            <div
              ref={knobRef}
              className="knob"
              style={{ transform: `rotate(${(volume * 270) / 100}deg)` }}
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
            />
          </div>
          <div className="knob-bottom"></div>
          <div className="knob-base"></div>
        </div>
      </div>
      <div className="volume-labels">
        <span className="min">Min</span>
        <span className="max">Max</span>
      </div>
    </div>

  );
};
