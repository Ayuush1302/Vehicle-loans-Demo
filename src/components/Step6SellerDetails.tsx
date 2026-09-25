import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Building, User } from 'lucide-react';
import type { SanctionedApp } from '../types/journey';
import { formatINR } from '../types/journey';

interface Step6SellerDetailsProps {
  sanction: SanctionedApp;
  onBack: () => void;
  onComplete: () => void;
}

export default function Step6SellerDetails({ sanction, onBack, onComplete }: Step6SellerDetailsProps) {
  const [accountType, setAccountType] = useState<'individual' | 'dealer'>(
    sanction.condition === 'new' ? 'dealer' : 'individual'
  );
  
  const [sellerName, setSellerName] = useState('');
  const [accNo, setAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');

  const isComplete = sellerName.trim() !== '' && accNo.trim() !== '' && ifsc.trim() !== '';

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="space-y-7 max-w-2xl mx-auto py-8 font-sans"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest px-2 py-1 border border-theme-border rounded bg-theme-elevated">
            STEP 6
          </span>
          <span className="text-[10px] font-bold font-mono text-theme-accent uppercase tracking-widest px-2 py-1 border border-theme-accent/30 rounded bg-theme-accent/10">
            DISBURSAL DETAILS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight">
          Seller's Bank Details
        </h2>
        <p className="text-theme-secondary text-sm mt-2 leading-relaxed">
          Please provide the bank details of the seller (or dealership) where the final loan amount will be disbursed.
        </p>
      </div>

      {/* Seller Details Form */}
      <div className="space-y-6">
        <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-theme-border bg-theme-elevated">
            <Building size={14} className="text-theme-primary" />
            <span className="text-[11px] font-bold text-theme-primary uppercase tracking-widest">
              Seller Bank Account (For Disbursal)
            </span>
          </div>

          <div className="p-5 space-y-5">
            {/* Account Type Toggle */}
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-3 font-mono">
                Seller Type
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setAccountType('dealer')}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    accountType === 'dealer'
                      ? 'bg-theme-accent/10 border-theme-accent text-theme-accent'
                      : 'bg-theme-elevated border-theme-border text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  <Building size={16} />
                  Dealership
                </button>
                <button
                  onClick={() => setAccountType('individual')}
                  className={`flex-1 py-3 px-4 rounded-lg border text-sm font-bold flex items-center justify-center gap-2 transition-colors ${
                    accountType === 'individual'
                      ? 'bg-theme-accent/10 border-theme-accent text-theme-accent'
                      : 'bg-theme-elevated border-theme-border text-theme-secondary hover:text-theme-primary'
                  }`}
                >
                  <User size={16} />
                  Individual
                </button>
              </div>
            </div>

            {/* Inputs */}
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">
                {accountType === 'dealer' ? 'Dealership Name' : 'Seller Full Name'}
              </label>
              <input
                type="text"
                value={sellerName}
                onChange={e => setSellerName(e.target.value)}
                placeholder={accountType === 'dealer' ? 'e.g. Acme Motors Pvt Ltd' : 'e.g. Rahul Sharma'}
                className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-sm px-4 py-3 rounded focus:outline-none focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">
                Bank Account Number
              </label>
              <input
                type="text"
                value={accNo}
                onChange={e => setAccNo(e.target.value)}
                placeholder="Account No"
                className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-sm px-4 py-3 rounded focus:outline-none focus:border-theme-primary"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">
                IFSC Code
              </label>
              <input
                type="text"
                value={ifsc}
                onChange={e => setIfsc(e.target.value.toUpperCase())}
                placeholder="IFSC Code"
                className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-sm px-4 py-3 rounded focus:outline-none focus:border-theme-primary uppercase"
              />
            </div>
            
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mt-2">
              <p className="text-[10px] font-mono text-blue-500">
                Note: The final loan amount of {formatINR(sanction.loanAmount)} will be disbursed to this account. Please ensure the details are correct.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-6 border-t border-theme-border mt-8">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded border border-theme-border bg-theme-elevated hover:bg-theme-card text-theme-primary font-bold text-xs uppercase tracking-widest transition-colors flex-shrink-0"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <motion.button
          onClick={onComplete}
          disabled={!isComplete}
          whileHover={isComplete ? { scale: 1.01 } : {}}
          whileTap={isComplete ? { scale: 0.99 } : {}}
          className={`flex-1 py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors duration-300 ${
            isComplete
              ? 'bg-theme-accent hover:bg-[#256639] text-theme-primary'
              : 'bg-theme-elevated border border-theme-border text-theme-muted cursor-not-allowed'
          }`}
        >
          Confirm & Proceed
          {isComplete && <ArrowRight size={14} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
