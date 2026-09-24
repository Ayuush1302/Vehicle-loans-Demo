import { motion } from 'framer-motion';
import { personas } from '../data/vehicleData';

interface PersonaBarProps {
  onSelect: (persona: typeof personas[number]) => void;
  activePersonaId: string | null;
}

export default function PersonaBar({ onSelect, activePersonaId }: PersonaBarProps) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider mr-1">Quick Preview</span>
      {personas.map((persona) => {
        const isActive = activePersonaId === persona.id;
        return (
          <motion.button
            key={persona.id}
            onClick={() => onSelect(persona)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className={`relative px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${
              isActive
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50'
                : 'bg-slate-800/70 border-slate-700/60 text-slate-300 hover:border-indigo-500/50 hover:text-white hover:bg-slate-700/70'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="personaActive"
                className="absolute inset-0 rounded-full bg-indigo-600"
                style={{ zIndex: -1 }}
                transition={{ type: 'spring', bounce: 0.25, duration: 0.4 }}
              />
            )}
            {persona.label}
          </motion.button>
        );
      })}
    </div>
  );
}
