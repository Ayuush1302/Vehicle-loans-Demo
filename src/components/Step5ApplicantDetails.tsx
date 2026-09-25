import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, ArrowRight, UserCircle, Briefcase,
  Home, Building, ShieldCheck
} from 'lucide-react';
import type { SanctionedApp } from '../types/journey';

interface Step5ApplicantDetailsProps {
  sanctionedApp: SanctionedApp;
  userName: string;
  onBack: () => void;
  onComplete: () => void;
}

export default function Step5ApplicantDetails({ sanctionedApp: _sanctionedApp, userName, onBack, onComplete }: Step5ApplicantDetailsProps) {
  const [empType, setEmpType] = useState('Salaried');
  const [dob, setDob] = useState('1990-01-01');
  const [email, setEmail] = useState('');
  const [employer, setEmployer] = useState('');
  const [income, setIncome] = useState('');
  const [emis, setEmis] = useState('');

  const [resType, setResType] = useState('Owned');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [stateName, setStateName] = useState('');
  const [pincode, setPincode] = useState('');

  const [accNo, setAccNo] = useState('');
  const [ifsc, setIfsc] = useState('');

  const isComplete = email && employer && income && address1 && city && stateName && pincode && accNo && ifsc;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -24 }}
      transition={{ duration: 0.3 }}
      className="space-y-7 max-w-3xl mx-auto py-8 font-sans"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
    >
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[10px] font-bold font-mono text-theme-secondary uppercase tracking-widest px-2 py-1 border border-theme-border rounded bg-theme-elevated">
            STEP 5
          </span>
          <span className="text-[10px] font-bold font-mono text-theme-accent uppercase tracking-widest px-2 py-1 border border-theme-accent/30 rounded bg-theme-accent/10">
            APPLICANT DETAILS
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-theme-primary tracking-tight">
          Verify Applicant Information
        </h2>
        <p className="text-theme-secondary text-sm mt-2 leading-relaxed">
          Please provide your employment, residential, and banking details to finalize your loan application.
        </p>
      </div>

      {/* KYC Profile Card */}
      <div className="rounded-lg border border-theme-border bg-theme-card p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-theme-elevated border border-theme-border flex items-center justify-center flex-shrink-0">
          <UserCircle size={24} className="text-theme-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-bold text-theme-primary">{userName || 'Applicant'}</h3>
            <ShieldCheck size={14} className="text-theme-accent" />
            <span className="text-[10px] font-bold text-theme-accent uppercase tracking-widest font-mono">KYC Verified</span>
          </div>
          <div className="flex items-center gap-4">
            <p className="text-xs text-theme-secondary font-mono">PAN: XXXXXX4321</p>
            <p className="text-xs text-theme-secondary font-mono">Verified Profile</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Personal & Employment */}
        <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-theme-border bg-theme-elevated">
            <Briefcase size={14} className="text-theme-primary" />
            <span className="text-[11px] font-bold text-theme-primary uppercase tracking-widest">Personal & Employment</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Date of Birth</label>
              <input type="date" value={dob} onChange={e => setDob(e.target.value)} className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Email Address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="john@example.com" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Employment Type</label>
              <select value={empType} onChange={e => setEmpType(e.target.value)} className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary">
                <option value="Salaried">Salaried</option>
                <option value="Self Employed">Self Employed</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Employer / Business Name</label>
              <input type="text" value={employer} onChange={e => setEmployer(e.target.value)} placeholder="e.g. Acme Corp" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Net Monthly Income (₹)</label>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="e.g. 85000" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Total Existing EMIs (₹)</label>
              <input type="number" value={emis} onChange={e => setEmis(e.target.value)} placeholder="e.g. 12000" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
          </div>
        </div>

        {/* Residential Detail */}
        <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-theme-border bg-theme-elevated">
            <Home size={14} className="text-theme-primary" />
            <span className="text-[11px] font-bold text-theme-primary uppercase tracking-widest">Residential Details</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Residence Type</label>
              <select value={resType} onChange={e => setResType(e.target.value)} className="w-full sm:w-1/2 bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary">
                <option value="Owned">Owned</option>
                <option value="Rented">Rented</option>
                <option value="Family">Family</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Address Line 1</label>
              <input type="text" value={address1} onChange={e => setAddress1(e.target.value)} placeholder="Flat/House No., Building" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Address Line 2</label>
              <input type="text" value={address2} onChange={e => setAddress2(e.target.value)} placeholder="Locality, Street" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">City</label>
              <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">State</label>
              <input type="text" value={stateName} onChange={e => setStateName(e.target.value)} placeholder="State" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Pincode</label>
              <input type="text" value={pincode} onChange={e => setPincode(e.target.value)} placeholder="e.g. 110001" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="rounded-lg border border-theme-border bg-theme-card overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-theme-border bg-theme-elevated">
            <Building size={14} className="text-theme-primary" />
            <span className="text-[11px] font-bold text-theme-primary uppercase tracking-widest">Borrower's Bank Details (For Mandate & Analysis)</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">Account Number</label>
              <input type="text" value={accNo} onChange={e => setAccNo(e.target.value)} placeholder="Account No" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-theme-secondary uppercase tracking-widest mb-2 font-mono">IFSC Code</label>
              <input type="text" value={ifsc} onChange={e => setIfsc(e.target.value.toUpperCase())} placeholder="IFSC Code" className="w-full bg-theme-elevated border border-theme-border text-theme-primary text-xs px-4 py-3 rounded focus:outline-none focus:border-theme-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center gap-3 pt-6 border-t border-theme-border mt-8">
        <motion.button
          onClick={onBack}
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center justify-center gap-2 px-6 py-4 rounded border border-theme-border bg-theme-elevated hover:bg-theme-card text-theme-primary font-bold text-xs uppercase tracking-widest transition-colors flex-shrink-0"
        >
          <ArrowLeft size={14} />
          Back
        </motion.button>

        <motion.button
          onClick={onComplete}
          disabled={!isComplete}
          whileHover={isComplete ? { scale: 1.01 } : {}}
          whileTap={isComplete ? { scale: 0.99 } : {}}
          className={`flex-1 py-4 rounded font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2.5 transition-colors duration-300 ${
            isComplete
              ? 'bg-theme-accent hover:bg-[#256639] text-theme-primary'
              : 'bg-theme-elevated border border-theme-border text-theme-muted cursor-not-allowed'
          }`}
        >
          Generate Sanction Letter
          {isComplete && <ArrowRight size={14} />}
        </motion.button>
      </div>
    </motion.div>
  );
}
