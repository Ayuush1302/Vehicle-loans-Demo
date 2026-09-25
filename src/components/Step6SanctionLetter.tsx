import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Download, FileText, Smartphone, CreditCard, ArrowLeft } from 'lucide-react';
import type { SanctionedApp } from '../types/journey';
import { formatINR } from '../types/journey';

interface Step6SanctionLetterProps {
  sanction: SanctionedApp;
  onComplete: () => void;
  onBack: () => void;
}

export default function Step6SanctionLetter({ sanction, onComplete, onBack }: Step6SanctionLetterProps) {
  const [kfsExpanded, setKfsExpanded] = useState(false);
  const [kfsRead, setKfsRead] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [eSigned, setESigned] = useState(false);
  const [eNachSetup, setENachSetup] = useState(false);

  // Math
  const interestRate = sanction.condition === 'new' ? 10.5 : 14.5; // fallback
  const apr = (interestRate + 0.18).toFixed(2);
  const pf = Math.round(sanction.loanAmount * 0.015);
  const gst = Math.round(pf * 0.18);
  const totalInterest = Math.round((sanction.emi * sanction.tenureMonths) - sanction.loanAmount);
  const totalAmountPayable = sanction.loanAmount + totalInterest + pf + gst;

  // Dates
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);
  const firstEmiDate = new Date();
  firstEmiDate.setMonth(firstEmiDate.getMonth() + 1);

  const formatDate = (d: Date) => d.toLocaleDateString('en-IN', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // Amortisation Row 1
  const openingBal = sanction.loanAmount;
  const interestPortion = Math.round(openingBal * (interestRate / 100 / 12));
  const principalPortion = sanction.emi - interestPortion;
  const closingBal = openingBal - principalPortion;

  const handleToggleKFS = () => {
    setKfsExpanded(!kfsExpanded);
    if (!kfsExpanded && !kfsRead) {
      // Simulate user reading it after opening
      setTimeout(() => setKfsRead(true), 1500);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl mx-auto py-8 font-sans"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight">
          Offer & Key Fact Statement
        </h2>
        <p className="text-theme-secondary text-sm mt-2">
          Review your final loan terms and complete the agreement.
        </p>
      </div>

      {/* Offer Card */}
      <div className="rounded-xl border border-theme-border bg-theme-card overflow-hidden">
        <div className="bg-[#eff6ff] dark:bg-blue-950/20 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-theme-border">
          <div>
            <h3 className="text-lg font-bold text-[#1e3a8a] dark:text-blue-400">Your Approved Offer</h3>
            <p className="text-sm text-[#3b82f6] dark:text-blue-500 mt-0.5">Valid until {formatDate(validUntil)}</p>
          </div>
          <div className="bg-theme-bg border border-theme-border rounded-lg px-4 py-2 flex flex-col items-center">
            <span className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest font-mono">Monthly EMI</span>
            <span className="text-xl font-bold text-[#16a34a] font-mono mt-0.5">{formatINR(sanction.emi)}</span>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="grid grid-cols-2 gap-y-6 gap-x-4 mb-6 pb-6 border-b border-theme-border">
            <div>
              <p className="text-sm text-theme-secondary">Loan Amount</p>
              <p className="text-lg font-bold text-theme-primary font-mono mt-1">{formatINR(sanction.loanAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-theme-secondary">Tenure</p>
              <p className="text-lg font-bold text-theme-primary font-mono mt-1">{sanction.tenureMonths} Months</p>
            </div>
            <div>
              <p className="text-sm text-theme-secondary">Interest Rate</p>
              <p className="text-lg font-bold text-theme-primary font-mono mt-1">{interestRate.toFixed(2)}% p.a.</p>
              <p className="text-xs text-theme-muted mt-1">Fixed Rate</p>
            </div>
            <div>
              <p className="text-sm text-theme-secondary">Annual Percentage Rate (APR)</p>
              <p className="text-lg font-bold text-theme-primary font-mono mt-1">{apr}%</p>
              <p className="text-xs text-theme-muted mt-1">Inclusive of all fees</p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-theme-secondary">Processing Fee</span>
              <span className="font-bold font-mono text-theme-primary">{formatINR(pf)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-theme-secondary">GST on PF (18%)</span>
              <span className="font-bold font-mono text-theme-primary">{formatINR(gst)}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-theme-secondary">Total Interest Payable</span>
              <span className="font-bold font-mono text-theme-primary">{formatINR(totalInterest)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-theme-border mt-3">
              <span className="font-bold text-theme-primary">Total Amount Payable (over {sanction.tenureMonths} months)</span>
              <span className="font-bold font-mono text-theme-primary text-base">{formatINR(totalAmountPayable)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KFS Accordion */}
      <div className="rounded-xl border border-theme-border bg-theme-card overflow-hidden">
        <button
          onClick={handleToggleKFS}
          className="w-full p-5 flex items-start sm:items-center justify-between gap-4 text-left hover:bg-theme-elevated transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-[#eff6ff] dark:bg-blue-950/30 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-[#3b82f6]" />
            </div>
            <div>
              <h4 className="font-bold text-theme-primary text-base">Key Fact Statement (KFS)</h4>
              <p className="text-sm text-theme-secondary mt-0.5">Read and download the regulatory summary.</p>
            </div>
          </div>
          <div className="text-theme-secondary">
            {kfsExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
        </button>

        <AnimatePresence>
          {kfsExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden border-t border-theme-border"
            >
              <div className="p-5 sm:p-6 bg-theme-bg space-y-6 border border-theme-border m-4 rounded-xl">
                <div className="space-y-4 text-sm text-theme-primary leading-relaxed">
                  <p>
                    <strong>1. Loan Type:</strong> {sanction.condition === 'used' ? 'Used' : 'New'} Vehicle Loan ({sanction.vehicleType})
                  </p>
                  <p>
                    <strong>2. Cooling-off Period:</strong> 3 days from the date of disbursal. During this period, you may exit the loan by repaying the principal and proportionate interest without any pre-payment penalty.
                  </p>
                  <p>
                    <strong>3. Penal Charges:</strong> ₹500 per instance of EMI bounce. Penal charges are strictly flat and are not compounded.
                  </p>
                  <p>
                    <strong>4. Foreclosure Charges:</strong> Nil. As per RBI guidelines for floating/fixed individual vehicle loans, no pre-payment penalties apply.
                  </p>
                </div>

                <div className="pt-4 border-t border-theme-border">
                  <h5 className="font-bold text-theme-primary mb-3 text-sm">Amortisation Schedule (Summary)</h5>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead>
                        <tr className="text-theme-secondary border-b border-theme-border">
                          <th className="pb-2 font-medium">Month</th>
                          <th className="pb-2 font-medium">Opening Bal</th>
                          <th className="pb-2 font-medium">EMI</th>
                          <th className="pb-2 font-medium">Interest</th>
                          <th className="pb-2 font-medium">Principal</th>
                          <th className="pb-2 font-medium">Closing Bal</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-theme-primary">
                        <tr>
                          <td className="py-3">1</td>
                          <td className="py-3">{formatINR(openingBal)}</td>
                          <td className="py-3">{formatINR(sanction.emi)}</td>
                          <td className="py-3">{formatINR(interestPortion)}</td>
                          <td className="py-3">{formatINR(principalPortion)}</td>
                          <td className="py-3">{formatINR(closingBal)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-center text-xs text-theme-muted italic mt-3">
                    ... schedule continues for {sanction.tenureMonths} months ...
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 pt-4 border-t border-theme-border">
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-theme-border rounded-lg text-theme-accent font-bold text-sm hover:bg-theme-accent/10 transition-colors">
                    <Download size={16} />
                    Sanction Letter
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 border border-theme-border rounded-lg text-theme-accent font-bold text-sm hover:bg-theme-accent/10 transition-colors">
                    <Download size={16} />
                    Key Fact Statement
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Checkbox */}
      <div className="pt-2 pb-2">
        <label className={`flex items-start gap-3 cursor-pointer ${!kfsRead ? 'opacity-70 pointer-events-none' : ''}`}>
          <div className="pt-0.5">
            <input
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              disabled={!kfsRead}
              className="w-5 h-5 rounded border-theme-border text-theme-accent focus:ring-theme-accent/20 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
          <div>
            <p className="text-base text-theme-primary">
              I have read the Key Fact Statement and accept the loan terms.
            </p>
            {!kfsRead && (
              <p className="text-sm text-theme-accent/70 mt-1">
                Please expand and read the KFS above to enable.
              </p>
            )}
          </div>
        </label>
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        {/* e-Sign */}
        <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          termsAccepted ? 'border-theme-border bg-theme-card' : 'border-theme-border/50 bg-theme-bg opacity-60'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-theme-elevated flex items-center justify-center flex-shrink-0">
              <Smartphone size={18} className="text-theme-secondary" />
            </div>
            <div>
              <h4 className="font-bold text-theme-primary text-base">E-Sign Loan Agreement</h4>
              <p className="text-sm text-theme-secondary mt-0.5">Sign digitally using Aadhaar OTP</p>
            </div>
          </div>
          <button
            disabled={!termsAccepted || eSigned}
            onClick={() => {
              setESigned(true);
              setTimeout(() => setENachSetup(true), 1500); // Demo simulation
            }}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${
              eSigned
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : termsAccepted
                ? 'bg-[#8fb89c] hover:bg-[#7fa58c] text-white'
                : 'bg-theme-elevated text-theme-muted cursor-not-allowed'
            }`}
          >
            {eSigned ? 'Signed' : 'Sign Now'}
          </button>
        </div>

        {/* e-NACH */}
        <div className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
          eSigned ? 'border-theme-border bg-theme-card' : 'border-theme-border/50 bg-theme-bg opacity-60'
        }`}>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-theme-elevated flex items-center justify-center flex-shrink-0">
              <CreditCard size={18} className="text-theme-secondary" />
            </div>
            <div>
              <h4 className="font-bold text-theme-primary text-base">Setup Auto-Debit (e-NACH)</h4>
              <p className="text-sm text-theme-secondary mt-0.5">First EMI: {formatDate(firstEmiDate)}</p>
            </div>
          </div>
          <button
            disabled={!eSigned || eNachSetup}
            onClick={() => {
              setENachSetup(true);
              setTimeout(() => onComplete(), 1000);
            }}
            className={`px-6 py-2.5 rounded-lg font-bold text-sm whitespace-nowrap transition-colors ${
              eNachSetup
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : eSigned
                ? 'bg-[#8fb89c] hover:bg-[#7fa58c] text-white'
                : 'bg-theme-elevated text-theme-muted cursor-not-allowed'
            }`}
          >
            {eNachSetup ? 'Setup Complete' : 'Setup Now'}
          </button>
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
      </div>
    </motion.div>
  );
}
