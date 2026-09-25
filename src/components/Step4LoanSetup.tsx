import { useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Sparkles,
  DollarSign, Calendar, TrendingDown, Percent
} from 'lucide-react';
import type { ValuationResult, SanctionedApp } from '../types/journey';
import { formatINR, calcEMI, genRefNumber } from '../types/journey';

interface Step4SanctionProps {
  valuation: ValuationResult;
  userName: string;
  onComplete: (app: SanctionedApp) => void;
  onBack: () => void;
}

const MIN_LOAN = 50000;
const STAMP_DUTY_RATE = 0.002; // 0.2% of loan amount
const PROCESSING_FEE_RATE = 0.015; // 1.5%

// ── Animated number counter ────────────────────────────────────
function AnimatedNumber({ value, prefix = '', suffix = '', decimals = 0 }: {
  value: number; prefix?: string; suffix?: string; decimals?: number;
}) {
  const motionVal = useMotionValue(value);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const controls = animate(motionVal, value, {
      duration: 0.45,
      ease: 'easeOut',
      onUpdate: (v) => setDisplay(v),
    });
    return controls.stop;
  }, [value, motionVal]);

  const formatted = decimals > 0
    ? display.toFixed(decimals)
    : Math.round(display).toLocaleString('en-IN');

  return <>{prefix}{formatted}{suffix}</>;
}

// ── Range Slider ───────────────────────────────────────────────
function RangeSlider({
  id, label, min, max, value, onChange, formatFn, step = 1
}: {
  id: string; label: string; min: number; max: number; value: number;
  onChange: (v: number) => void; formatFn: (v: number) => string;
  step?: number;
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label htmlFor={id} className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest font-mono">{label}</label>
        <span className="text-sm font-bold font-mono text-theme-primary">
          {formatFn(value)}
        </span>
      </div>
      <div className="relative h-5 flex items-center">
        {/* Track */}
        <div className="absolute left-0 right-0 h-1.5 rounded-full bg-theme-elevated border border-theme-border" />
        {/* Fill */}
        <div
          className="absolute left-0 h-1.5 rounded-full transition-all duration-100 bg-theme-accent"
          style={{ width: `${pct}%` }}
        />
        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={e => onChange(Number(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
          style={{ zIndex: 2 }}
        />
        {/* Thumb */}
        <div
          className="absolute w-5 h-5 rounded-full border-2 border-theme-primary shadow-sm pointer-events-none transition-all duration-100 bg-theme-bg"
          style={{ left: `calc(${pct}% - 10px)`, zIndex: 1 }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[9px] text-theme-muted font-mono">{formatFn(min)}</span>
        <span className="text-[9px] text-theme-muted font-mono">{formatFn(max)}</span>
      </div>
    </div>
  );
}



// ── Main Component ─────────────────────────────────────────────
export default function Step4Sanction({ valuation, userName: _userName, onComplete, onBack }: Step4SanctionProps) {
  const { maxLoanAmount, maxTenureMonths, interestRate, condition, vehicleType, vehicleData } = valuation;

  const actualMinLoan = Math.min(MIN_LOAN, maxLoanAmount);
  const actualMinTenure = Math.min(6, maxTenureMonths);

  const [loanAmount, setLoanAmount] = useState(maxLoanAmount);
  const [tenure, setTenure] = useState(maxTenureMonths);


  const emi = calcEMI(loanAmount, interestRate, tenure);
  const downPayment = valuation.baseValue - loanAmount;
  const processingFee = Math.round(loanAmount * PROCESSING_FEE_RATE);
  const stampDuty = Math.round(loanAmount * STAMP_DUTY_RATE);
  const totalInterest = Math.round(emi * tenure - loanAmount);
  const ltvPct = Math.round((loanAmount / valuation.baseValue) * 100);

  const handleAccept = () => {
    const app: SanctionedApp = {
      refNumber: genRefNumber(),
      loanAmount,
      tenureMonths: tenure,
      emi: Math.round(emi),
      vehicleData,
      vehicleType,
      condition,
      sanctionDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
    };
    onComplete(app);
  };

  const vehicleName = `${vehicleData.make} ${vehicleData.model}`;
  const typeLabel = vehicleType === '2W' ? 'Two-Wheeler' : 'Four-Wheeler';



  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="space-y-7 max-w-4xl mx-auto py-8 font-sans"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest px-2 py-1 border border-theme-border rounded bg-theme-elevated">
            {typeLabel} {vehicleName}
          </span>
          <span className="text-[10px] font-bold font-mono text-theme-accent uppercase tracking-widest px-2 py-1 border border-theme-accent/30 rounded bg-theme-accent/10">
            ✓ OFFER READY
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight">
          Customise Your Loan Offer
        </h2>
        <p className="text-theme-secondary text-sm mt-2 leading-relaxed">
          Adjust the loan amount and tenure. Your EMI and fees update in real-time.
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* LEFT — Sliders */}
        <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-theme-border bg-theme-elevated">
            <DollarSign size={13} className="text-theme-primary" />
            <span className="text-[11px] font-bold text-theme-primary uppercase tracking-widest">
              Loan Parameters
            </span>
          </div>

          <div className="p-5 space-y-8">
            {/* Loan Amount Slider */}
            <div>
              <RangeSlider
                id="loan-amount-slider"
                label="Loan Amount"
                min={actualMinLoan}
                max={maxLoanAmount}
                step={1000}
                value={loanAmount}
                onChange={setLoanAmount}
                formatFn={formatINR}
              />
              {/* LTV live badge */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 h-1 rounded bg-theme-elevated border border-theme-border overflow-hidden">
                  <motion.div
                    className="h-full bg-theme-accent"
                    animate={{ width: `${ltvPct}%` }}
                    transition={{ duration: 0.2 }}
                  />
                </div>
                <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase flex-shrink-0 tracking-widest">
                  {ltvPct}% LTV
                </span>
              </div>
            </div>

            {/* Tenure Slider */}
            <RangeSlider
              id="tenure-slider"
              label="Tenure (Months)"
              min={actualMinTenure}
              max={maxTenureMonths}
              step={6}
              value={tenure}
              onChange={setTenure}
              formatFn={(v) => `${v} Months`}
            />

            {/* Max tenure note */}
            {maxTenureMonths < (vehicleType === '4W' ? 84 : 48) && (
              <div className="flex items-start gap-2 px-3 py-3 rounded bg-amber-900/10 border border-amber-900/30">
                <Calendar size={12} className="text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-[10px] font-mono text-amber-500/90 uppercase tracking-wide">
                  Tenure capped at {maxTenureMonths} months due to vehicle age.
                </p>
              </div>
            )}

            {/* Down payment info */}
            <div className="rounded bg-theme-elevated border border-theme-border p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingDown size={12} className="text-theme-secondary" />
                  <span className="text-[10px] font-bold text-theme-secondary font-mono uppercase tracking-widest">Down Payment</span>
                </div>
                <span className="text-sm font-bold text-theme-primary font-mono">
                  <AnimatedNumber value={downPayment} prefix="₹" />
                </span>
              </div>
              <p className="text-[9px] font-mono text-theme-muted mt-2 uppercase tracking-widest">
                Asset value: {formatINR(valuation.baseValue)} − Loan: {formatINR(loanAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT — Real-time readout */}
        <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
          {/* EMI hero */}
          <div className="px-5 py-6 text-center border-b border-theme-border bg-theme-elevated">
            <p className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest mb-2">Monthly EMI</p>
            <div className="text-4xl sm:text-5xl font-bold text-theme-primary font-mono">
              ₹<AnimatedNumber value={emi} decimals={0} />
            </div>
            <p className="text-[10px] font-mono text-theme-secondary mt-3 uppercase tracking-wide">
              {tenure} months @ {interestRate}% p.a.
            </p>
            {/* Rate badge */}
            <div className="inline-flex items-center gap-1.5 mt-4 px-2.5 py-1 rounded border border-theme-border bg-theme-bg text-[9px] font-bold font-mono text-theme-secondary uppercase tracking-widest">
              <Percent size={10} />
              {interestRate}% p.a. · {condition === 'new' ? 'New Vehicle Rate' : 'Used Vehicle Rate'}
            </div>
          </div>

          {/* Fee breakdown */}
          <div className="p-5 space-y-0">
            {[
              { label: 'Principal', value: loanAmount },
              { label: 'Total Interest Payable', value: totalInterest },
              { label: `Processing Fee (${(PROCESSING_FEE_RATE * 100).toFixed(1)}%)`, value: processingFee },
              { label: `Stamp Duty (${(STAMP_DUTY_RATE * 100).toFixed(1)}%)`, value: stampDuty },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between py-3.5 border-b border-theme-border last:border-0">
                <span className="text-[11px] font-bold text-theme-secondary">{label}</span>
                <span className="text-sm font-bold text-theme-primary font-mono">
                  <AnimatedNumber value={value} prefix="₹" />
                </span>
              </div>
            ))}

            {/* Total cost */}
            <div className="mt-2 pt-5 flex items-center justify-between">
              <span className="text-xs font-bold text-theme-primary uppercase tracking-widest">Total Cost of Loan</span>
              <span className="text-base font-bold text-theme-primary font-mono">
                ₹<AnimatedNumber value={loanAmount + totalInterest + processingFee + stampDuty} />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Accept CTA */}
      <div className="rounded-lg border border-theme-border bg-theme-elevated p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <p className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest mb-1.5">Your Final Offer</p>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-2xl font-bold font-mono text-theme-primary">
                {formatINR(loanAmount)}
              </span>
              <span className="text-[11px] font-bold text-theme-secondary">
                over {tenure} months @ ₹<AnimatedNumber value={emi} decimals={0} />/mo
              </span>
            </div>
          </div>
          <motion.button
            id="accept-offer-btn"
            onClick={handleAccept}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2.5 px-6 py-4 rounded bg-theme-primary hover:bg-white text-theme-bg font-bold text-xs uppercase tracking-widest transition-colors flex-shrink-0 whitespace-nowrap"
          >
            <Sparkles size={14} />
            Proceed to Applicant Details
            <ArrowRight size={14} />
          </motion.button>
        </div>
      </div>

      {/* Back button */}
      <div className="border-t border-theme-border pt-6">
        <motion.button
          id="step4-back-btn"
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 text-[10px] font-bold font-mono text-theme-secondary hover:text-theme-primary uppercase tracking-widest transition-colors"
        >
          <ArrowLeft size={12} />
          Back to Valuation
        </motion.button>
      </div>
    </motion.div>
  );
}
