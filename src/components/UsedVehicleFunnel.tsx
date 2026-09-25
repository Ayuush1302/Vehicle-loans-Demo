import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Search, CheckCircle2, AlertCircle,
  Car, Fuel, Calendar, Shield, Hash,
  IndianRupee, Activity, FileText
} from 'lucide-react';
import { vahanData } from '../data/vehicleData';

const SCAN_STEPS = [
  'Querying Vahan 4.0...',
  'Extracting RTO Fitness & Hypothecation...',
  'Calculating Residual Asset Value...',
];

interface UsedVehicleFunnelProps {
  prefillPlate?: string;
  onNext?: () => void;
}

export default function UsedVehicleFunnel({ prefillPlate, onNext }: UsedVehicleFunnelProps) {
  const [plate, setPlate] = useState('');
  const [scanning, setScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [vehicleData, setVehicleData] = useState<typeof vahanData[string] | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedVariant, setSelectedVariant] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [odometer, setOdometer] = useState('');
  const [insuranceDate, setInsuranceDate] = useState('');
  const [hypothecation, setHypothecation] = useState('Clear');

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
      setHypothecation(data.hypothecation);
    } else {
      // Default mock for unknown plates
      const mockData = {
        make: 'Hyundai',
        model: 'Creta',
        fuelType: 'Petrol',
        year: 2020,
        hypothecation: 'Clear' as const,
        color: 'Titan Grey',
        engineCC: 1497,
        variants: ['E', 'EX', 'S', 'SX', 'SX(O)'],
      };
      setVehicleData(mockData);
      setSelectedVariant('S');
      setHypothecation('Clear');
    }
  };

  // Ensure loan estimation calculates correctly for UI display
  const priceNum = parseInt(purchasePrice.replace(/\D/g, '')) || 0;
  const loanEstimate = Math.round(priceNum * 0.85); // Up to 85% LTV

  return (
    <div className="space-y-5">
      {/* License Plate Input */}
      <div>
        <label className="block text-xs font-bold text-theme-secondary mb-2 tracking-wide uppercase">
          Registration Number
        </label>

        <div className="relative flex items-stretch rounded-lg overflow-hidden border border-theme-border focus-within:border-theme-muted transition-all duration-200 bg-theme-card">
          {/* IND Badge */}
          <div className="flex flex-col items-center justify-center bg-[#003399] px-3 py-3 gap-0.5 min-w-[56px]">
            <div className="flex gap-0.5">
              <span className="block w-1.5 h-4 rounded-sm" style={{ background: 'linear-gradient(to bottom, #FF9933 33%, white 33%, white 66%, #138808 66%)' }} />
            </div>
            <span className="text-[10px] font-bold text-white tracking-widest mt-1">IND</span>
          </div>

          <input
            id="plate-input"
            type="text"
            value={plate}
            onChange={handlePlateChange}
            placeholder="DL 01 AB 1234"
            maxLength={13}
            className="flex-1 bg-transparent px-4 py-3.5 text-lg font-bold text-theme-primary placeholder-theme-muted focus:outline-none tracking-[0.2em] uppercase"
            style={{ fontFamily: 'Space Grotesk, monospace' }}
          />

          <button
            id="fetch-vehicle-btn"
            onClick={handleFetch}
            disabled={scanning}
            className="flex items-center gap-2 px-5 py-3 bg-theme-elevated hover:bg-theme-border disabled:opacity-50 text-theme-primary font-semibold text-sm transition-all duration-200 border-l border-theme-border"
          >
            {scanning ? (
              <div className="w-4 h-4 border-2 border-theme-primary/30 border-t-theme-primary rounded-full animate-spin" />
            ) : (
              <Zap size={16} className="text-theme-primary" />
            )}
            {scanning ? 'FETCHING' : 'FETCH'}
          </button>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-500 flex items-center gap-1.5 font-medium"
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
            className="relative rounded-xl border border-theme-border bg-theme-card overflow-hidden p-5"
          >
            <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-theme-accent to-transparent scan-beam opacity-80" />

            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 rounded-full border-2 border-theme-accent/30 spin-slow" />
                <div className="absolute inset-1 rounded-full border-2 border-t-theme-accent border-transparent animate-spin" />
                <Search size={12} className="absolute inset-0 m-auto text-theme-accent" />
              </div>
              <span className="text-sm font-semibold text-theme-primary">Querying VAHAN 4.0 Database</span>
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
                      ? 'bg-theme-accent'
                      : i === scanStep
                      ? 'bg-theme-primary animate-pulse'
                      : 'bg-theme-elevated border border-theme-border'
                  }`}>
                    {i < scanStep && <CheckCircle2 size={10} className="text-white" />}
                  </div>
                  <span className={`text-sm ${i <= scanStep ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                    {step}
                  </span>
                  {i === scanStep && (
                    <span className="text-xs text-theme-accent font-mono ml-auto animate-pulse">LIVE</span>
                  )}
                </motion.div>
              ))}
            </div>

            {/* Shimmer bar */}
            <div className="mt-4 h-1.5 rounded-full bg-theme-elevated overflow-hidden">
              <motion.div
                className="h-full bg-theme-accent"
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
            className="rounded-xl border border-theme-border bg-theme-card overflow-hidden"
          >
            {/* Card Header */}
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-theme-border bg-theme-elevated/50">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-theme-accent" />
                <span className="text-sm font-bold text-theme-primary">VEHICLE IDENTIFIED</span>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-sm border ${
                  hypothecation === 'Clear'
                    ? 'bg-green-500/10 border-green-500/30 text-green-700 dark:text-green-400'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400'
                }`}
              >
                {hypothecation === 'Clear' ? 'HYP. CLEAR' : 'HYP. ACTIVE'}
              </span>
            </div>

            <div className="p-5 space-y-5">
              {/* Vehicle overview grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { icon: Car, label: 'Make', value: vehicleData.make },
                  { icon: Hash, label: 'Model', value: vehicleData.model },
                  { icon: Fuel, label: 'Fuel', value: vehicleData.fuelType },
                  { icon: Calendar, label: 'Year', value: String(vehicleData.year) },
                  { icon: Shield, label: 'Engine', value: `${vehicleData.engineCC} cc` },
                  { icon: Car, label: 'Colour', value: vehicleData.color },
                ].map(({ icon: Icon, label, value }) => (
                  <div
                    key={label}
                    className="bg-theme-elevated rounded-md p-3 border border-theme-border hover:border-theme-muted transition-colors flex flex-col items-center justify-center text-center"
                  >
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon size={12} className="text-theme-secondary" />
                      <span className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest">{label}</span>
                    </div>
                    <span className="text-sm font-bold text-theme-primary">{value}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-theme-border pt-5 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Trim/Variant */}
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-theme-secondary mb-2 uppercase tracking-wide">
                      Exact Trim / Variant
                    </label>
                    <select
                      id="trim-select"
                      value={selectedVariant}
                      onChange={(e) => setSelectedVariant(e.target.value)}
                      className="w-full bg-theme-elevated border border-theme-border text-theme-primary font-medium text-sm px-4 py-3 rounded-md focus:outline-none focus:border-theme-muted transition-colors"
                    >
                      {vehicleData.variants.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  {/* Agreed Purchase Price */}
                  <div>
                    <label className="block text-xs font-bold text-theme-secondary mb-2 uppercase tracking-wide">
                      Agreed Purchase Price
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <IndianRupee size={16} className="text-theme-secondary" />
                      </div>
                      <input 
                        type="text"
                        inputMode="numeric"
                        value={purchasePrice}
                        onChange={(e) => setPurchasePrice(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 150000"
                        className="w-full bg-theme-elevated border border-theme-border text-theme-primary font-medium text-sm pl-10 pr-4 py-3 rounded-md focus:outline-none focus:border-theme-muted transition-colors"
                      />
                    </div>
                  </div>

                  {/* Odometer Reading */}
                  <div>
                    <label className="block text-xs font-bold text-theme-secondary mb-2 uppercase tracking-wide">
                      Odometer Reading (KM)
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Activity size={16} className="text-theme-secondary" />
                      </div>
                      <input 
                        type="text"
                        inputMode="numeric"
                        value={odometer}
                        onChange={(e) => setOdometer(e.target.value.replace(/\D/g, ''))}
                        placeholder="e.g. 24500"
                        className="w-full bg-theme-elevated border border-theme-border text-theme-primary font-medium text-sm pl-10 pr-4 py-3 rounded-md focus:outline-none focus:border-theme-muted transition-colors"
                      />
                    </div>
                  </div>

                  {/* Insurance Valid Till */}
                  <div>
                    <label className="block text-xs font-bold text-theme-secondary mb-2 uppercase tracking-wide">
                      Insurance Valid Till
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-theme-secondary" />
                      </div>
                      <input 
                        type="date"
                        value={insuranceDate}
                        onChange={(e) => setInsuranceDate(e.target.value)}
                        className="w-full bg-theme-elevated border border-theme-border text-theme-primary font-medium text-sm pl-10 pr-4 py-3 rounded-md focus:outline-none focus:border-theme-muted transition-colors"
                      />
                    </div>
                  </div>

                  {/* Hypothecation Status (Editable) */}
                  <div>
                    <label className="block text-xs font-bold text-theme-secondary mb-2 uppercase tracking-wide">
                      Hypothecation Status
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <FileText size={16} className="text-theme-secondary" />
                      </div>
                      <select
                        value={hypothecation}
                        onChange={(e) => setHypothecation(e.target.value)}
                        className="w-full bg-theme-elevated border border-theme-border text-theme-primary font-medium text-sm pl-10 pr-4 py-3 rounded-md focus:outline-none focus:border-theme-muted transition-colors"
                      >
                        <option value="Clear">Clear</option>
                        <option value="Active">Active</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Loan Estimate Banner */}
              {purchasePrice && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-lg bg-theme-elevated border border-theme-border p-4 flex items-center justify-between mt-6"
                >
                  <div>
                    <p className="text-xs text-theme-secondary font-bold uppercase tracking-widest">Estimated Loan Limit</p>
                    <p className="text-2xl font-bold text-theme-primary mt-1" style={{ fontFamily: 'Space Grotesk' }}>
                      ₹{loanEstimate.toLocaleString('en-IN')}
                    </p>
                    <p className="text-[11px] font-medium text-theme-secondary mt-1">Based on market valuation &amp; LTV (85%)</p>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <div className="w-10 h-10 rounded border border-theme-accent/30 flex items-center justify-center bg-theme-accent/10">
                      <CheckCircle2 size={20} className="text-theme-accent" />
                    </div>
                    <p className="text-[10px] font-bold text-theme-accent tracking-widest mt-2 uppercase">Pre-Eligible</p>
                  </div>
                </motion.div>
              )}

              {/* Continue to Valuation Action */}
              <div className="pt-4 border-t border-theme-border mt-4 flex justify-end">
                <button
                  onClick={onNext}
                  disabled={!purchasePrice || !odometer || !insuranceDate}
                  className="px-8 py-3 bg-theme-primary hover:opacity-90 disabled:opacity-50 text-theme-bg font-bold text-sm rounded-lg transition-opacity flex items-center gap-2"
                >
                  Continue to Valuation
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
