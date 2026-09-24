import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, Zap, Search,
  CheckCircle2, AlertCircle, Car, Fuel,
  Calendar, Shield, Hash, MapPin, Tag,
  Layers, Info,
} from 'lucide-react';
import { vahanData, cities, vehicleCatalog, rtoTaxRates } from '../data/vehicleData';
import type { VehicleType, Condition, VehicleData } from '../types/journey';

interface Step2VehicleDetailsProps {
  vehicleType: VehicleType;
  condition: Condition;
  onBack: () => void;
  onProceed: (data: VehicleData) => void;
}

// ── helpers ────────────────────────────────────────────────────
function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

const SCAN_STEPS = [
  'Querying Vahan 4.0...',
  'Extracting RTO Fitness & Hypothecation...',
  'Calculating Residual Asset Value...',
];

const ODOMETER_OPTIONS = [
  { id: 'lt30', label: '< 30,000 km' },
  { id: '30-60', label: '30k – 60k km' },
  { id: 'gt60', label: '60k+ km' },
];

// ── Used Vehicle Sub-Form ──────────────────────────────────────
function UsedVehicleForm({ vehicleType, onReady, onDataChange }: {
  vehicleType: VehicleType;
  onReady: (ready: boolean) => void;
  onDataChange: (data: VehicleData | null) => void;
}) {
  const [plate, setPlate] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [vehicleData, setVehicleData] = useState<typeof vahanData[string] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedOdometer, setSelectedOdometer] = useState('');

  const isReady = !!(vehicleData && selectedVariant && selectedOdometer);
  useEffect(() => { onReady(isReady); }, [isReady]);
  useEffect(() => {
    if (vehicleData && selectedVariant && selectedOdometer) {
      onDataChange({
        kind: 'used',
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        fuelType: vehicleData.fuelType,
        color: vehicleData.color,
        engineCC: vehicleData.engineCC,
        hypothecation: vehicleData.hypothecation,
        variant: selectedVariant,
        odometerBand: selectedOdometer as 'lt30' | '30-60' | 'gt60',
      });
    } else {
      onDataChange(null);
    }
  }, [vehicleData, selectedVariant, selectedOdometer]);

  const formatPlate = (raw: string) => {
    const v = raw.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (v.length <= 2) return v;
    if (v.length <= 4) return `${v.slice(0, 2)} ${v.slice(2)}`;
    if (v.length <= 6) return `${v.slice(0, 2)} ${v.slice(2, 4)} ${v.slice(4)}`;
    return `${v.slice(0, 2)} ${v.slice(2, 4)} ${v.slice(4, 6)} ${v.slice(6, 10)}`;
  };

  const handleFetch = async () => {
    if (!plate || plate.replace(/\s/g, '').length < 6) {
      setError('Enter a valid registration number (e.g. DL 01 AB 1234).');
      return;
    }
    setScanning(true); setVehicleData(null); setError(null); setScanStep(0);
    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise(r => setTimeout(r, 680));
    }
    await new Promise(r => setTimeout(r, 250));
    const key = plate.replace(/\s/g, '');
    const data = vahanData[key];
    setScanning(false);
    if (data) {
      setVehicleData(data);
      setSelectedVariant(data.variants[0]);
      setSelectedOdometer('lt30');
    } else {
      const fallback = vehicleType === '2W'
        ? { make: 'Royal Enfield', model: 'Classic 350', fuelType: 'Petrol', year: 2021, hypothecation: 'Clear' as const, color: 'Stealth Black', engineCC: 349, variants: ['Signals', 'Redditch', 'Halcyon', 'Dark'] }
        : { make: 'Hyundai', model: 'Creta', fuelType: 'Petrol', year: 2021, hypothecation: 'Clear' as const, color: 'Phantom Black', engineCC: 1497, variants: ['E', 'EX', 'S', 'SX', 'SX(O)'] };
      setVehicleData(fallback);
      setSelectedVariant(fallback.variants[1]);
      setSelectedOdometer('30-60');
    }
  };

  const loanEstimate = vehicleData
    ? Math.round(
        (vehicleData.year >= 2022 ? 900000 : vehicleData.year >= 2019 ? 700000 : 500000) *
          (selectedOdometer === 'lt30' ? 0.85 : selectedOdometer === '30-60' ? 0.70 : 0.55)
      )
    : 0;

  return (
    <div className="space-y-5 font-sans" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* IND Plate Input */}
      <div>
        <label className="block text-[10px] font-bold text-theme-secondary mb-2 uppercase tracking-widest font-mono">
          Registration Number
        </label>
        <div className={`relative flex items-stretch rounded border transition-colors duration-200 bg-theme-card overflow-hidden ${
          error ? 'border-red-900/50' : 'border-theme-border focus-within:border-theme-primary'
        }`}>
          {/* IND strip */}
          <div className="flex flex-col items-center justify-center bg-[#003087] px-3 py-2.5 min-w-[54px] gap-1 border-r border-[#0040a8]">
            <div className="flex flex-col items-center">
              <div className="w-2 h-1 bg-[#FF9933] rounded-t-sm" />
              <div className="w-2 h-1 bg-white" />
              <div className="w-2 h-1 bg-[#138808] rounded-b-sm" />
            </div>
            <span className="text-[9px] font-black text-white tracking-widest mt-0.5">IND</span>
          </div>

          <input
            id="plate-input-s2"
            type="text"
            value={plate}
            onChange={e => { setPlate(formatPlate(e.target.value)); setVehicleData(null); setError(null); }}
            placeholder="DL 01 AB 1234"
            maxLength={13}
            className="flex-1 bg-transparent px-4 py-4 text-xl font-bold font-mono text-theme-primary placeholder-theme-muted focus:outline-none tracking-[0.2em] uppercase"
          />

          <button
            id="fetch-vahan-btn"
            onClick={handleFetch}
            disabled={scanning}
            className="flex items-center gap-2 px-6 py-3 bg-theme-elevated hover:bg-theme-card disabled:bg-theme-bg text-theme-primary font-bold text-xs uppercase tracking-widest transition-colors duration-200 border-l border-theme-border flex-shrink-0"
          >
            {scanning
              ? <div className="w-4 h-4 border-2 border-theme-primary/20 border-t-theme-primary rounded-full animate-spin" />
              : <Zap size={14} className="text-theme-secondary" />
            }
            <span className="hidden sm:inline">{scanning ? 'Scanning' : 'Fetch'}</span>
            <span className="sm:hidden">{scanning ? '...' : 'Fetch'}</span>
          </button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="mt-2 text-[11px] font-mono text-red-500 flex items-center gap-1.5">
              <AlertCircle size={12} /> {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* Radar scanning animation */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="relative rounded-lg border border-theme-border bg-theme-card overflow-hidden p-6"
          >
            <div className="absolute left-0 right-0 h-px bg-theme-border scan-beam opacity-80" />

            <div className="flex items-center gap-4 mb-5">
              <div className="relative w-10 h-10 flex-shrink-0">
                <div className="absolute inset-0 rounded-full border-2 border-theme-border" style={{ animation: 'spinSlow 3s linear infinite' }} />
                <div className="absolute inset-1 rounded-full border-2 border-t-theme-primary border-transparent animate-spin" />
                <Search size={11} className="absolute inset-0 m-auto text-theme-secondary" />
              </div>
              <div>
                <p className="text-sm font-bold text-theme-primary">Querying VAHAN 4.0 Database</p>
                <p className="text-xs text-theme-secondary mt-0.5">Ministry of Road Transport & Highways</p>
              </div>
              <span className="ml-auto text-[9px] font-bold text-theme-accent font-mono animate-pulse tracking-widest uppercase">● LIVE</span>
            </div>

            <div className="space-y-3">
              {SCAN_STEPS.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: i <= scanStep ? 1 : 0.25, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-4 h-4 rounded-sm flex items-center justify-center flex-shrink-0 transition-colors duration-300 border ${
                    i < scanStep ? 'bg-theme-accent border-theme-accent' : i === scanStep ? 'bg-theme-elevated border-theme-primary animate-pulse' : 'bg-theme-bg border-theme-border'
                  }`}>
                    {i < scanStep
                      ? <CheckCircle2 size={10} className="text-theme-primary" />
                      : i === scanStep
                      ? <div className="w-1.5 h-1.5 bg-theme-primary" />
                      : null}
                  </div>
                  <span className={`text-[11px] font-mono transition-colors duration-200 ${
                    i < scanStep ? 'text-theme-accent' : i === scanStep ? 'text-theme-primary' : 'text-theme-muted'
                  }`}>{step}</span>
                </motion.div>
              ))}
            </div>

            <div className="mt-5 h-1 rounded-full bg-theme-elevated overflow-hidden border border-theme-border">
              <motion.div
                className="h-full bg-theme-accent"
                animate={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Response Card */}
      <AnimatePresence>
        {vehicleData && !scanning && (
          <motion.div
            key="vahan-card"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ type: 'spring', bounce: 0.28, duration: 0.5 }}
            className="rounded-lg border border-theme-border bg-theme-card overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border bg-theme-elevated">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-theme-accent" />
                <span className="text-[11px] font-bold text-theme-primary tracking-widest uppercase">Vehicle Identified</span>
              </div>
              <span className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded border uppercase ${
                vehicleData.hypothecation === 'Clear'
                  ? 'bg-theme-accent/10 border-theme-accent/30 text-theme-accent'
                  : 'bg-amber-900/10 border-amber-900/30 text-amber-500'
              }`}>
                {vehicleData.hypothecation === 'Clear' ? 'HYP. CLEAR' : 'HYP. ACTIVE'}
              </span>
            </div>

            <div className="p-5 space-y-5">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {[
                  { icon: Car, label: 'Make', value: vehicleData.make },
                  { icon: Hash, label: 'Model', value: vehicleData.model },
                  { icon: Fuel, label: 'Fuel', value: vehicleData.fuelType },
                  { icon: Calendar, label: 'Year', value: String(vehicleData.year) },
                  { icon: Shield, label: 'Engine', value: `${vehicleData.engineCC} cc` },
                  { icon: Car, label: 'Colour', value: vehicleData.color },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-theme-elevated rounded border border-theme-border p-3 text-center">
                    <div className="flex items-center justify-center gap-1.5 mb-1">
                      <Icon size={10} className="text-theme-secondary" />
                      <span className="text-[9px] font-bold text-theme-secondary uppercase tracking-widest">{label}</span>
                    </div>
                    <span className="text-xs font-bold text-theme-primary">{value}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-2 border-t border-theme-border">
                <div>
                  <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">
                    Exact Trim / Variant
                  </label>
                  <select
                    id="variant-override"
                    value={selectedVariant}
                    onChange={e => setSelectedVariant(e.target.value)}
                    className="w-full bg-theme-elevated border border-theme-border focus:border-theme-primary text-theme-primary text-xs font-bold px-3 py-3 rounded focus:outline-none transition-colors"
                  >
                    {vehicleData.variants.map(v => (
                      <option key={v} value={v} className="bg-theme-elevated">{v}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">
                    Odometer Range
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {ODOMETER_OPTIONS.map(opt => (
                      <button
                        key={opt.id}
                        id={`odo-${opt.id}`}
                        onClick={() => setSelectedOdometer(opt.id)}
                        className={`py-3 text-[10px] font-bold tracking-wider uppercase rounded border transition-colors duration-200 ${
                          selectedOdometer === opt.id
                            ? 'bg-theme-elevated border-theme-primary text-theme-primary'
                            : 'bg-theme-elevated border-theme-border text-theme-secondary hover:border-theme-muted'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loan estimate */}
              <AnimatePresence>
                {selectedOdometer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded border border-theme-border bg-theme-elevated p-5 flex items-center justify-between mt-4"
                  >
                    <div>
                      <p className="text-[9px] text-theme-secondary font-bold uppercase tracking-widest">Estimated Loan Limit</p>
                      <p className="text-2xl font-bold font-mono text-theme-primary mt-1">
                        {formatINR(loanEstimate)}
                      </p>
                      <p className="text-[10px] text-theme-secondary mt-1 font-mono">Based on market valuation</p>
                    </div>
                    <div className="text-right">
                      <div className="w-10 h-10 rounded border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center mb-1 ml-auto">
                        <CheckCircle2 size={16} className="text-theme-accent" />
                      </div>
                      <p className="text-[9px] text-theme-accent font-bold tracking-widest uppercase mt-2">Pre-Eligible</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── New Vehicle Sub-Form ───────────────────────────────────────
function NewVehicleForm({ vehicleType, onReady, onDataChange }: {
  vehicleType: VehicleType;
  onReady: (ready: boolean) => void;
  onDataChange: (data: VehicleData | null) => void;
}) {
  const [city, setCity] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showSugg, setShowSugg] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [variant, setVariant] = useState('');

  const catalog = vehicleCatalog[vehicleType] as Record<string, {
    models: Record<string, {
      fuelTypes: string[];
      variants: Record<string, string[]>;
      exShowroom: Record<string, number>;
    }>;
  }>;

  const makes = Object.keys(catalog);
  const models = make ? Object.keys(catalog[make]?.models || {}) : [];
  const fuelTypes = make && model ? catalog[make].models[model]?.fuelTypes || [] : [];
  const variants = make && model && fuelType ? catalog[make].models[model]?.variants[fuelType] || [] : [];

  const filteredCities = cities.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()));

  const exShowroom = make && model && variant ? catalog[make]?.models[model]?.exShowroom[variant] || 0 : 0;
  const rtoRate = rtoTaxRates[city] ?? 0.10;
  const rtoTax = Math.round(exShowroom * rtoRate);
  const insurance = vehicleType === '4W' ? Math.round(exShowroom * 0.035) : Math.round(exShowroom * 0.025);
  const onRoad = exShowroom + rtoTax + insurance;
  const loanLimit = Math.round(onRoad * 0.85);

  const isComplete = !!(city && make && model && fuelType && variant);
  useEffect(() => { onReady(isComplete); }, [isComplete]);
  useEffect(() => {
    if (isComplete && exShowroom > 0) {
      onDataChange({
        kind: 'new',
        make, model, fuelType, variant, city,
        exShowroom,
        rtoTax,
        insurance,
        onRoad,
      });
    } else {
      onDataChange(null);
    }
  }, [isComplete, exShowroom, rtoTax, insurance, onRoad, make, model, fuelType, variant, city]);

  // Reset cascades
  useEffect(() => { setModel(''); setFuelType(''); setVariant(''); }, [make]);
  useEffect(() => { setFuelType(''); setVariant(''); }, [model]);
  useEffect(() => { setVariant(''); }, [fuelType]);

  const SelField = ({ id, label, icon: Icon, val, onChange, opts, disabled }: {
    id: string; label: string; icon: React.ElementType;
    val: string; onChange: (v: string) => void;
    opts: string[]; disabled?: boolean;
  }) => (
    <div>
      <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">
        <span className="flex items-center gap-1.5">
          <Icon size={10} className="text-theme-muted" />
          {label}
        </span>
      </label>
      <select
        id={id}
        value={val}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full bg-theme-elevated border text-xs font-bold px-3 py-3 rounded focus:outline-none transition-colors ${
          disabled ? 'border-theme-border text-theme-muted cursor-not-allowed'
          : val ? 'border-theme-primary text-theme-primary'
          : 'border-theme-border text-theme-secondary focus:border-theme-primary'
        }`}
      >
        <option value="" className="bg-theme-elevated">{disabled ? '—' : `Select ${label}`}</option>
        {opts.map(o => <option key={o} value={o} className="bg-theme-elevated text-theme-primary">{o}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {/* City autocomplete */}
      <div className="relative">
        <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">
          <span className="flex items-center gap-1.5">
            <MapPin size={10} className="text-theme-muted" />
            City / Location
          </span>
        </label>
        <div className="relative">
          <MapPin size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-secondary pointer-events-none" />
          <input
            id="city-input-s2"
            type="text"
            value={citySearch}
            onFocus={() => setShowSugg(true)}
            onChange={e => { setCitySearch(e.target.value); setCity(''); setShowSugg(true); }}
            onBlur={() => setTimeout(() => setShowSugg(false), 150)}
            placeholder="Search city..."
            className="w-full bg-theme-elevated border border-theme-border focus:border-theme-primary text-theme-primary text-xs font-bold pl-9 pr-9 py-3 rounded focus:outline-none transition-colors placeholder-theme-muted"
          />
          {city && <CheckCircle2 size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-theme-accent" />}
        </div>

        <AnimatePresence>
          {showSugg && filteredCities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="absolute z-50 top-full mt-1 left-0 right-0 bg-theme-card border border-theme-border rounded shadow-2xl overflow-hidden max-h-40 overflow-y-auto"
            >
              {filteredCities.map(c => (
                <button key={c} onMouseDown={() => { setCity(c); setCitySearch(c); setShowSugg(false); }}
                  className={`w-full text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center gap-2 ${
                    city === c ? 'bg-theme-elevated text-theme-primary' : 'text-theme-secondary hover:bg-theme-elevated'
                  }`}>
                  <MapPin size={11} className="text-theme-muted flex-shrink-0" />
                  {c}
                  {rtoTaxRates[c] && <span className="ml-auto text-[10px] font-mono text-theme-muted">RTO {(rtoTaxRates[c] * 100).toFixed(0)}%</span>}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cascading selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelField id="make-s2" label="Make / Brand" icon={Car} val={make} onChange={setMake} opts={makes} />
        <SelField id="model-s2" label="Model" icon={Tag} val={model} onChange={setModel} opts={models} disabled={!make} />
        <SelField id="fuel-s2" label="Fuel Type" icon={Fuel} val={fuelType} onChange={setFuelType} opts={fuelTypes} disabled={!model} />
        <SelField id="variant-s2" label="Variant / Trim" icon={Layers} val={variant} onChange={setVariant} opts={variants} disabled={!fuelType} />
      </div>

      {/* Real-time price estimation */}
      <AnimatePresence>
        {isComplete && exShowroom > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ type: 'spring', bounce: 0.25 }}
            className="rounded border border-theme-border bg-theme-card overflow-hidden mt-6"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border bg-theme-elevated">
              <div>
                <h4 className="text-sm font-bold text-theme-primary">
                  {make} {model} – {variant}
                </h4>
                <p className="text-[10px] font-mono text-theme-secondary mt-0.5 uppercase tracking-wide">{city} · {fuelType}</p>
              </div>
              <Info size={14} className="text-theme-muted" />
            </div>

            <div className="p-5 space-y-0">
              {[
                { label: 'Ex-Showroom Price', amount: exShowroom, sub: null },
                { label: `RTO / Road Tax (${city}, ${(rtoRate * 100).toFixed(0)}%)`, amount: rtoTax, sub: 'State-specific rate' },
                { label: '5-Year Comprehensive Insurance', amount: insurance, sub: 'Mandatory TP + OD cover' },
              ].map(({ label, amount, sub }) => (
                <div key={label} className="flex items-start justify-between py-3 border-b border-theme-border last:border-0">
                  <div>
                    <p className="text-xs text-theme-primary font-bold">{label}</p>
                    {sub && <p className="text-[10px] font-mono text-theme-secondary mt-1 uppercase tracking-wide">{sub}</p>}
                  </div>
                  <span className="text-sm font-bold font-mono text-theme-primary ml-4 flex-shrink-0 tabular-nums">
                    {formatINR(amount)}
                  </span>
                </div>
              ))}

              <div className="flex items-end justify-between pt-5 pb-1">
                <div>
                  <p className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest">On-Road Price</p>
                  <p className="text-2xl font-bold font-mono text-theme-primary mt-1">
                    {formatINR(onRoad)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold font-mono text-theme-accent uppercase tracking-widest">Loan Up To</p>
                  <p className="text-xl font-bold font-mono text-theme-accent mt-1">
                    {formatINR(loanLimit)}
                  </p>
                  <p className="text-[9px] font-mono text-theme-muted mt-1 uppercase tracking-widest">85% LTV · INDICATIVE</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Step 2 Container ───────────────────────────────────────────
export default function Step2VehicleDetails({ vehicleType, condition, onBack, onProceed }: Step2VehicleDetailsProps) {
  const [subFormReady, setSubFormReady] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData | null>(null);

  const isUsed = condition === 'used';
  const typeLabel = vehicleType === '2W' ? 'Two-Wheeler' : 'Four-Wheeler';
  const condLabel = isUsed ? 'USED' : 'NEW';

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 max-w-2xl mx-auto py-8"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Section header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest px-2 py-1 border border-theme-border rounded bg-theme-elevated">
            {typeLabel}
          </span>
          <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest px-2 py-1 border border-theme-border rounded bg-theme-elevated">
            {condLabel}
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight">
          {isUsed ? 'Identify your vehicle' : 'Configure your new vehicle'}
        </h2>
        <p className="text-theme-secondary text-sm mt-2 leading-relaxed">
          {isUsed
            ? 'Enter your registration number and we\'ll auto-fetch your vehicle details from VAHAN 4.0.'
            : 'Select your vehicle and we\'ll calculate the real-time on-road price and loan estimate.'
          }
        </p>
      </div>

      {/* Conditional sub-form */}
      <AnimatePresence mode="wait">
        {isUsed ? (
          <motion.div key="used-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <UsedVehicleForm vehicleType={vehicleType} onReady={setSubFormReady} onDataChange={setVehicleData} />
          </motion.div>
        ) : (
          <motion.div key="new-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <NewVehicleForm vehicleType={vehicleType} onReady={setSubFormReady} onDataChange={setVehicleData} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom navigation */}
      <div className="flex items-center gap-3 pt-6 border-t border-theme-border mt-8">
        <motion.button
          id="step2-back-btn"
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded border border-theme-border bg-theme-elevated hover:bg-theme-card text-theme-primary font-bold text-xs uppercase tracking-widest transition-colors flex-shrink-0"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <motion.button
          id="step2-proceed-btn"
          onClick={() => subFormReady && vehicleData && onProceed(vehicleData)}
          disabled={!subFormReady || !vehicleData}
          whileHover={subFormReady ? { scale: 1.01 } : {}}
          whileTap={subFormReady ? { scale: 0.99 } : {}}
          className={`flex-1 py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors duration-300 ${
            subFormReady
              ? 'bg-theme-accent hover:bg-[#256639] text-theme-primary'
              : 'bg-theme-elevated border border-theme-border text-theme-muted cursor-not-allowed'
          }`}
        >
          {subFormReady ? 'Proceed to Valuation' : 'Complete fields to continue'}
          {subFormReady && <ArrowRight size={14} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
