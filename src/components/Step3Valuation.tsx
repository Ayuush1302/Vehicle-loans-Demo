import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Shield,
  AlertTriangle, CheckCircle2, Clock, Percent,
  Car, Zap, Info
} from 'lucide-react';
import type { VehicleType, Condition, VehicleData, ValuationResult } from '../types/journey';
import { formatINR } from '../types/journey';

interface Step3ValuationProps {
  vehicleType: VehicleType;
  condition: Condition;
  vehicleData: VehicleData;
  onBack: () => void;
  onProceed: (result: ValuationResult) => void;
}

// ── Business rules ─────────────────────────────────────────────
const INTEREST_RATES = {
  new: { '4W': 9.5, '2W': 10.5 },
  used: { '4W': 12.0, '2W': 13.5 },
};

const LTV_CAPS = {
  new: { '4W': 0.90, '2W': 0.90 },
  used: { '4W': 0.70, '2W': 0.65 },
};

const MAX_TENURE_BASE = { '4W': 84, '2W': 48 };
const AGE_CEILING = { '4W': 10, '2W': 7 };

// Straight-line depreciation buckets for used vehicles
const DEPRECIATION_RATES: Record<number, number> = {
  1: 0.15, 2: 0.20, 3: 0.25, 4: 0.28, 5: 0.32,
  6: 0.38, 7: 0.44, 8: 0.50, 9: 0.56,
};

function getDepreciationRate(age: number): number {
  return DEPRECIATION_RATES[Math.min(age, 9)] ?? 0.60;
}

function getBaseMarketValue(vehicleData: VehicleData, vehicleType: VehicleType): number {
  if (vehicleData.kind === 'new') return vehicleData.onRoad;
  
  if (vehicleData.purchasePrice) return vehicleData.purchasePrice;

  // Estimated new price based on make/class then depreciate (fallback)
  const newPriceEstimate = vehicleType === '2W' ? 220000 : 1400000;
  const age = new Date().getFullYear() - vehicleData.year;
  const depRate = getDepreciationRate(age);
  return Math.round(newPriceEstimate * (1 - depRate));
}

function computeMaxTenure(vehicleType: VehicleType, vehicleAge: number): number {
  const ceiling = AGE_CEILING[vehicleType];
  const remaining = ceiling - vehicleAge;
  const ageBased = Math.max(0, remaining * 12);
  return Math.min(MAX_TENURE_BASE[vehicleType], ageBased);
}

function buildValuation(vehicleType: VehicleType, condition: Condition, vehicleData: VehicleData): ValuationResult {
  const vehicleAge = vehicleData.kind === 'used'
    ? new Date().getFullYear() - vehicleData.year
    : 0;
  const baseValue = getBaseMarketValue(vehicleData, vehicleType);
  const maxLTV = LTV_CAPS[condition][vehicleType];
  const maxLoanAmount = Math.round(baseValue * maxLTV);
  const maxTenureMonths = condition === 'new' ? MAX_TENURE_BASE[vehicleType] : computeMaxTenure(vehicleType, vehicleAge);
  const interestRate = INTEREST_RATES[condition][vehicleType];
  const depreciationRate = vehicleData.kind === 'used' ? getDepreciationRate(vehicleAge) : 0;

  return {
    vehicleType, condition, baseValue, maxLTV,
    maxLoanAmount, maxTenureMonths, interestRate,
    vehicleData, vehicleAge, depreciationRate,
  };
}

// ── Sub-components ─────────────────────────────────────────────
function InfoPill({ label, value, accent = false }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`flex flex-col gap-1 p-3 rounded-md border ${
      accent
        ? 'bg-theme-accent/10 border-theme-accent/30'
        : 'bg-theme-elevated border-theme-border'
    }`}>
      <span className="text-[9px] font-bold text-theme-secondary uppercase tracking-widest">{label}</span>
      <span className={`text-[11px] font-bold font-mono ${accent ? 'text-theme-accent' : 'text-theme-primary'}`}>
        {value}
      </span>
    </div>
  );
}

function RuleRow({ icon: Icon, label, value, sub, warn = false }: {
  icon: React.ElementType; label: string; value: string; sub?: string; warn?: boolean;
}) {
  return (
    <div className={`flex items-start justify-between py-3.5 border-b border-theme-border last:border-0 ${warn ? 'opacity-100' : ''}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 border mt-0.5 ${
          warn ? 'bg-amber-900/10 border-amber-900/30' : 'bg-theme-elevated border-theme-border'
        }`}>
          <Icon size={12} className={warn ? 'text-amber-500' : 'text-theme-primary'} />
        </div>
        <div>
          <p className={`text-xs font-bold ${warn ? 'text-amber-500' : 'text-theme-primary'}`}>{label}</p>
          {sub && <p className="text-[10px] font-mono text-theme-secondary mt-1">{sub}</p>}
        </div>
      </div>
      <span className={`text-sm font-bold font-mono ml-4 flex-shrink-0 text-right ${warn ? 'text-amber-500' : 'text-theme-primary'}`}>
        {value}
      </span>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────
export default function Step3Valuation({ vehicleType, condition, vehicleData, onBack, onProceed }: Step3ValuationProps) {
  const valuation = useMemo(
    () => buildValuation(vehicleType, condition, vehicleData),
    [vehicleType, condition, vehicleData]
  );

  const isUsed = condition === 'used';
  const isNearAgeCeiling = isUsed && valuation.vehicleAge >= AGE_CEILING[vehicleType] - 2;
  const tenureWarn = valuation.maxTenureMonths < MAX_TENURE_BASE[vehicleType];

  const typeLabel = vehicleType === '2W' ? 'Two-Wheeler' : 'Four-Wheeler';
  const vehicleName = vehicleData.kind === 'used'
    ? `${vehicleData.make} ${vehicleData.model}`
    : `${vehicleData.make} ${vehicleData.model}`;
  const vehicleYear = vehicleData.kind === 'used' ? vehicleData.year : new Date().getFullYear();

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="space-y-7 max-w-2xl mx-auto py-8"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest px-2 py-1 border border-theme-border rounded bg-theme-elevated">
            {typeLabel}
          </span>
          <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest px-2 py-1 border border-theme-border rounded bg-theme-elevated">
            {isUsed ? 'USED' : 'NEW'}
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight">
          Asset Valuation & Eligibility Assessment
        </h2>
        <p className="text-theme-secondary text-sm mt-2 leading-relaxed">
          Our AI valuation engine has assessed your asset. Review the parameters below.
        </p>
      </div>

      {/* Asset Summary Card */}
      <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-theme-border bg-theme-elevated">
          <div className="w-8 h-8 rounded border border-theme-border bg-theme-bg flex items-center justify-center flex-shrink-0">
            <Car size={14} className="text-theme-primary" />
          </div>
          <div>
            <p className="text-[9px] font-bold text-theme-secondary uppercase tracking-widest font-mono mb-0.5">Selected Asset</p>
            <h3 className="text-sm font-bold text-theme-primary">
              {vehicleName}
            </h3>
          </div>
          <div className="ml-auto flex flex-col items-end gap-1">
            <span className="text-[9px] font-bold text-theme-secondary uppercase tracking-widest font-mono">Reg. Year</span>
            <span className="text-xs font-bold text-theme-primary font-mono">{vehicleYear}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-4">
          <InfoPill label="Variant" value={vehicleData.kind === 'used' ? vehicleData.variant : vehicleData.variant} />
          <InfoPill label="Fuel Type" value={vehicleData.fuelType} />
          {vehicleData.kind === 'used' ? (
            <>
              <InfoPill label="Hypothecation" value={vehicleData.hypothecation} accent={vehicleData.hypothecation === 'Clear'} />
              <InfoPill label="Odometer" value={
                vehicleData.odometer 
                  ? `${vehicleData.odometer.toLocaleString('en-IN')} km`
                  : vehicleData.odometerBand === 'lt30' ? '< 30k km'
                  : vehicleData.odometerBand === '30-60' ? '30k–60k km'
                  : '60k+ km'
              } />
            </>
          ) : (
            <>
              <InfoPill label="City" value={vehicleData.city} />
              <InfoPill label="Insurance" value={formatINR(vehicleData.insurance)} />
            </>
          )}
        </div>
      </div>

      {/* Valuation Engine Card */}
      <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
        {/* Card header */}
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-theme-border bg-theme-elevated">
          <div className="w-6 h-6 rounded border border-theme-border bg-theme-bg flex items-center justify-center">
            <Zap size={11} className="text-theme-primary" />
          </div>
          <span className="text-xs font-bold text-theme-primary">Valuation Engine Result</span>
          <span className="ml-auto text-[9px] font-bold text-theme-accent font-mono tracking-widest uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
            AI ASSESSED
          </span>
        </div>

        <div className="p-5 space-y-0">
          {/* Base market value */}
          <div className="pb-5 mb-2 border-b border-theme-border">
            <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest font-mono mb-2">
              {isUsed ? 'Agreed Purchase Price' : 'Verified On-Road Price'}
            </p>
            <p className="text-3xl font-bold font-mono text-theme-primary">
              {formatINR(valuation.baseValue)}
            </p>
            {isUsed && (
              <p className="text-[10px] font-mono text-theme-secondary mt-1.5 uppercase tracking-wide">
                Based on agreed purchase price
              </p>
            )}
          </div>

          {/* Rule rows */}

          <RuleRow
            icon={Percent}
            label={`LTV Cap — ${isUsed ? 'Used' : 'New'} ${typeLabel}`}
            value={`${(valuation.maxLTV * 100).toFixed(0)}% Max LTV`}
            sub={`Max Financing: ${formatINR(valuation.maxLoanAmount)}`}
          />

          <RuleRow
            icon={Clock}
            label="Maximum Loan Tenure"
            value={`${valuation.maxTenureMonths} Months`}
            sub={
              tenureWarn
                ? `Capped by vehicle age (min(${MAX_TENURE_BASE[vehicleType]}m, (${AGE_CEILING[vehicleType]}−age)×12))`
                : `Standard ${typeLabel} tenure`
            }
            warn={tenureWarn}
          />

          <RuleRow
            icon={Percent}
            label="Interest Rate"
            value={`${valuation.interestRate}% p.a.`}
            sub="Reducing balance · Subject to credit profile"
          />

          <RuleRow
            icon={Shield}
            label="Max Financing Available"
            value={formatINR(valuation.maxLoanAmount)}
            sub={`${(valuation.maxLTV * 100).toFixed(0)}% of ${isUsed ? 'purchase price' : 'on-road price'}`}
          />
        </div>

        {/* Age ceiling warning */}
        {isNearAgeCeiling && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-5 mb-5 flex items-start gap-3 p-4 rounded bg-amber-900/10 border border-amber-900/30"
          >
            <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-amber-500">Asset Age Approaching Ceiling</p>
              <p className="text-[10px] font-mono text-amber-500/80 mt-1 uppercase tracking-wide">
                This {typeLabel.toLowerCase()} is {valuation.vehicleAge} years old. Max age at maturity is {AGE_CEILING[vehicleType]} years.
                Tenure capped at {valuation.maxTenureMonths} months.
              </p>
            </div>
          </motion.div>
        )}

        {/* Max offer summary */}
        <div className="mx-5 mb-5 rounded bg-theme-elevated border border-theme-border p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-theme-secondary font-mono uppercase tracking-widest mb-1.5">Maximum Offer</p>
              <p className="text-2xl font-bold font-mono text-theme-primary">
                {formatINR(valuation.maxLoanAmount)}
              </p>
              <p className="text-[10px] font-mono text-theme-secondary mt-1.5 uppercase tracking-wide">
                Up to {valuation.maxTenureMonths} months · {valuation.interestRate}% p.a.
              </p>
            </div>
            <div className="text-right">
              <div className="w-10 h-10 rounded border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center mb-2 ml-auto">
                <CheckCircle2 size={16} className="text-theme-accent" />
              </div>
              <p className="text-[9px] text-theme-accent font-bold tracking-widest uppercase">Eligible</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info note */}
      <div className="flex items-start gap-2.5 px-4 py-3.5 rounded bg-theme-elevated border border-theme-border">
        <Info size={12} className="text-theme-secondary flex-shrink-0 mt-0.5" />
        <p className="text-[10px] font-mono text-theme-secondary leading-relaxed uppercase tracking-wide">
          Valuation is indicative based on market data. Final approval subject to credit assessment, income verification, and inspection.
        </p>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-6 border-t border-theme-border">
        <motion.button
          id="step3-back-btn"
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded border border-theme-border bg-theme-elevated hover:bg-theme-card text-theme-primary font-bold text-xs uppercase tracking-widest transition-colors flex-shrink-0"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <motion.button
          id="step3-proceed-btn"
          onClick={() => onProceed(valuation)}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="flex-1 py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 bg-theme-accent hover:bg-[#256639] text-theme-primary transition-colors"
        >
          Customise Loan Offer
          <ArrowRight size={14} />
        </motion.button>
      </div>
    </motion.div>
  );
}
