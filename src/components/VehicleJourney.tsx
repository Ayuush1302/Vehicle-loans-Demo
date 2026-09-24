import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProgressStepper from './ProgressStepper';
import Step1AssetCategory from './Step1AssetCategory';
import Step2VehicleDetails from './Step2VehicleDetails';
import Step3Valuation from './Step3Valuation';
import Step4Sanction from './Step4LoanSetup';
import type { VehicleType, Condition, VehicleData, ValuationResult, SanctionedApp } from '../types/journey';

interface VehicleJourneyProps {
  onBack: () => void;
  onSanctioned: (app: SanctionedApp) => void;
  userName: string;
}

function getSlideVariants(direction: 'forward' | 'back') {
  return {
    initial: { opacity: 0, x: direction === 'forward' ? 24 : -24 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: direction === 'forward' ? -24 : 24 },
  };
}

export default function VehicleJourney({ onBack, onSanctioned, userName }: VehicleJourneyProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');

  // Shared state threaded through all steps
  const [vehicleType, setVehicleType] = useState<VehicleType>('4W');
  const [condition, setCondition] = useState<Condition>('new');
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);
  const [valuation, setValuation] = useState<ValuationResult | null>(null);

  const navigateTo = (step: number) => {
    setDirection(step > currentStep ? 'forward' : 'back');
    setCurrentStep(step);
  };

  const handleStep1Continue = (vt: VehicleType, cond: Condition) => {
    setVehicleType(vt);
    setCondition(cond);
    // Reset downstream data when vehicle config changes
    setVehicleData(null);
    setValuation(null);
    navigateTo(2);
  };

  const handleStep2Proceed = (data: VehicleData) => {
    setVehicleData(data);
    setValuation(null); // reset valuation if vehicle changes
    navigateTo(3);
  };

  const handleStep3Proceed = (result: ValuationResult) => {
    setValuation(result);
    navigateTo(4);
  };

  const handleStep4Complete = (app: SanctionedApp) => {
    onSanctioned(app);
    onBack(); // return to dashboard
  };

  const variants = getSlideVariants(direction);

  return (
    <div className="min-h-screen bg-theme-bg flex flex-col font-sans" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* Sticky progress stepper */}
      <ProgressStepper currentStep={currentStep} onExit={onBack} />

      {/* Step content */}
      <div className="relative z-10 flex-1">
        <div className="w-full px-4 sm:px-6 py-4 sm:py-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step1"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Step1AssetCategory
                  onContinue={handleStep1Continue}
                  initialVehicleType={vehicleType}
                  initialCondition={condition}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="step2"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Step2VehicleDetails
                  vehicleType={vehicleType}
                  condition={condition}
                  onBack={() => navigateTo(1)}
                  onProceed={handleStep2Proceed}
                />
              </motion.div>
            )}

            {currentStep === 3 && vehicleData && (
              <motion.div
                key="step3"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Step3Valuation
                  vehicleType={vehicleType}
                  condition={condition}
                  vehicleData={vehicleData}
                  onBack={() => navigateTo(2)}
                  onProceed={handleStep3Proceed}
                />
              </motion.div>
            )}

            {currentStep === 4 && valuation && (
              <motion.div
                key="step4"
                variants={variants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3, ease: 'easeInOut' }}
              >
                <Step4Sanction
                  valuation={valuation}
                  userName={userName}
                  onComplete={handleStep4Complete}
                  onBack={() => navigateTo(3)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 border-t border-theme-border py-4">
        <p className="text-center text-[10px] font-mono text-theme-muted">
          © 2024 Crux Auto Finance Pvt. Ltd. · NBFC · RBI Reg. No. N-13.02318 (Demo)
        </p>
      </div>
    </div>
  );
}
