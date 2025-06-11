import { Route, Routes } from 'react-router-dom';
import { TvContainer } from './components/tv-container/tv-container';
import './global.css';
import { Contact } from './screens/contact/contact';
import { Experience } from './screens/experience/experience';
import { Home } from './screens/home/home';
import { LearningTraining } from './screens/learning-training/learning-training';
import { Skills } from './screens/skills/skills';
import { useKeyboardSound } from './hooks/useKeyboardSound';
import { ScreenProvider } from './context/ScreenContext';
import { ScreenSizeProvider } from './context/ScreenSizeContext';

function AppContent() {
  return (
    <div className="App">
      <TvContainer>
        {/* <button className="back-button" onClick={() => window.history.back()}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 18L9 12L15 6M9 12H20" stroke="var(--dark-green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button> */}
        <section>
          <Routes>

            <Route path="/" element={<Home />} />
            <Route path="/experience-projects" element={<Experience />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/learning-training-certifications" element={<LearningTraining />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </section>
      </TvContainer>
    </div>
  );
}

function App() {
  // Initialize keyboard sound effect
  useKeyboardSound({
    enabled: true,
    volume: 0.3, // Adjust volume as needed
    excludeKeys: ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab']
  });

  return (
    <ScreenSizeProvider>
      <ScreenProvider>
        <AppContent />
      </ScreenProvider>
    </ScreenSizeProvider>
  );
}

export default App;
