import React, { useEffect, useRef } from 'react';
import { useScreen } from '../../context/ScreenContext';
import './svg-vu-meter.css';

interface SVGVUMeterProps {
  audioContextManager: any | null;
  isPlaying: boolean;
}

const SVGVUMeter: React.FC<SVGVUMeterProps> = ({ audioContextManager, isPlaying }) => {
  const zeigerRef = useRef<SVGPathElement | null>(null);
  const { isScreenOn } = useScreen();
  const animationFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  const prevValueRef = useRef<number>(15); // Start at 15 degrees

  useEffect(() => {
    // Initialize analyzer if not already done and audioContextManager exists
    if (audioContextManager && !analyserRef.current) {
      try {
        analyserRef.current = audioContextManager.getAnalyzer();
        if (analyserRef.current) {
          dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
          console.log('SVG VU Meter: Analyzer initialized successfully');
        }
      } catch (error) {
        console.error('SVG VU Meter: Error initializing analyzer:', error);
      }
    }
    
    const updateMeter = () => {
      if (!zeigerRef.current) {
        animationFrameRef.current = requestAnimationFrame(updateMeter);
        return;
      }

      if (!isScreenOn || !isPlaying) {
        // Slowly return to minimum position when not playing
        const currentRotation = prevValueRef.current;
        const newRotation = Math.max(currentRotation - 1, 15);
        zeigerRef.current.style.transform = `rotate(${newRotation}deg)`;
        prevValueRef.current = newRotation;
        animationFrameRef.current = requestAnimationFrame(updateMeter);
        return;
      }

      // Ensure we have an analyzer and data array
      if (!analyserRef.current && audioContextManager) {
        try {
          analyserRef.current = audioContextManager.getAnalyzer();
          if (analyserRef.current) {
            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);
          }
        } catch (error) {
          console.error('SVG VU Meter: Error getting analyzer:', error);
        }
      }

      if (analyserRef.current && dataArrayRef.current && zeigerRef.current) {
        try {
          // Get frequency data
          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          
          // Calculate average level across all frequencies
          const avgLevel = calculateAverageVolume(dataArrayRef.current, 0, dataArrayRef.current.length);
          
          // Map the audio level (0-255) to rotation (15-75 degrees) with increased sensitivity
          // Apply a non-linear scaling to make it more sensitive to lower volumes
          // Using a square root function to enhance sensitivity at lower levels
          const normalizedLevel = Math.sqrt(avgLevel / 255) * 255;
          // Apply additional amplification factor (2.0 makes it twice as sensitive)
          const amplifiedLevel = Math.min(normalizedLevel * 2.0, 255);
          // Map to rotation range (15-75 degrees)
          const targetRotation = 15 + (amplifiedLevel / 255) * 60;
          const currentRotation = prevValueRef.current;
          
          // Faster response (increased from 0.3 to 0.5 for quicker movement)
          const newRotation = currentRotation + (targetRotation - currentRotation) * 0.5;
          prevValueRef.current = newRotation;
          
          // Update needle rotation
          zeigerRef.current.style.transform = `rotate(${newRotation}deg)`;
        } catch (error) {
          console.error('SVG VU Meter: Error updating meter:', error);
        }
      }
      
      animationFrameRef.current = requestAnimationFrame(updateMeter);
    };
    
    // Start the animation loop
    animationFrameRef.current = requestAnimationFrame(updateMeter);
    
    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [audioContextManager, isPlaying, isScreenOn]);
  
  // Helper function to calculate average volume from a portion of the frequency data
  const calculateAverageVolume = (dataArray: Uint8Array, start: number, end: number): number => {
    let sum = 0;
    const length = end - start;
    
    for (let i = start; i < end; i++) {
      sum += dataArray[i];
    }
    
    return sum / length;
  };

  return (
    <div className={`svg-vu-meter-container ${!isScreenOn ? 'screen-off' : ''}`}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1080 600"
        className="vu-meter-svg">
        <defs>
          <filter
            style={{ color: 'sRGB' }}
            id="filter6498">
            <feFlood
              floodOpacity="0.498039"
              floodColor="rgb(0,0,0)"
              result="flood" />
            <feComposite
              in="flood"
              in2="SourceGraphic"
              operator="out"
              result="composite1" />
            <feGaussianBlur
              in="composite1"
              stdDeviation="8"
              result="blur" />
            <feOffset
              dx="3"
              dy="3"
              result="offset" />
            <feComposite
              in="offset"
              in2="SourceGraphic"
              operator="atop"
              result="composite2" />
          </filter>
          <filter
            style={{ color: 'sRGB' }}
            id="filter6606">
            <feFlood
              floodOpacity="0.498039"
              floodColor="rgb(0,0,0)"
              result="flood" />
            <feComposite
              in="flood"
              in2="SourceGraphic"
              operator="in"
              result="composite1" />
            <feGaussianBlur
              in="composite1"
              stdDeviation="4"
              result="blur" />
            <feOffset
              dx="2.5"
              dy="2.5"
              result="offset" />
            <feComposite
              in="SourceGraphic"
              in2="offset"
              operator="over"
              result="composite2" />
          </filter>
        </defs>
        <g>
          <rect
            style={{ fill: '#ffeea9', fillOpacity: 1, stroke: '#ff0000', strokeWidth: 1, filter: 'url(#filter6498)' }}
            id="background"
            width="1077"
            height="633"
            x="0"
            y="0" />
          <path
            style={{ fill: '#000000', fillOpacity: 1, stroke: '#000000', strokeWidth: 1.50947702 }}
            d="m 537.18074,590.23438 a 150.76556,150.76556 0 0 0 -107.3086,45.05078 l 214.73829,0 A 150.76556,150.76556 0 0 0 537.18074,590.23438 Z" />
          <ellipse
            style={{ fill: '#ffffff', fillOpacity: 1, stroke: '#0000ff', strokeWidth: 0.61062336 }}
            id="drehpkt"
            cx="537.66882"
            cy="730.48907"
            rx="3.7858648"
            ry="3.5416155" />
          <g>
            <g id="plusminus">
              <path
                style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 5, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }}
                d="m 82,292 45.3061,0" />
              <path
                id="path6240"
                d="m 948.30743,285.82189 45.3061,0"
                style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 5, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
              <path
                style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 5, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }}
                d="m 970.96048,263.16884 0,45.3061" />
            </g>
            <path
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#ff0000', strokeWidth: 15, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }}
              d="m 657,277.24518 c 85.60879,8.87328 173.21481,25.29511 295.97922,75.9692" />
            <path
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 15, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }}
              d="m 126.01626,357.7731 c 161.49448,-60.14366 315.01211,-98.096 531.2366,-81.4418" />
            <path
              id="path6280"
              d="m 210.72277,271.30126 34.37058,47.77511"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              id="path6282"
              d="m 285.65064,249.6478 27.49646,52.24328"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              id="path6284"
              d="m 365.73409,233.49363 18.56011,52.93069"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              id="path6286"
              d="m 451.66054,221.12022 8.93635,53.96181"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              id="path6288"
              d="m 544.1174,217.33945 -0.68741,53.96181"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              id="path6290"
              d="m 620.76379,220.0891 -8.59264,53.2744"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              id="path6292"
              d="m 669.22631,226.96322 -14.43565,56.36775"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#ff0000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#000000', strokeWidth: 6.69999981, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: '430', strokeOpacity: 1, filter: 'url(#filter6606)' }}
              d="M 184.04706,291.70923 537.57412,730.481"
              id="zeiger"
              ref={zeigerRef} />
            <path
              id="path6294"
              d="m 777.83734,243.8048 -24.40311,48.80622"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#ff0000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <path
              id="path6296"
              d="m 864.4512,318.73266 34.37058,-43.65063"
              style={{ fill: 'none', fillRule: 'evenodd', stroke: '#ff0000', strokeWidth: 8, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }} />
            <text
              id="vu"
              y="393.86093"
              x="492.73926"
              style={{ fontStyle: 'normal', lineHeight: '125%', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan>VU</tspan>
            </text>
            <text
              id="text6725"
              y="255.49496"
              x="902.58594"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="255.49496"
                x="902.58594">5</tspan>
            </text>
            <text
              id="text6729"
              y="218.96762"
              x="775.54688"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="218.96762"
                x="775.54688">3</tspan>
            </text>
            <text
              id="text6733"
              y="202.96762"
              x="663.13672"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="202.96762"
                x="663.13672">0</tspan>
            </text>
            <text
              id="text6737"
              y="196.49496"
              x="612.89453"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="196.49496"
                x="612.89453">1</tspan>
            </text>
            <text
              id="text6741"
              y="194.96762"
              x="530.54688"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="194.96762"
                x="530.54688">3</tspan>
            </text>
            <text
              id="text6745"
              y="202.49496"
              x="439.58594"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="202.49496"
                x="439.58594">5</tspan>
            </text>
            <text
              id="text6749"
              y="210.49496"
              x="348.78125"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="210.49496"
                x="348.78125">7</tspan>
            </text>
            <text
              id="text6753"
              y="221.96762"
              x="251.89453"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="221.96762"
                x="251.89453">10</tspan>
            </text>
            <text
              id="text6757"
              y="243.96762"
              x="160.42969"
              style={{ fontStyle: 'normal', fontWeight: 'normal', fontSize: '40px', lineHeight: '125%', fontFamily: 'sans-serif', letterSpacing: '0px', wordSpacing: '0px', fill: '#000000', fillOpacity: 1, stroke: 'none', strokeWidth: 1, strokeLinecap: 'butt', strokeLinejoin: 'miter', strokeOpacity: 1 }}>
              <tspan
                y="243.96762"
                x="160.42969">20</tspan>
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default SVGVUMeter;
