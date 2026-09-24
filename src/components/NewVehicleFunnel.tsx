import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, ChevronDown, X, Info,
  Car, Fuel, Tag, Layers,
  CheckCircle2
} from 'lucide-react';
import { cities, vehicleCatalog, rtoTaxRates } from '../data/vehicleData';

interface NewVehicleFunnelProps {
  vehicleType: '2W' | '4W';
  prefill?: {
    make?: string;
    model?: string;
    city?: string;
  };
}

function formatINR(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function NewVehicleFunnel({ vehicleType, prefill }: NewVehicleFunnelProps) {
  const [city, setCity] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [variant, setVariant] = useState('');
  const [showPriceModal, setShowPriceModal] = useState(false);

  const cityRef = useRef<HTMLDivElement>(null);

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
  const variants = make && model && fuelType
    ? catalog[make].models[model]?.variants[fuelType] || []
    : [];

  // Apply prefill from persona
  useEffect(() => {
    if (prefill) {
      if (prefill.city) {
        setCity(prefill.city);
        setCitySearch(prefill.city);
      }
      if (prefill.make) {
        setMake(prefill.make);
      }
      if (prefill.model) {
        setModel(prefill.model);
      }
      setFuelType('');
      setVariant('');
      setShowPriceModal(false);
    }
  }, [prefill]);

  // Reset cascades
  useEffect(() => {
    setModel('');
    setFuelType('');
    setVariant('');
    setShowPriceModal(false);
  }, [make]);

  useEffect(() => {
    setFuelType('');
    setVariant('');
    setShowPriceModal(false);
  }, [model]);

  useEffect(() => {
    setVariant('');
    setShowPriceModal(false);
  }, [fuelType]);

  useEffect(() => {
    if (variant) setShowPriceModal(false);
  }, [variant]);

  // Click outside to close
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) {
        setShowCitySuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const filteredCities = cities.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  );

  const exShowroom = make && model && variant
    ? catalog[make]?.models[model]?.exShowroom[variant] || 0
    : 0;

  const rtoRate = rtoTaxRates[city] ?? 0.10;
  const rtoTax = Math.round(exShowroom * rtoRate);
  const insurance = vehicleType === '4W' ? Math.round(exShowroom * 0.035) : Math.round(exShowroom * 0.025);
  const onRoad = exShowroom + rtoTax + insurance;
  const loanLimit = Math.round(onRoad * 0.85);

  const isComplete = city && make && model && fuelType && variant;

  const SelectField = ({
    id, label, icon: Icon, value, onChange, options, disabled, placeholder,
  }: {
    id: string;
    label: string;
    icon: React.ElementType;
    value: string;
    onChange: (v: string) => void;
    options: string[];
    disabled?: boolean;
    placeholder?: string;
  }) => (
    <div>
      <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
        <span className="flex items-center gap-1.5">
          <Icon size={11} className="text-indigo-400" />
          {label}
        </span>
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`w-full bg-slate-800/80 border text-sm px-3 py-2.5 rounded-lg focus:outline-none transition-all duration-200 ${
            disabled
              ? 'border-slate-800/50 text-slate-600 cursor-not-allowed'
              : value
              ? 'border-indigo-500/50 text-white'
              : 'border-slate-700/80 text-slate-400 focus:border-indigo-500/70'
          }`}
        >
          <option value="" className="bg-slate-900 text-slate-400">
            {disabled ? `— Select ${label.split(' ').slice(-1)[0]} first —` : placeholder || `Select ${label}`}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-slate-900 text-white">{opt}</option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      {/* City / Pincode */}
      <div ref={cityRef}>
        <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <MapPin size={11} className="text-indigo-400" />
            City / Location
          </span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <MapPin size={15} className="text-indigo-400" />
          </div>
          <input
            id="city-input"
            type="text"
            value={citySearch}
            onFocus={() => setShowCitySuggestions(true)}
            onChange={(e) => {
              setCitySearch(e.target.value);
              setCity('');
              setShowCitySuggestions(true);
            }}
            placeholder="Search city or pincode..."
            className="w-full bg-slate-800/80 border border-slate-700/80 text-white text-sm pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500/70 transition-colors placeholder-slate-600"
          />
          {city && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <CheckCircle2 size={15} className="text-emerald-400" />
            </div>
          )}

          <AnimatePresence>
            {showCitySuggestions && filteredCities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="absolute z-50 top-full mt-1 left-0 right-0 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden max-h-44 overflow-y-auto"
              >
                {filteredCities.map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      setCity(c);
                      setCitySearch(c);
                      setShowCitySuggestions(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-indigo-600/20 transition-colors ${
                      city === c ? 'text-indigo-400 bg-indigo-900/20' : 'text-slate-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <MapPin size={12} className="text-slate-500 flex-shrink-0" />
                      {c}
                      {rtoTaxRates[c] && (
                        <span className="ml-auto text-xs text-slate-600">RTO {(rtoTaxRates[c] * 100).toFixed(0)}%</span>
                      )}
                    </span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Cascading Selects */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SelectField
          id="make-select"
          label="Make / Brand"
          icon={Car}
          value={make}
          onChange={setMake}
          options={makes}
          placeholder="Select Make"
        />
        <SelectField
          id="model-select"
          label="Model"
          icon={Tag}
          value={model}
          onChange={setModel}
          options={models}
          disabled={!make}
          placeholder="Select Model"
        />
        <SelectField
          id="fuel-select"
          label="Fuel Type"
          icon={Fuel}
          value={fuelType}
          onChange={setFuelType}
          options={fuelTypes}
          disabled={!model}
          placeholder="Select Fuel Type"
        />
        <SelectField
          id="variant-select"
          label="Variant / Trim"
          icon={Layers}
          value={variant}
          onChange={setVariant}
          options={variants}
          disabled={!fuelType}
          placeholder="Select Variant"
        />
      </div>

      {/* Price CTA */}
      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="space-y-3"
          >
            <button
              id="view-price-btn"
              onClick={() => setShowPriceModal(true)}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold text-sm hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/50"
            >
              <Info size={16} />
              View On-Road Price Breakdown
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Price Breakdown Modal */}
      <AnimatePresence>
        {showPriceModal && isComplete && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ type: 'spring', bounce: 0.25, duration: 0.45 }}
            className="rounded-2xl border border-indigo-500/25 bg-gradient-to-br from-slate-900/90 via-slate-800/60 to-slate-900/90 overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-700/50 bg-indigo-900/10">
              <div>
                <h3 className="font-bold text-white text-sm" style={{ fontFamily: 'Space Grotesk' }}>
                  {make} {model} – {variant}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{city} · {fuelType}</p>
              </div>
              <button
                onClick={() => setShowPriceModal(false)}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 flex items-center justify-center transition-colors"
              >
                <X size={14} className="text-slate-400" />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {/* Line items */}
              {[
                { label: 'Ex-Showroom Price', amount: exShowroom, accent: false },
                {
                  label: `RTO / Road Tax (${city}, ${(rtoRate * 100).toFixed(0)}%)`,
                  amount: rtoTax,
                  accent: false,
                  sub: 'Varies by state and vehicle value',
                },
                {
                  label: '5-Year Comprehensive Insurance',
                  amount: insurance,
                  accent: false,
                  sub: 'Includes mandatory TP + comprehensive OD',
                },
              ].map(({ label, amount, sub }) => (
                <div key={label} className="flex items-start justify-between py-2.5 border-b border-slate-700/40 last:border-0">
                  <div>
                    <p className="text-sm text-slate-300 font-medium">{label}</p>
                    {sub && <p className="text-xs text-slate-600 mt-0.5">{sub}</p>}
                  </div>
                  <span className="text-sm font-bold text-white ml-4 flex-shrink-0" style={{ fontFamily: 'Space Grotesk' }}>
                    {formatINR(amount)}
                  </span>
                </div>
              ))}

              {/* Total */}
              <div className="rounded-xl bg-gradient-to-r from-indigo-900/50 to-violet-900/30 border border-indigo-500/20 p-4 flex items-center justify-between mt-1">
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">On-Road Total</p>
                  <p className="text-2xl font-bold text-white mt-0.5" style={{ fontFamily: 'Space Grotesk' }}>
                    {formatINR(onRoad)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-emerald-400 font-semibold uppercase tracking-wide">Loan Up To</p>
                  <p className="text-lg font-bold text-emerald-400 mt-0.5" style={{ fontFamily: 'Space Grotesk' }}>
                    {formatINR(loanLimit)}
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">85% of on-road value</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 text-center pt-1">
                * Prices are indicative. Final on-road price may vary by dealership.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
