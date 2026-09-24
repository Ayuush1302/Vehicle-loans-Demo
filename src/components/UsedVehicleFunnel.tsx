import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Search, CheckCircle2, AlertCircle,
  Car, Fuel, Calendar, Shield, Hash
} from 'lucide-react';
import { vahanData } from '../data/vehicleData';

const SCAN_STEPS = [
  'Querying Vahan 4.0...',
  'Extracting RTO Fitness & Hypothecation...',
  'Calculating Residual Asset Value...',
];

const ODOMETER_OPTIONS = [
  { id: 'lt30', label: '< 30k km' },
  { id: '30-60', label: '30k–60k km' },
  { id: 'gt60', label: '60k+ km' },
];

interface UsedVehicleFunnelProps {
  prefillPlate?: string;
}

export default function UsedVehicleFunnel({ prefillPlate }: UsedVehicleFunnelProps) {
  const [plate, setPlate] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [vehicleData, setVehicleData] = useState<typeof vahanData[string] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedOdometer, setSelectedOdometer] = useState('');

  // Prefill from persona
  useEffect(() => {
    if (prefillPlate) {
      const formatted = prefillPlate
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .replace(/^([A-Z]{2})(\d{2})([A-Z]{1,2})(\d{1,4})$/, '$1 $2 $3 $4');
      setPlate(formatted);
      setVehicleData(null);
      setError(null);
      setSelectedVariant('');
      setSelectedOdometer('');
    }
  }, [prefillPlate]);

  const formatPlate = (value: string) => {
    const raw = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (raw.length <= 2) return raw;
    if (raw.length <= 4) return `${raw.slice(0, 2)} ${raw.slice(2)}`;
    if (raw.length <= 6) return `${raw.slice(0, 2)} ${raw.slice(2, 4)} ${raw.slice(4)}`;
    return `${raw.slice(0, 2)} ${raw.slice(2, 4)} ${raw.slice(4, 6)} ${raw.slice(6, 10)}`;
  };

  const handlePlateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlate(formatPlate(e.target.value));
    setVehicleData(null);
    setError(null);
  };

  const handleFetch = async () => {
    if (!plate || plate.replace(/\s/g, '').length < 6) {
      setError('Please enter a valid vehicle registration number.');
      return;
    }

    setScanning(true);
    setVehicleData(null);
    setError(null);
    setScanStep(0);

    for (let i = 0; i < SCAN_STEPS.length; i++) {
      setScanStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    await new Promise((r) => setTimeout(r, 300));

    const key = plate.replace(/\s/g, '');
    const data = vahanData[key];

    setScanning(false);

    if (data) {
      setVehicleData(data);
      setSelectedVariant(data.variants[0]);
      setSelectedOdometer('lt30');
    } else {
      // Default mock for unknown plates
      setVehicleData({
        make: 'Hyundai',
        model: 'Creta',
        fuelType: 'Petrol',
        year: 2020,
        hypothecation: 'Clear',
        color: 'Titan Grey',
        engineCC: 1497,
        variants: ['E', 'EX', 'S', 'SX', 'SX(O)'],
      });
      setSelectedVariant('S');
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
    <div className="space-y-5">
      {/* License Plate Input */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2 tracking-wide">
          Vehicle Registration Number
        </label>

        <div className="relative flex items-stretch rounded-xl overflow-hidden border border-slate-700/80 focus-within:border-indigo-500/70 transition-all duration-200 bg-slate-900/60 shadow-inner">
          {/* IND Badge */}
          <div className="flex flex-col items-center justify-center bg-slate-800/80 border-r border-slate-700/80 px-3 py-3 gap-0.5 min-w-[56px]">
            <div className="flex gap-0.5">
              <span className="block w-1.5 h-4 rounded-sm" style={{ background: 'linear-gradient(to bottom, #FF9933 33%, white 33%, white 66%, #138808 66%)' }} />
            </div>
            <span className="text-[10px] font-bold text-slate-300 tracking-widest mt-1">IND</span>
          </div>

          <input
            id="plate-input"
            type="text"
            value={plate}
            onChange={handlePlateChange}
            placeholder="DL 01 AB 1234"
            maxLength={13}
            className="flex-1 bg-transparent px-4 py-3.5 text-lg font-bold text-white placeholder-slate-600 focus:outline-none tracking-[0.2em] uppercase"
            style={{ fontFamily: 'Space Grotesk, monospace' }}
          />

          <button
            id="fetch-vehicle-btn"
            onClick={handleFetch}
            disabled={scanning}
            className="flex items-center gap-2 px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 text-white font-semibold text-sm transition-all duration-200 border-l border-indigo-500/50"
          >
            {scanning ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Zap size={16} className="text-yellow-300" />
            )}
            {scanning ? 'Scanning...' : 'Fetch Details'}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400 flex items-center gap-1.5"
          >
            <AlertCircle size={14} />
            {error}
          </motion.p>
        )}
      </div>

      {/* Scanning Progress */}
      <AnimatePresence>
        {scanning && (
          <motion.div
            key="scanner"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="relative rounded-xl border border-slate-700/80 bg-slate-900/70 overflow-hidden p-5"
          >
            {/* Scan beam */}
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-indigo-500 to-transparent scan-beam opacity-80" />

            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-indigo-500/30 spin-slow" />
                <div className="absolute inset-1 rounded-full border-2 border-t-indigo-400 border-transparent animate-spin" />
                <Search size={12} className="absolute inset-0 m-auto text-indigo-400" />
              </div>
              <span className="text-sm font-semibold text-indigo-300">Querying VAHAN 4.0 Database</span>
            </div>

            <div className="space-y-2.5">
              {SCAN_STEPS.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: i <= scanStep ? 1 : 0.3, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i < scanStep
                      ? 'bg-emerald-500'
                      : i === scanStep
                      ? 'bg-indigo-500 animate-pulse'
                      : 'bg-slate-700'
                  }`}>
                    {i < scanStep && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <span className={`text-sm ${i <= scanStep ? 'text-slate-200' : 'text-slate-600'}`}>
                    {step}
                  </span>
                  {i === scanStep && (
                    <span className="text-xs text-indigo-400 font-mono ml-auto animate-pulse">LIVE</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Shimmer bar */}
            <div className="mt-4 h-1.5 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-600 via-violet-500 to-indigo-600"
                initial={{ width: '0%' }}
                animate={{ width: `${((scanStep + 1) / SCAN_STEPS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Vehicle Details Card */}
      <AnimatePresence>
        {vehicleData && !scanning && (
          <motion.div
            key="vehicle-card"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', bounce: 0.3, duration: 0.5 }}
            className="rounded-xl border border-emerald-500/20 bg-gradient-to-br from-slate-900/80 to-slate-800/50 overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-700/50 bg-emerald-900/10">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-400">Vehicle Identified</span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  vehicleData.hypothecation === 'Clear'
                    ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                    : 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                }`}
              >
                {vehicleData.hypothecation === 'Clear' ? '✓ Hyp. Clear' : '⚠ Hyp. Active'}
              </span>
            </div>

            <div className="p-5 space-y-5">
              {/* Vehicle overview grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Car, label: 'Make', value: vehicleData.make },
                  { icon: Hash, label: 'Model', value: vehicleData.model },
                  { icon: Fuel, label: 'Fuel Type', value: vehicleData.fuelType },
                  { icon: Calendar, label: 'Reg. Year', value: String(vehicleData.year) },
                  { icon: Shield, label: 'Engine', value: `${vehicleData.engineCC} cc` },
                  { icon: Car, label: 'Color', value: vehicleData.color },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-slate-800/60 rounded-lg p-3 border border-slate-700/50 hover:border-indigo-500/30 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon size={12} className="text-indigo-400" />
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-white">{value}</span>
                  </div>
                ))}
              </div>

              {/* Overrides */}
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Trim / Variant
                  </label>
                  <div className="relative">
                    <select
                      id="trim-select"
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-full bg-slate-800/80 border border-slate-700/80 text-white text-sm px-3 py-2.5 rounded-lg focus:outline-none focus:border-indigo-500/70 transition-colors"
                    >
                      {vehicleData.variants.map((v) => (
                        <option key={v} value={v} className="bg-slate-900">{v}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                    Odometer Range
                  </label>
                  <div className="flex gap-2">
                    {ODOMETER_OPTIONS.map((opt) => (
                      <button
                        key={opt.id}
                        id={`odo-${opt.id}`}
                        onClick={() => setSelectedOdometer(opt.id)}
                        className={`flex-1 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                          selectedOdometer === opt.id
                            ? 'bg-indigo-600/80 border-indigo-500 text-white'
                            : 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:border-indigo-500/40 hover:text-white'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Loan Estimate Banner */}
              {selectedOdometer && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-gradient-to-r from-indigo-900/50 via-violet-900/30 to-indigo-900/50 border border-indigo-500/25 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">Estimated Loan Limit</p>
                    <p className="text-2xl font-bold text-white mt-0.5" style={{ fontFamily: 'Space Grotesk' }}>
                      ₹{loanEstimate.toLocaleString('en-IN')}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">Based on current asset valuation</p>
                  </div>
                  <div className="text-right">
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 size={22} className="text-emerald-400" />
                    </div>
                    <p className="text-xs text-emerald-400 font-semibold mt-1">Pre-Approved</p>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
