import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypingAnimation } from '../../components/typing-text/typing-text';
import { useFirstVisit } from '../../hooks/useFirstVisit';

interface Section {
  name: string;
  route: string;
}

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const isFirstVisit = useFirstVisit('home');
  const [sections] = useState<Section[]>([
    { name: 'Experience & Projects', route: 'experience' },
    { name: 'Skills', route: 'skills' },
    { name: 'Learning & Certifications & Training', route: 'learning-training' },
    { name: 'Contact', route: 'contact' }
  ]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [introComplete, setIntroComplete] = useState<boolean>(false);

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
    <div className="home-container">
      <TypingAnimation 
        duration={40} 
        text='Hey, I am Mohammed Al-ghorbani, a obsessive software developer.'
        onComplete={() => setIntroComplete(true)}
        style={{ fontSize: 'clac(10px+1120px)' }}
        animate={isFirstVisit}
      />      
      <div style={{ marginTop: '5rem' }}>
        {sections.map((message:Section, index:number) => (
          <q
            key={index}
            onClick={() => handleSectionClick(message.route)}
            className="text-q text-q-content"
            style={{ 
              cursor: 'pointer', 
              fontSize: '1.5rem', 
              marginBottom: '1.6rem',
              display: 'block',
              opacity: index <= currentIndex ? 1 : 0
            }}
          >
            {index === currentIndex ? (
              <TypingAnimation 
                duration={20} 
                text={message.name} 
                onComplete={handleTypingComplete}
                style={{ fontSize: 'inherit' }}
                animate={isFirstVisit}
              />
            ) : index < currentIndex ? (
              message.name
            ) : null}
          </q>
        ))}
      </div>
    </div>
  );
}
