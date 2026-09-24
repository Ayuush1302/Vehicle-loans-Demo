import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export const JOURNEY_STEPS = [
  { id: 1, label: 'Asset Category', short: 'Category' },
  { id: 2, label: 'Vehicle Details', short: 'Details' },
  { id: 3, label: 'Valuation & Terms', short: 'Valuation' },
  { id: 4, label: 'Sanction & Docs', short: 'Sanction' },
];

interface ProgressStepperProps {
  currentStep: number;
  onExit: () => void;
}

export default function ProgressStepper({ currentStep, onExit }: ProgressStepperProps) {
  return (
    <div className="sticky top-0 z-40 border-b border-theme-border bg-theme-bg/90 backdrop-blur-xl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Top row */}
        <div className="flex items-center justify-between h-16 gap-4">
          <motion.button
            id="exit-journey-btn"
            onClick={onExit}
            whileHover={{ x: -2 }}
            className="flex items-center gap-2 text-xs font-bold text-theme-secondary hover:text-theme-primary transition-colors uppercase tracking-widest"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            <span className="hidden sm:inline">Dashboard</span>
            <span className="sm:hidden">Exit</span>
          </motion.button>

          {/* Steps — desktop */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            {JOURNEY_STEPS.map((step, idx) => {
              const isDone = step.id < currentStep;
              const isActive = step.id === currentStep;

              return (
                <div key={step.id} className="flex items-center">
                  {/* Connector line before */}
                  {idx > 0 && (
                    <div className="relative w-16 h-px mx-1.5">
                      <div className="absolute inset-0 bg-theme-border" />
                      <motion.div
                        className="absolute inset-y-0 left-0 bg-theme-accent"
                        initial={false}
                        animate={{ width: isDone ? '100%' : isActive ? '50%' : '0%' }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                      />
                    </div>
                  )}

                  {/* Step node */}
                  <div className="flex flex-col items-center gap-2">
                    <motion.div
                      initial={false}
                      animate={{
                        backgroundColor: isDone ? 'var(--color-theme-accent)' : 'var(--color-theme-bg)',
                        borderColor: isDone ? 'var(--color-theme-accent)' : isActive ? 'var(--color-theme-primary)' : 'var(--color-theme-border)',
                      }}
                      transition={{ duration: 0.35 }}
                      className="w-6 h-6 rounded border flex items-center justify-center flex-shrink-0 transition-colors"
                    >
                      {isDone ? (
                        <Check size={12} className="text-theme-primary" strokeWidth={3} />
                      ) : (
                        <span className={`text-[10px] font-bold font-mono ${isActive ? 'text-theme-primary' : 'text-theme-muted'}`}>
                          0{step.id}
                        </span>
                      )}
                    </motion.div>

                    <span className={`text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-colors duration-300 ${
                      isActive ? 'text-theme-primary' : isDone ? 'text-theme-accent' : 'text-theme-muted'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Mobile step indicator */}
          <div className="md:hidden flex items-center gap-2 font-mono">
            <span className="text-xs font-bold text-theme-primary">
              STEP 0{currentStep}
            </span>
            <span className="text-xs text-theme-muted">/</span>
            <span className="text-xs text-theme-secondary font-bold">
              0{JOURNEY_STEPS.length}
            </span>
          </div>
        </div>

        {/* Mobile progress bar */}
        <div className="md:hidden pb-3">
          <div className="flex gap-1">
            {JOURNEY_STEPS.map((step) => (
              <div key={step.id} className="flex-1 h-1 rounded-sm bg-theme-elevated border border-theme-border overflow-hidden">
                <motion.div
                  className="h-full bg-theme-accent"
                  initial={false}
                  animate={{ width: step.id < currentStep ? '100%' : step.id === currentStep ? '60%' : '0%' }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
