import React, { useRef } from 'react'
import './tv-container.css'
import frame from '../../assets/frame.svg'
import { AudioPlayer } from '../audio-player/audio-player'
import buttonClickSound from '../../assets/button_click.mp3';
import loginSound from '../../assets/login.wav';
import { useScreen } from '../../context/ScreenContext';

interface Props {
    children: React.ReactNode
}
export const TvContainer: React.FC<Props> = ({ children }) => {
    const { isScreenOn, toggleScreen } = useScreen();
    const buttonSoundRef = useRef(new Audio(buttonClickSound));
    const loginSoundRef = useRef(new Audio(loginSound));
    const togglePower = async () => {
        isScreenOn ? await buttonSoundRef.current.play() : await loginSoundRef.current.play();
        toggleScreen();
    };

    return (
        <div className='pc-container'>    
            <div className='pc-container-right'>
                <div className='pc-container-right-effects' />
                <div className='pc-container-right-content'>
                    <div  className={`pc-container-right-content-children ${!isScreenOn ? 'screen-off' : ''}`}>
                        {children}
                    </div>
                    <img src={frame} alt="frame" />
                </div>
            </div>
            <div className='pc-container-left'>
                <AudioPlayer>
                    <button
                        className="button-14"
                        role="button"
                        onClick={togglePower}
                    >
                        <div className="button-14-top text">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M13 3h-2v10h2V3zm4.83 2.17l-1.42 1.42C17.99 7.86 19 9.81 19 12c0 3.87-3.13 7-7 7s-7-3.13-7-7c0-2.19 1.01-4.14 2.58-5.42L6.17 5.17C4.23 6.82 3 9.26 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-2.74-1.23-5.18-3.17-6.83z" />
                            </svg>
                        </div>
                        <div className="button-14-bottom"></div>
                        <div className="button-14-base"></div>
                    </button>
                </AudioPlayer>
            </div>
        </div>
    )
}
