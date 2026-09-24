import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, CheckCircle2, FileText,
  Upload, X, Sparkles, Copy, Download,
  DollarSign, Calendar, TrendingDown, Percent,
  ChevronRight, Home
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
          className="absolute w-5 h-5 rounded-sm border-2 border-theme-primary shadow-sm pointer-events-none transition-all duration-100 bg-theme-card"
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

// ── Confetti burst (CSS-only) ──────────────────────────────────
function ConfettiBurst() {
  const particles = Array.from({ length: 32 }, (_, i) => ({
    id: i,
    color: ['var(--color-theme-accent)', 'var(--color-theme-primary)', 'var(--color-theme-secondary)', 'var(--color-theme-muted)'][i % 4],
    x: (Math.random() - 0.5) * 600,
    y: -(Math.random() * 400 + 100),
    rotate: Math.random() * 720 - 360,
    scale: Math.random() * 0.8 + 0.4,
    delay: Math.random() * 0.3,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center overflow-hidden">
      {particles.map(p => (
        <motion.div
          key={p.id}
          initial={{ x: 0, y: 0, rotate: 0, scale: 1, opacity: 1 }}
          animate={{ x: p.x, y: p.y, rotate: p.rotate, scale: p.scale, opacity: 0 }}
          transition={{ duration: 1.8, delay: p.delay, ease: 'easeOut' }}
          className="absolute w-3 h-3 rounded-sm"
          style={{ backgroundColor: p.color }}
        />
      ))}
    </div>
  );
}

// ── Doc Dropzone ───────────────────────────────────────────────
function DocDropzone({ label, hint, required }: { label: string; hint: string; required?: boolean }) {
  const [file, setFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) setFile(f.name);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      onClick={() => !file && inputRef.current?.click()}
      className={`relative rounded border border-dashed p-4 transition-colors duration-200 cursor-pointer group ${
        file
          ? 'border-theme-accent/50 bg-theme-accent/10'
          : 'border-theme-muted hover:border-theme-primary bg-theme-elevated hover:bg-theme-card'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={e => { if (e.target.files?.[0]) setFile(e.target.files[0].name); }}
      />
      <div className="flex items-center gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border ${
          file ? 'bg-theme-accent/20 border-theme-accent/30' : 'bg-theme-bg border-theme-border'
        }`}>
          {file
            ? <CheckCircle2 size={14} className="text-theme-accent" />
            : <Upload size={14} className="text-theme-secondary group-hover:text-theme-primary transition-colors" />
          }
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[11px] font-bold ${file ? 'text-theme-accent' : 'text-theme-primary'}`}>
            {label} {required && <span className="text-amber-500">*</span>}
          </p>
          <p className="text-[10px] font-mono text-theme-secondary truncate mt-0.5">{file ? file : hint}</p>
        </div>
        {file && (
          <button
            onClick={e => { e.stopPropagation(); setFile(null); }}
            className="w-6 h-6 rounded bg-theme-elevated border border-theme-border hover:border-red-500/50 hover:bg-red-950/20 flex items-center justify-center transition-colors"
          >
            <X size={11} className="text-theme-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function Step4Sanction({ valuation, userName: _userName, onComplete, onBack }: Step4SanctionProps) {
  const { maxLoanAmount, maxTenureMonths, interestRate, condition, vehicleType, vehicleData } = valuation;

  const [loanAmount, setLoanAmount] = useState(Math.round(maxLoanAmount * 0.8));
  const [tenure, setTenure] = useState(Math.min(maxTenureMonths, vehicleType === '4W' ? 60 : 36));
  const [accepted, setAccepted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sanction, setSanction] = useState<SanctionedApp | null>(null);
  const [copied, setCopied] = useState(false);

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
    setSanction(app);
    setAccepted(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleCopy = useCallback(() => {
    if (sanction) {
      navigator.clipboard.writeText(sanction.refNumber).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  }, [sanction]);

  const isUsed = condition === 'used';
  const vehicleName = `${vehicleData.make} ${vehicleData.model}`;
  const typeLabel = vehicleType === '2W' ? 'Two-Wheeler' : 'Four-Wheeler';

  if (accepted && sanction) {
    return (
      <>
        {showConfetti && <ConfettiBurst />}
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
              className="w-16 h-16 rounded border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center mx-auto mb-5"
            >
              <CheckCircle2 size={24} className="text-theme-accent" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight"
            >
              Sanction Letter Generated
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-theme-secondary text-sm mt-2"
            >
              Your pre-sanction offer for <span className="text-theme-primary font-bold">{vehicleName}</span> is ready.
            </motion.p>
          </div>

          {/* Sanction letter card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-lg border border-theme-border bg-theme-card overflow-hidden"
          >
            <div className="h-1 w-full bg-theme-accent" />
            <div className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <p className="text-[10px] font-bold text-theme-secondary font-mono uppercase tracking-widest">Reference Number</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg font-bold font-mono text-theme-primary">
                      {sanction.refNumber}
                    </span>
                    <button
                      onClick={handleCopy}
                      className="w-6 h-6 rounded bg-theme-elevated border border-theme-border hover:border-theme-primary flex items-center justify-center transition-colors"
                      title="Copy reference"
                    >
                      {copied ? <CheckCircle2 size={11} className="text-theme-accent" /> : <Copy size={11} className="text-theme-secondary" />}
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-theme-secondary font-mono uppercase tracking-widest">Date</p>
                  <p className="text-xs font-bold font-mono text-theme-primary mt-1">{sanction.sanctionDate}</p>
                </div>
              </div>

              {/* Loan summary grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-5">
                {[
                  { label: 'Sanctioned Amount', value: formatINR(sanction.loanAmount), green: true },
                  { label: 'Monthly EMI', value: formatINR(sanction.emi), green: true },
                  { label: 'Tenure', value: `${sanction.tenureMonths} Months` },
                  { label: 'Interest Rate', value: `${interestRate}% p.a.` },
                  { label: 'Processing Fee', value: formatINR(processingFee) },
                  { label: 'Asset', value: vehicleName },
                ].map(({ label, value, green }) => (
                  <div key={label} className={`rounded p-3 border ${
                    green
                      ? 'bg-theme-accent/10 border-theme-accent/30'
                      : 'bg-theme-elevated border-theme-border'
                  }`}>
                    <p className="text-[9px] font-bold uppercase tracking-widest text-theme-secondary">{label}</p>
                    <p className={`text-xs font-bold font-mono mt-1 ${green ? 'text-theme-accent' : 'text-theme-primary'}`}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              {/* Download mock */}
              <button className="w-full flex items-center justify-center gap-2 py-3 rounded border border-theme-border bg-theme-elevated hover:bg-theme-bg hover:border-theme-primary text-theme-primary text-xs font-bold uppercase tracking-widest transition-colors">
                <Download size={14} />
                Download Sanction Letter (PDF)
              </button>
            </div>
          </motion.div>

          {/* Document Checklist */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="rounded-lg border border-theme-border bg-theme-card overflow-hidden"
          >
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-theme-border bg-theme-elevated">
              <FileText size={13} className="text-theme-primary" />
              <span className="text-[11px] font-bold text-theme-primary uppercase tracking-widest">
                Required Documents
              </span>
            </div>
            <div className="p-4 space-y-3">
              {/* Common docs */}
              <DocDropzone label="PAN Card (Both Sides)" hint="PDF or Image · Max 5 MB" required />
              <DocDropzone label="Address Proof (Aadhaar / Utility Bill)" hint="PDF or Image · Max 5 MB" required />
              <DocDropzone label="Last 3 Months Bank Statement" hint="PDF format preferred" required />
              {/* Condition-specific docs */}
              {isUsed ? (
                <>
                  <div className="pt-2 pb-1">
                    <p className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest">Used Vehicle Docs</p>
                  </div>
                  <DocDropzone label="RC Copy (Registration Certificate)" hint="Front + Back · PDF or Image" required />
                  <DocDropzone label="Valid Insurance Certificate" hint="Current year policy · PDF" required />
                  <DocDropzone label="Form 35 (NOC from Previous Lender)" hint="If hypothecation exists" />
                </>
              ) : (
                <>
                  <div className="pt-2 pb-1">
                    <p className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest">New Vehicle Docs</p>
                  </div>
                  <DocDropzone label="Dealer Proforma Invoice" hint="From authorised dealership · PDF" required />
                  <DocDropzone label="Booking Receipt / Allotment Letter" hint="PDF or Image" />
                </>
              )}

              <p className="text-[10px] text-theme-muted pt-2 text-center font-mono">
                * Documents verified in 2–4 hours. Disbursement follows physical inspection.
              </p>
            </div>
          </motion.div>

          {/* Return to Dashboard */}
          <motion.button
            id="return-dashboard-btn"
            onClick={() => onComplete(sanction)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            className="w-full py-4 rounded bg-theme-primary hover:bg-white text-theme-bg font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors"
          >
            <Home size={14} />
            Return to Dashboard
            <ChevronRight size={14} />
          </motion.button>

          <p className="text-center text-[10px] font-mono text-theme-muted pb-2">
            © 2024 Crux Auto Finance Pvt. Ltd. — Sanction subject to final approval.
          </p>
        </motion.div>
      </>
    );
  }

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
                min={MIN_LOAN}
                max={maxLoanAmount}
                step={10000}
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
              min={6}
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
            Generate Sanction Letter
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
