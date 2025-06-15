import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypingAnimation } from '../../components/typing-text/typing-text';
import { useScreen } from '../../context/ScreenContext';

interface Section {
  name: string;
  route: string;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [sections] = useState<Section[]>([
    { name: 'Experience & Projects', route: 'experience-projects' },
    { name: 'Skills', route: 'skills' },
    { name: 'Learning & Certifications & Training', route: 'learning-training' },
    { name: 'Contact', route: 'contact' }
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [introComplete, setIntroComplete] = useState<boolean>(false);
  const { isScreenOn } = useScreen();

  useEffect(() => {
    if (introComplete) {
      setCurrentIndex(0);
    }
  }, [introComplete]);

  const handleSectionClick = (route: string) => {
    navigate(`/${route}`);
  };

  const handleTypingComplete = () => {
    if (currentIndex < sections.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  return (
    <>
      {isScreenOn && <div style={{ marginTop: '2rem' }} className="home-container">
        <TypingAnimation
          duration={25}
          text='Hey, I am Mohammed Al-ghorbani, a obsessive software developer.'
          onComplete={() => setIntroComplete(true)}
          style={{ fontSize: 'min(1.75rem,6vw)' }}
        />
        <div style={{ marginTop: '5rem' }}>
          {sections.map((message: Section, index: number) => (
            <q
              key={index}
              onClick={() => handleSectionClick(message.route)}
              className="text-q text-q-content"
              style={{
                cursor: 'pointer',
                fontSize: 'min(1.5rem,5vw)',
                marginBottom: '1.6rem',
                display: 'block',
                opacity: index <= currentIndex ? 1 : 0
              }}
            >
              {index === currentIndex ? (
                <TypingAnimation
                  duration={15}
                  text={message.name}
                  onComplete={handleTypingComplete}
                  style={{ fontSize: 'inherit' }}
                />
              ) : index < currentIndex ? (
                message.name
              ) : null}
            </q>
          ))}
        </div>
      </div>}
    </>
  );
}
