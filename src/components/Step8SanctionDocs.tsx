import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Copy, Download, FileText, Upload, X, ArrowRight, ArrowLeft } from 'lucide-react';
import type { SanctionedApp } from '../types/journey';
import { formatINR } from '../types/journey';

interface Step8SanctionDocsProps {
  sanction: SanctionedApp;
  onComplete: () => void;
  onBack: () => void;
}

// ── Confetti burst (CSS-only) ──────────────────────────────────
function ConfettiBurstLocal() {
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
function DocDropzone({ label, hint, required, onFileChange }: { label: string; hint: string; required?: boolean; onFileChange?: (hasFile: boolean) => void }) {
  const [file, setFile] = useState<string | null>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) {
      setFile(f.name);
      onFileChange?.(true);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setFile(null);
    onFileChange?.(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      className={`relative rounded border border-dashed p-4 transition-colors duration-200 cursor-pointer group ${
        file
          ? 'border-theme-accent/50 bg-theme-accent/10'
          : 'border-theme-muted hover:border-theme-primary bg-theme-elevated hover:bg-theme-card'
      }`}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={e => {
          const f = e.target.files?.[0];
          if (f) {
            setFile(f.name);
            onFileChange?.(true);
          }
        }}
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
            onClick={handleClear}
            className="w-6 h-6 rounded bg-theme-elevated border border-theme-border hover:border-red-500/50 hover:bg-red-950/20 flex items-center justify-center transition-colors relative z-10"
          >
            <X size={11} className="text-theme-secondary" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function Step8SanctionDocs({ sanction, onComplete, onBack }: Step8SanctionDocsProps) {
  const [copied, setCopied] = useState(false);
  const [docs, setDocs] = useState<Record<string, boolean>>({});

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(sanction.refNumber).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [sanction]);

  const vehicleName = `${sanction.vehicleData.make} ${sanction.vehicleData.model}`;
  const isUsed = sanction.condition === 'used';
  const processingFee = Math.round(sanction.loanAmount * 0.015);
  const interestRate = sanction.condition === 'new' ? 10.5 : 14.5; // fallback

  const handleDocChange = (key: string, hasFile: boolean) => {
    setDocs(prev => ({ ...prev, [key]: hasFile }));
  };

  const requiredKeys = isUsed ? ['pan', 'address', 'bank', 'rc', 'insurance'] : ['pan', 'address', 'bank', 'proforma'];
  const allUploaded = requiredKeys.every(k => docs[k]);

  return (
    <>
      <ConfettiBurstLocal />
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
                { label: 'Interest Rate', value: `${interestRate.toFixed(2)}% p.a.` },
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
              Required Documents for Disbursal
            </span>
          </div>
          <div className="p-4 space-y-3">
            {/* Common docs */}
            <DocDropzone label="PAN Card (Both Sides)" hint="PDF or Image · Max 5 MB" required onFileChange={v => handleDocChange('pan', v)} />
            <DocDropzone label="Address Proof (Aadhaar / Utility Bill)" hint="PDF or Image · Max 5 MB" required onFileChange={v => handleDocChange('address', v)} />
            <DocDropzone label="Last 3 Months Bank Statement" hint="PDF format preferred" required onFileChange={v => handleDocChange('bank', v)} />
            {/* Condition-specific docs */}
            {isUsed ? (
              <>
                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest">Used Vehicle Docs</p>
                </div>
                <DocDropzone label="RC Copy (Registration Certificate)" hint="Front + Back · PDF or Image" required onFileChange={v => handleDocChange('rc', v)} />
                <DocDropzone label="Valid Insurance Certificate" hint="Current year policy · PDF" required onFileChange={v => handleDocChange('insurance', v)} />
                <DocDropzone label="Form 35 (NOC from Previous Lender)" hint="If hypothecation exists" onFileChange={v => handleDocChange('form35', v)} />
              </>
            ) : (
              <>
                <div className="pt-2 pb-1">
                  <p className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest">New Vehicle Docs</p>
                </div>
                <DocDropzone label="Dealer Proforma Invoice" hint="From authorised dealership · PDF" required onFileChange={v => handleDocChange('proforma', v)} />
                <DocDropzone label="Booking Receipt / Allotment Letter" hint="PDF or Image" onFileChange={v => handleDocChange('booking', v)} />
              </>
            )}

            <p className="text-[10px] text-theme-muted pt-2 text-center font-mono">
              * Documents verified in 2–4 hours. Disbursement follows physical inspection.
            </p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="pt-2 flex items-center gap-3"
        >
          <motion.button
            onClick={onBack}
            whileHover={{ x: -2 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center justify-center gap-2 px-6 py-4 rounded border border-theme-border bg-theme-elevated hover:bg-theme-card text-theme-primary font-bold text-xs uppercase tracking-widest transition-colors flex-shrink-0"
          >
            <ArrowLeft size={14} />
            Back
          </motion.button>
          
          <button
            onClick={onComplete}
            disabled={!allUploaded}
            className={`flex-1 py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors duration-300 ${
              allUploaded
                ? 'bg-theme-accent hover:bg-[#256639] text-theme-primary'
                : 'bg-theme-card border border-theme-border text-theme-muted cursor-not-allowed'
            }`}
          >
            Submit Documents
            <ArrowRight size={14} />
          </button>
        </motion.div>
        
        {!allUploaded && (
          <p className="text-center text-[10px] font-mono text-theme-secondary mt-1">
            Please upload all required documents to proceed.
          </p>
        )}

        <p className="text-center text-[10px] font-mono text-theme-muted pb-2">
          © 2024 Crux Auto Finance Pvt. Ltd. — Sanction subject to final approval.
        </p>
      </motion.div>
    </>
  );
}
