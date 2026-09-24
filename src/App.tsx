import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import OnboardingGate from './components/OnboardingGate';
import BorrowerHome from './components/BorrowerHome';
import VehicleJourney from './components/VehicleJourney';
import ThemeToggle from './components/ThemeToggle';
import type { SanctionedApp } from './types/journey';
import './index.css';

type Screen = 'gate' | 'home' | 'journey';

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('gate');
  const [user, setUser] = useState<{ name: string; pan: string } | null>(null);
  const [sanctionedApps, setSanctionedApps] = useState<SanctionedApp[]>([]);

  const handleAuthSuccess = (u: { name: string; pan: string }) => {
    setUser(u);
    setScreen('home');
  };

  const handleLogout = () => {
    setUser(null);
    setScreen('gate');
  };

  const handleSanctioned = (app: SanctionedApp) => {
    setSanctionedApps(prev => [app, ...prev]);
  };

  return (
    <>
    <AnimatePresence mode="wait">
      {screen === 'gate' && (
        <motion.div
          key="gate"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35 }}
        >
          <OnboardingGate onSuccess={handleAuthSuccess} />
        </motion.div>
      )}

      {screen === 'home' && user && (
        <motion.div
          key="home"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35 }}
        >
          <BorrowerHome
            user={user}
            onStartJourney={() => setScreen('journey')}
            onLogout={handleLogout}
            sanctionedApps={sanctionedApps}
          />
        </motion.div>
      )}

      {screen === 'journey' && user && (
        <motion.div
          key="journey"
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.35 }}
        >
          <VehicleJourney
            onBack={() => setScreen('home')}
            onSanctioned={handleSanctioned}
            userName={user.name}
          />
        </motion.div>
      )}
    </AnimatePresence>
    <ThemeToggle />
    </>
  );
}
