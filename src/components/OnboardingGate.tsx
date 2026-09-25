import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Phone, CreditCard, Shield,
  AlertCircle, ArrowRight,
  Zap, Building2, Check, ExternalLink, Hash
} from 'lucide-react';

interface OnboardingGateProps {
  onSuccess: (user: { name: string; pan: string }) => void;
}

const VERIFY_STEPS = [
  { label: 'Fetching KYC from UIDAI/CKYC...', duration: 700 },
  { label: 'Initiating Soft Credit Pull...', duration: 800 },
];

function formatPAN(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 10);
}

function formatAadhaar(raw: string) {
  const v = raw.replace(/\D/g, '').slice(0, 12);
  if (v.length > 8) return `${v.slice(0, 4)} ${v.slice(4, 8)} ${v.slice(8)}`;
  if (v.length > 4) return `${v.slice(0, 4)} ${v.slice(4)}`;
  return v;
}

function validateMobile(m: string) {
  return /^[6-9]\d{9}$/.test(m);
}

function validatePAN(p: string) {
  return /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(p);
}

function validateAadhaar(a: string) {
  return a.replace(/\D/g, '').length === 12;
}

// ── Shared UI Components ──────────────────────────────────────────

function InputField({
  id, label, icon: Icon, value, onChange, placeholder,
  maxLength, error, hint, prefix, type = 'text', monospace
}: {
  id: string; label: string; icon: React.ElementType; value: string;
  onChange: (v: string) => void; placeholder: string; maxLength?: number;
  error?: string; hint?: string; prefix?: string; type?: string; monospace?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 mb-5">
      <label htmlFor={id} className="text-xs font-bold text-theme-secondary tracking-wide uppercase">
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <Icon size={16} className={`transition-colors ${value ? 'text-theme-primary' : 'text-theme-secondary'}`} />
        </div>
        {prefix && (
          <div className="absolute inset-y-0 left-10 flex items-center border-r border-theme-border pr-2 pointer-events-none">
            <span className="text-sm font-semibold text-theme-secondary">{prefix}</span>
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full pl-[2.6rem] pr-4 py-3.5 rounded-lg border bg-theme-card text-theme-primary transition-all duration-200 outline-none
            ${prefix ? 'pl-[5rem]' : ''}
            ${monospace ? 'font-mono tracking-widest uppercase' : 'font-medium'}
            ${error ? 'border-red-500/50 focus:border-red-500' : 'border-theme-border focus:border-theme-muted hover:border-[#3A3935]'}
          `}
        />
      </div>
      {error && (
        <p className="text-xs text-red-400 font-medium flex items-center gap-1 mt-0.5">
          <AlertCircle size={12} /> {error}
        </p>
      )}
      {hint && !error && (
        <p className="text-[11px] text-theme-secondary mt-0.5">{hint}</p>
      )}
    </div>
  );
}

// ── Overlays ───────────────────────────────────────────────────

function VerificationLoader({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let currentStep = 0;
    const runSteps = async () => {
      for (const s of VERIFY_STEPS) {
        await new Promise(r => setTimeout(r, s.duration));
        currentStep++;
        setStep(currentStep);
      }
      setDone(true);
      await new Promise(r => setTimeout(r, 600));
      onDone();
    };
    runSteps();
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-xl border border-theme-border bg-theme-card p-8 shadow-2xl"
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="relative w-10 h-10 flex-shrink-0">
            <div className="absolute inset-0 rounded-full border-2 border-theme-accent/30 animate-spin" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-1 rounded-full border-2 border-t-theme-accent border-transparent animate-spin" />
            <Shield size={16} className="absolute inset-0 m-auto text-theme-accent" />
          </div>
          <div>
            <p className="text-base font-bold text-theme-primary" style={{ fontFamily: 'Plus Jakarta Sans' }}>
              Verifying Identity
            </p>
            <p className="text-xs text-theme-secondary">Secure bank-grade channel</p>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {VERIFY_STEPS.map((s, i) => {
            const isActive = i === step;
            const isDone = i < step || done;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                  isDone ? 'bg-theme-accent' : isActive ? 'bg-theme-border border border-theme-muted' : 'bg-theme-elevated border border-theme-border'
                }`}>
                  {isDone && <Check size={12} className="text-white" />}
                  {isActive && !isDone && <div className="w-1.5 h-1.5 rounded-full bg-theme-primary animate-pulse" />}
                </div>
                <span className={`text-sm ${isDone ? 'text-theme-accent font-semibold' : isActive ? 'text-theme-primary' : 'text-theme-secondary'}`}>
                  {s.label}
                </span>
              </motion.div>
            );
          })}
        </div>

        <div className="h-1 rounded-full bg-theme-elevated overflow-hidden">
          <motion.div
            className="h-full bg-theme-accent rounded-full"
            animate={{ width: done ? '100%' : `${(step / VERIFY_STEPS.length) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}

function OTPModal({ mobile, onVerified, onClose }: { mobile: string; onVerified: () => void; onClose: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[i] = val;
    setOtp(newOtp);
    setError('');
    if (val && i < 3) refs[i + 1].current?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) refs[i - 1].current?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) { setError('Enter all 4 digits.'); return; }
    if (code !== '1234') { setError('Incorrect OTP. Try 1234.'); return; }
    setVerifying(true);
    await new Promise(r => setTimeout(r, 800));
    onVerified();
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <motion.div
        className="relative w-full max-w-sm rounded-xl border border-theme-border bg-theme-card shadow-2xl overflow-hidden"
        initial={{ scale: 0.95, y: 16, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-theme-primary" style={{ fontFamily: 'Plus Jakarta Sans' }}>Enter OTP</h3>
              <p className="text-xs text-theme-secondary mt-1">Sent to +91 {mobile.slice(0,2)}XXXXXX{mobile.slice(-2)}</p>
            </div>
            <button onClick={onClose} className="text-theme-secondary hover:text-theme-primary">✕</button>
          </div>

          <div className="flex gap-4 justify-center mb-6">
            {otp.map((digit, i) => (
              <input
                key={i} ref={refs[i]} type="text" inputMode="numeric" maxLength={1}
                value={digit} onChange={(e) => handleOtpChange(i, e.target.value)} onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-14 h-16 text-center text-2xl font-bold rounded-lg border outline-none transition-colors bg-theme-elevated text-theme-primary font-mono ${
                  digit ? 'border-theme-muted' : 'border-theme-border focus:border-theme-accent'
                }`}
              />
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center text-xs text-red-400 mb-6 flex items-center justify-center gap-1.5">
                <AlertCircle size={12} /> {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            onClick={handleVerify} disabled={verifying || otp.join('').length < 4}
            className="w-full py-3.5 rounded-lg bg-theme-accent hover:bg-[#256639] disabled:bg-[#1A1A1F] disabled:text-theme-muted text-theme-primary font-bold text-sm transition-colors flex items-center justify-center gap-2"
          >
            {verifying ? <div className="w-4 h-4 rounded-full border-2 border-theme-primary/30 border-t-theme-primary animate-spin" /> : 'Confirm & Proceed'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main Page ──────────────────────────────────────────────────

export default function OnboardingGate({ onSuccess }: OnboardingGateProps) {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Step 1
  const [mobile, setMobile] = useState('');
  const [consent1, setConsent1] = useState(false);
  const [errors1, setErrors1] = useState<Record<string, string>>({});
  
  // Step 2
  const [name, setName] = useState('');
  const [pan, setPan] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [consent2, setConsent2] = useState(false);
  const [errors2, setErrors2] = useState<Record<string, string>>({});
  
  const [showLoader, setShowLoader] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const validateStep1 = () => {
    const e: Record<string, string> = {};
    if (!validateMobile(mobile)) e.mobile = 'Enter valid 10-digit mobile.';
    if (!consent1) e.consent1 = 'Required.';
    setErrors1(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!name.trim() || name.trim().split(' ').length < 2) e.name = 'Enter full name as on PAN.';
    if (!validatePAN(pan)) e.pan = 'Invalid PAN format.';
    if (!validateAadhaar(aadhaar)) e.aadhaar = 'Enter valid 12-digit Aadhaar.';
    if (!consent2) e.consent2 = 'Required.';
    setErrors2(e);
    return Object.keys(e).length === 0;
  };

  const handleStep1Submit = () => {
    if (!validateStep1()) return;
    setShowOTP(true);
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    setStep(2);
  };

  const handleStep2Submit = () => {
    if (!validateStep2()) return;
    setShowLoader(true);
  };

  const handleLoaderDone = () => {
    setShowLoader(false);
    onSuccess({ name: name.trim(), pan });
  };

  return (
    <>
      <div className="min-h-screen bg-theme-bg text-theme-primary" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        
        {/* Navigation Header */}
        <header className="border-b border-theme-border bg-theme-bg/80 backdrop-blur-md sticky top-0 z-30">
          <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-theme-elevated border border-theme-border flex items-center justify-center">
                <Zap size={16} className="text-theme-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight">Crux Auto Finance</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-semibold text-theme-accent bg-theme-accent/10 px-3 py-1.5 rounded-full border border-theme-accent/20">
                <Shield size={12} /> 256-bit Bank Grade Encrypted
              </div>
              <div className="text-[11px] text-theme-secondary font-mono border-l border-theme-border pl-6">
                APP ID: CRX-88219-IN
              </div>
              <div className="flex items-center gap-4 text-xs font-semibold text-theme-secondary">
                <button className="hover:text-theme-primary transition-colors">Need Help?</button>
                <button className="hover:text-theme-primary transition-colors">Save & Exit</button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-6xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Form */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="mb-10">
              <div className="inline-flex items-center gap-2 text-[10px] font-bold tracking-widest text-theme-secondary uppercase mb-4 font-mono">
                <span>STEP 0{step} / 03</span>
                <span className="w-8 h-px bg-theme-border" />
                <span className="text-theme-primary">{step === 1 ? 'Mobile Verification' : 'Identity Verification'}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-3 text-theme-primary">
                {step === 1 ? 'Get Started' : 'Verify Your Identity'}
              </h1>
              <p className="text-sm text-theme-secondary leading-relaxed max-w-xl">
                {step === 1 
                  ? 'Enter your mobile number to begin your vehicle loan application securely.'
                  : 'Crux queries RBI-authorized credit bureaus to fetch pre-approved auto loan terms with zero impact on your credit score.'}
              </p>
            </div>

            <div className="bg-theme-card border border-theme-border rounded-2xl p-6 md:p-8 overflow-hidden">
              <AnimatePresence mode="wait">
                {step === 1 ? (
                  // --- STEP 1 FORM ---
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, x: -20 }} 
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="max-w-md">
                      <InputField
                        id="mobile" label="Mobile Number" icon={Phone} prefix="+91"
                        value={mobile} onChange={(v) => setMobile(v.replace(/\D/g, '').slice(0, 10))}
                        placeholder="98765 43210" maxLength={10} type="tel"
                        error={errors1.mobile} hint="SMS OTP will be sent here"
                      />
                    </div>
                    
                    <div className="mt-6 pt-6 border-t border-theme-border">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input type="checkbox" className="sr-only" checked={consent1} onChange={(e) => { setConsent1(e.target.checked); if(e.target.checked) setErrors1(p => ({...p, consent1: ''})); }} />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${consent1 ? 'bg-theme-accent border-theme-accent' : errors1.consent1 ? 'bg-red-950/20 border-red-500' : 'bg-theme-elevated border-theme-muted group-hover:border-theme-primary'}`}>
                            {consent1 && <Check size={12} className="text-theme-primary" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-theme-secondary leading-relaxed">
                            I agree to the terms and conditions and privacy policy. I consent to receiving communication via SMS and WhatsApp.
                          </p>
                        </div>
                      </label>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                      <button
                        onClick={handleStep1Submit}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-theme-accent hover:bg-[#256639] text-theme-primary font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        Send OTP <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  // --- STEP 2 FORM ---
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, x: 20 }} 
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                      <div className="md:col-span-2">
                        <InputField
                          id="full-name" label="Full Name" icon={User}
                          value={name} onChange={setName}
                          placeholder="As per PAN Card" error={errors2.name}
                          hint="Must match official government tax records"
                        />
                      </div>
                      
                      <InputField
                        id="pan" label="Permanent Account Number (PAN)" icon={CreditCard}
                        value={pan} onChange={(v) => setPan(formatPAN(v))}
                        placeholder="ABCDE1234F" maxLength={10} monospace
                        error={errors2.pan}
                      />

                      <InputField
                        id="aadhaar" label="Aadhaar Number" icon={Hash}
                        value={aadhaar} onChange={(v) => setAadhaar(formatAadhaar(v))}
                        placeholder="1234 5678 9012" maxLength={14} monospace
                        error={errors2.aadhaar}
                      />
                    </div>

                    <div className="mt-6 pt-6 border-t border-theme-border">
                      <label className="flex items-start gap-4 cursor-pointer group">
                        <div className="relative flex-shrink-0 mt-0.5">
                          <input type="checkbox" className="sr-only" checked={consent2} onChange={(e) => { setConsent2(e.target.checked); if(e.target.checked) setErrors2(p => ({...p, consent2: ''})); }} />
                          <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${consent2 ? 'bg-theme-accent border-theme-accent' : errors2.consent2 ? 'bg-red-950/20 border-red-500' : 'bg-theme-elevated border-theme-muted group-hover:border-theme-primary'}`}>
                            {consent2 && <Check size={12} className="text-theme-primary" />}
                          </div>
                        </div>
                        <div className="flex-1">
                          <p className="text-xs text-theme-secondary leading-relaxed">
                            I consent to fetching my KYC information from CKYC/UIDAI registries. I consent to a credit information pull from Experian/CIBIL to determine eligibility.
                          </p>
                          <div className="flex gap-4 mt-2">
                            <a href="#" className="text-[11px] font-semibold text-theme-primary hover:underline flex items-center gap-1">Full Bureau Terms <ExternalLink size={10}/></a>
                            <a href="#" className="text-[11px] font-semibold text-theme-primary hover:underline flex items-center gap-1">Data Privacy <ExternalLink size={10}/></a>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
                      <button
                        onClick={handleStep2Submit}
                        className="w-full sm:w-auto px-8 py-3.5 rounded-lg bg-theme-accent hover:bg-[#256639] text-theme-primary font-bold text-sm transition-colors flex items-center justify-center gap-2"
                      >
                        Verify &amp; Continue <ArrowRight size={16} />
                      </button>
                      <div className="flex items-center gap-2 text-xs font-semibold text-theme-secondary">
                        <Shield size={14} className="text-theme-accent" />
                        Soft pull only • Won't affect credit score
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Column: Trust & Compliance */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-6">
            <div className="bg-theme-card border border-theme-border rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-theme-secondary mb-5">Regulatory &amp; Compliance</h3>
              <div className="space-y-4">
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded bg-theme-elevated border border-theme-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Building2 size={14} className="text-theme-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-theme-primary">RBI Regulated</p>
                    <p className="text-xs text-theme-secondary mt-0.5">Authorized NBFC Lending Entity</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded bg-theme-elevated border border-theme-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Shield size={14} className="text-theme-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-theme-primary">ISO 27001 Certified</p>
                    <p className="text-xs text-theme-secondary mt-0.5">Bank-grade data isolation &amp; security</p>
                  </div>
                </div>
                <div className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded bg-theme-elevated border border-theme-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Zap size={14} className="text-theme-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-theme-primary">Instant Pre-approval</p>
                    <p className="text-xs text-theme-secondary mt-0.5">Automated underwriting in ~90 seconds</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-theme-card border border-theme-border rounded-2xl p-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-theme-secondary mb-4">Integrated Bureau Partners</h3>
              <div className="grid grid-cols-2 gap-3">
                {['CIBIL', 'Experian', 'CRIF High Mark', 'Equifax'].map(bureau => (
                  <div key={bureau} className="px-3 py-2.5 rounded border border-theme-border bg-theme-elevated flex items-center justify-center">
                    <span className="text-xs font-bold text-theme-secondary">{bureau}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showLoader && <VerificationLoader onDone={handleLoaderDone} />}
        {showOTP && <OTPModal mobile={mobile} onVerified={handleOTPVerified} onClose={() => setShowOTP(false)} />}
      </AnimatePresence>
    </>
  );
}
