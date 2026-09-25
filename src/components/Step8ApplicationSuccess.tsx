import { motion } from 'framer-motion';
import { CheckCircle2, Home, FileSearch, HandCoins, MapPin } from 'lucide-react';
import type { SanctionedApp } from '../types/journey';
import { formatINR } from '../types/journey';

interface Step8ApplicationSuccessProps {
  sanction: SanctionedApp;
  onComplete: () => void;
}

export default function Step8ApplicationSuccess({ sanction, onComplete }: Step8ApplicationSuccessProps) {
  const vehicleName = `${sanction.vehicleData.make} ${sanction.vehicleData.model}`;
  // Generate a mock application number based on the refNumber
  const appNumber = `APP-${sanction.refNumber.replace('REF', '')}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', bounce: 0.25 }}
      className="space-y-6 max-w-2xl mx-auto py-8 font-sans"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Success hero */}
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0, rotate: -15 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', bounce: 0.5, delay: 0.1 }}
          className="w-16 h-16 rounded-full border-4 border-green-500/30 bg-green-500/10 flex items-center justify-center mx-auto mb-5"
        >
          <CheckCircle2 size={32} className="text-green-500" />
        </motion.div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight"
        >
          Application Submitted!
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-theme-secondary text-sm mt-2"
        >
          Your vehicle loan application for <span className="text-theme-primary font-bold">{vehicleName}</span> has been successfully submitted for processing.
        </motion.p>
      </div>

      {/* Application Number Card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="rounded-lg border border-theme-border bg-theme-elevated p-6 flex flex-col items-center justify-center text-center"
      >
        <p className="text-[10px] font-bold text-theme-secondary font-mono uppercase tracking-widest mb-2">
          Application Number
        </p>
        <div className="text-3xl sm:text-4xl font-bold font-mono text-theme-primary tracking-wider">
          {appNumber}
        </div>
        <p className="text-xs text-theme-muted mt-3">
          Please save this number for future tracking. We've also sent this to your registered email and mobile number.
        </p>
      </motion.div>

      {/* What happens next? */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="rounded-lg border border-theme-border bg-theme-card overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-theme-border bg-theme-elevated">
          <span className="text-[11px] font-bold text-theme-primary uppercase tracking-widest">
            Further Process (Next Steps)
          </span>
        </div>
        <div className="p-5 space-y-6">
          <div className="flex gap-4">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <FileSearch size={14} className="text-blue-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-primary">1. Document Verification</h4>
              <p className="text-xs text-theme-secondary mt-1 leading-relaxed">
                Our operations team is verifying your uploaded documents (PAN, Address Proof, Bank Statements, etc.). This usually takes 2-4 hours.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <MapPin size={14} className="text-amber-500" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-primary">2. Field Investigation (If applicable)</h4>
              <p className="text-xs text-theme-secondary mt-1 leading-relaxed">
                An executive might visit your registered residential/office address to complete physical verification as per RBI compliance.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="mt-0.5 w-8 h-8 rounded-full bg-theme-accent/10 flex items-center justify-center flex-shrink-0">
              <HandCoins size={14} className="text-theme-accent" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-primary">3. Final Disbursal</h4>
              <p className="text-xs text-theme-secondary mt-1 leading-relaxed">
                Once all checks are passed, the loan amount of <strong className="text-theme-primary font-mono">{formatINR(sanction.loanAmount)}</strong> will be disbursed directly to the dealer's or seller's account.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Return to Dashboard */}
      <motion.button
        onClick={onComplete}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
        className="w-full py-4 rounded bg-theme-primary hover:bg-white text-theme-bg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors mt-4"
      >
        <Home size={14} />
        Return to Dashboard
      </motion.button>
    </motion.div>
  );
}
