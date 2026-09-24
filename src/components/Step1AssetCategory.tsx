import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Clock, Tag } from 'lucide-react';

type VehicleType = '2W' | '4W';
type Condition = 'used' | 'new';

interface Step1AssetCategoryProps {
  onContinue: (vehicleType: VehicleType, condition: Condition) => void;
  initialVehicleType?: VehicleType;
  initialCondition?: Condition;
}

const VEHICLE_CARDS: {
  type: VehicleType;
  emoji: string;
  title: string;
  subtitle: string;
  tag: string;
  tagColor: string;
  features: string[];
  maxLTV: string;
}[] = [
  {
    type: '2W',
    emoji: '🏍',
    title: 'Two-Wheeler',
    subtitle: 'Bike / Scooter',
    tag: 'Up to 48 Mos Tenure',
    tagColor: 'border-theme-border bg-theme-elevated text-theme-secondary',
    features: ['Up to ₹5,00,000 limit', '75% LTV on used', '90% LTV on new', 'Bikes & Scooters'],
    maxLTV: '90%',
  },
  {
    type: '4W',
    emoji: '🚗',
    title: 'Four-Wheeler',
    subtitle: 'Car / SUV / MPV',
    tag: 'Up to 84 Mos Tenure',
    tagColor: 'border-theme-border bg-theme-elevated text-theme-secondary',
    features: ['Up to ₹30,00,000 limit', '80% LTV on used', '90% LTV on new', 'Cars, SUVs & MUVs'],
    maxLTV: '90%',
  },
];

const CONDITION_OPTIONS: {
  value: Condition;
  emoji: string;
  label: string;
  sub: string;
}[] = [
  { value: 'new', emoji: '✨', label: 'Brand New Vehicle', sub: 'Showroom-fresh, dealer purchase' },
  { value: 'used', emoji: '🔍', label: 'Used / Pre-Owned', sub: 'Second-hand, private or dealer' },
];

export default function Step1AssetCategory({
  onContinue,
  initialVehicleType = '4W',
  initialCondition = 'new',
}: Step1AssetCategoryProps) {
  const [vehicleType, setVehicleType] = useState<VehicleType>(initialVehicleType);
  const [condition, setCondition] = useState<Condition>(initialCondition);

  const canContinue = !!vehicleType && !!condition;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 max-w-3xl mx-auto py-8"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Section header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight">
          What vehicle are you financing?
        </h2>
        <p className="text-theme-secondary text-sm mt-2 leading-relaxed">
          Terms and LTV parameters vary significantly by vehicle class and condition.
        </p>
      </div>

      {/* Vehicle Type Cards */}
      <div>
        <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-4 font-mono">
          Vehicle Category
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VEHICLE_CARDS.map((card) => {
            const isSelected = vehicleType === card.type;
            return (
              <motion.button
                key={card.type}
                id={`vehicle-type-${card.type}`}
                onClick={() => setVehicleType(card.type)}
                whileHover={{ scale: 1.01, y: -2 }}
                whileTap={{ scale: 0.99 }}
                className={`relative text-left rounded-xl border p-5 transition-colors duration-200 overflow-hidden group ${
                  isSelected
                    ? 'border-theme-primary bg-theme-elevated'
                    : 'border-theme-border bg-theme-card hover:border-theme-muted'
                }`}
              >
                {/* Check badge */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-4 right-4 w-6 h-6 rounded border border-theme-primary bg-theme-primary flex items-center justify-center"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#111111" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Emoji + title */}
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-3xl flex-shrink-0 transition-colors duration-200 ${
                    isSelected ? 'bg-theme-bg border border-theme-border' : 'bg-theme-elevated border border-theme-border'
                  }`}>
                    {card.emoji}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-base font-bold text-theme-primary">
                      {card.title}
                    </h3>
                    <p className="text-xs text-theme-secondary mt-0.5 font-medium">{card.subtitle}</p>
                  </div>
                </div>

                {/* Tenure tag */}
                <div className="mb-5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[10px] font-bold uppercase tracking-widest ${card.tagColor}`}>
                    <Clock size={10} />
                    {card.tag}
                  </span>
                </div>

                {/* Feature list */}
                <ul className="space-y-2">
                  {card.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-theme-secondary font-medium">
                      <div className={`w-1 h-1 rounded-full flex-shrink-0 ${isSelected ? 'bg-theme-primary' : 'bg-theme-muted'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Max LTV badge */}
                <div className={`absolute bottom-5 right-5 text-right transition-opacity duration-200 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                  <p className="text-[9px] text-theme-secondary font-bold uppercase tracking-widest">Max LTV</p>
                  <p className="text-lg font-bold font-mono text-theme-primary">{card.maxLTV}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Condition Switch */}
      <div>
        <p className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-4 font-mono">
          Vehicle Condition
        </p>
        <div className="flex p-1 rounded-xl bg-theme-card border border-theme-border gap-1">
          {CONDITION_OPTIONS.map((opt) => {
            const isActive = condition === opt.value;
            return (
              <button
                key={opt.value}
                id={`condition-${opt.value}`}
                onClick={() => setCondition(opt.value)}
                className="relative flex-1 px-4 py-4 rounded-lg text-left transition-colors duration-150"
                style={{ zIndex: 1 }}
              >
                {isActive && (
                  <motion.div
                    layoutId="conditionPill"
                    className="absolute inset-0 rounded-lg bg-theme-elevated border border-theme-muted"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.35 }}
                    style={{ zIndex: -1 }}
                  />
                )}
                <div className="flex items-center gap-3">
                  <span className="text-xl">{opt.emoji}</span>
                  <div>
                    <p className={`text-sm font-bold ${isActive ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                      {opt.label}
                    </p>
                    <p className={`text-[11px] font-medium mt-0.5 ${isActive ? 'text-theme-secondary' : 'text-theme-muted'}`}>
                      {opt.sub}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary chip */}
      <AnimatePresence>
        {canContinue && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-2 px-4 py-2.5 rounded bg-theme-elevated border border-theme-border w-fit"
          >
            <Tag size={13} className="text-theme-primary" />
            <span className="text-[11px] font-bold text-theme-primary tracking-wide uppercase">
              {condition === 'new' ? 'NEW' : 'USED'}{' '}
              {vehicleType === '2W' ? 'Two-Wheeler' : 'Four-Wheeler'} selected
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <motion.button
        id="step1-continue-btn"
        onClick={() => canContinue && onContinue(vehicleType, condition)}
        disabled={!canContinue}
        whileHover={canContinue ? { scale: 1.01 } : {}}
        whileTap={canContinue ? { scale: 0.99 } : {}}
        className={`w-full py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2.5 transition-colors duration-300 ${
          canContinue
            ? 'bg-theme-accent hover:bg-[#256639] text-theme-primary'
            : 'bg-theme-card border border-theme-border text-theme-muted cursor-not-allowed'
        }`}
      >
        Continue to Vehicle Details
        <ArrowRight size={17} />
      </motion.button>
    </motion.div>
  );
}
