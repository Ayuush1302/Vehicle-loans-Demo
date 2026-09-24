import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Bell, LogOut, ChevronRight, ArrowRight,
  Car, FileText, TrendingUp, Shield, Clock,
  CheckCircle2, AlertCircle, Sparkles, User,
  CreditCard, BarChart3, Star
} from 'lucide-react';
import type { SanctionedApp } from '../types/journey';
import { formatINR } from '../types/journey';

interface BorrowerHomeProps {
  user: { name: string; pan: string };
  onStartJourney: () => void;
  onLogout: () => void;
  sanctionedApps?: SanctionedApp[];
}

const CIBIL_SCORE = 785;
const CREDIT_LINE = '₹15,00,000';

function getCibilColor(score: number) {
  if (score >= 750) return 'text-theme-accent';
  if (score >= 650) return 'text-amber-500';
  return 'text-red-500';
}

function getCibilLabel(score: number) {
  if (score >= 750) return 'Excellent';
  if (score >= 700) return 'Good';
  if (score >= 650) return 'Fair';
  return 'Needs Work';
}

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
}

function NavBar({ user, onLogout }: { user: { name: string }; onLogout: () => void }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const shortName = user.name.split(' ').slice(0, 2).map((n, i) => i === 0 ? n : n[0] + '.').join(' ');

  return (
    <nav className="sticky top-0 z-40 border-b border-theme-border bg-theme-bg/90 backdrop-blur-xl">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-theme-elevated border border-theme-border flex items-center justify-center flex-shrink-0">
            <Zap size={15} className="text-theme-primary" />
          </div>
          <span className="text-base font-bold text-theme-primary tracking-tight">
            Crux Auto Finance
          </span>
        </div>

        {/* Right cluster */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User pill */}
          <div className="hidden sm:flex items-center gap-2.5 px-3.5 py-1.5 rounded-lg border border-theme-border bg-theme-card">
            <div className="w-7 h-7 rounded border border-theme-border bg-theme-elevated flex items-center justify-center flex-shrink-0">
              <span className="text-[11px] font-bold text-theme-primary">{getInitials(user.name)}</span>
            </div>
            <div className="leading-none">
              <p className="text-xs font-bold text-theme-primary">{shortName}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <BarChart3 size={10} className={getCibilColor(CIBIL_SCORE)} />
                <span className={`text-[10px] font-mono font-bold ${getCibilColor(CIBIL_SCORE)}`}>
                  CIBIL:{CIBIL_SCORE}
                </span>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              id="notification-btn"
              onClick={() => setNotifOpen(!notifOpen)}
              className="w-9 h-9 rounded-lg border border-theme-border bg-theme-card flex items-center justify-center hover:border-theme-muted transition-colors relative"
            >
              <Bell size={15} className="text-theme-secondary" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-theme-accent" />
            </button>
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-theme-border bg-theme-card shadow-2xl overflow-hidden z-50"
                >
                  <div className="px-4 py-3 border-b border-theme-border">
                    <p className="text-xs font-bold text-theme-primary">Notifications</p>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {[
                      { icon: CheckCircle2, color: 'text-theme-accent', msg: 'Soft credit pull complete.', time: 'Just now' },
                      { icon: Star, color: 'text-amber-500', msg: 'Your credit line is ready to use.', time: '2m ago' },
                      { icon: Shield, color: 'text-theme-secondary', msg: 'Identity verified successfully.', time: '3m ago' },
                    ].map(({ icon: I, color, msg, time }) => (
                      <div key={msg} className="flex items-start gap-2.5 p-2 rounded-md hover:bg-theme-elevated transition-colors">
                        <I size={14} className={`${color} flex-shrink-0 mt-0.5`} />
                        <div>
                          <p className="text-xs text-theme-primary font-medium leading-snug">{msg}</p>
                          <p className="text-[10px] text-theme-secondary font-mono mt-0.5">{time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Logout */}
          <button
            id="logout-btn"
            onClick={onLogout}
            className="w-9 h-9 rounded-lg border border-theme-border bg-theme-card flex items-center justify-center hover:bg-red-950/20 hover:border-red-900/50 hover:text-red-500 text-theme-secondary transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </nav>
  );
}

function CibilArcGauge({ score }: { score: number }) {
  const pct = (score - 300) / (900 - 300);
  const angle = -140 + pct * 280;
  return (
    <div className="relative w-24 h-14 flex-shrink-0">
      <svg viewBox="0 0 100 56" className="w-full h-full overflow-visible">
        {/* Track */}
        <path d="M10,50 A44,44 0 0,1 90,50" fill="none" stroke="#2A2925" strokeWidth="6" strokeLinecap="round" />
        {/* Fill */}
        <path
          d="M10,50 A44,44 0 0,1 90,50"
          fill="none"
          stroke="#2E7D47"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={`${pct * 138.2} 138.2`}
        />
        {/* Needle dot */}
        <circle
          cx={50 + 44 * Math.cos((angle - 90) * Math.PI / 180)}
          cy={50 + 44 * Math.sin((angle - 90) * Math.PI / 180)}
          r="4"
          fill="#EFECE4"
        />
      </svg>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
        <span className="text-lg font-bold font-mono text-theme-primary leading-none">
          {score}
        </span>
      </div>
    </div>
  );
}

export default function BorrowerHome({ user, onStartJourney, onLogout, sanctionedApps }: BorrowerHomeProps) {
  const firstName = user.name.split(' ')[0];
  const cibilLabel = getCibilLabel(CIBIL_SCORE);
  const cibilColor = getCibilColor(CIBIL_SCORE);

  return (
    <div className="min-h-screen bg-theme-bg text-theme-primary" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <NavBar user={user} onLogout={onLogout} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── Welcome Row ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
          <div>
            <p className="text-theme-secondary text-xs font-bold uppercase tracking-widest">Welcome back,</p>
            <h1 className="text-2xl sm:text-3xl font-bold text-theme-primary mt-1 tracking-tight">
              {firstName} 👋
            </h1>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-theme-accent/30 bg-theme-accent/10 text-xs font-bold text-theme-accent">
            <TrendingUp size={12} />
            {cibilLabel} Credit
          </div>
        </motion.div>

        {/* ── Pre-Approved Credit Banner ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="relative rounded-2xl border border-theme-border bg-theme-card overflow-hidden"
        >
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded border border-theme-accent/30 bg-theme-accent/10 flex items-center justify-center">
                    <Sparkles size={13} className="text-theme-accent" />
                  </div>
                  <span className="text-xs font-bold text-theme-accent uppercase tracking-widest font-mono">
                    Pre-Approved Credit Line
                  </span>
                </div>

                <p className="text-sm text-theme-secondary mb-1 font-medium">Estimated Vehicle Credit Line</p>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-4xl sm:text-5xl font-bold text-theme-primary tracking-tight font-mono">
                    {CREDIT_LINE}
                  </span>
                </div>
                <p className="text-xs text-theme-secondary mt-2 flex items-center gap-1.5">
                  Based on CIBIL score of <span className={`font-bold font-mono ${cibilColor}`}>{CIBIL_SCORE}</span>
                  <span className="text-theme-border">|</span> Valid 30 days <span className="text-theme-border">|</span> Subject to lender approval
                </p>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                  {['EMI from ₹8,200/mo', 'Up to 84 months', '0% processing fee*'].map(pill => (
                    <span key={pill} className="px-2.5 py-1 rounded bg-theme-elevated border border-theme-border text-[11px] font-bold text-theme-secondary uppercase tracking-wide">
                      {pill}
                    </span>
                  ))}
                </div>
              </div>

              {/* CIBIL Gauge */}
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <CibilArcGauge score={CIBIL_SCORE} />
                <div className="text-center mt-2">
                  <p className={`text-xs font-bold uppercase tracking-wider ${cibilColor}`}>{cibilLabel}</p>
                  <p className="text-[10px] text-theme-secondary font-mono mt-0.5">CIBIL SCORE</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Two column: Active Apps + Quick Stats ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Active Applications */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="rounded-xl border border-theme-border bg-theme-card overflow-hidden flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-theme-border">
              <div className="flex items-center gap-2">
                <FileText size={15} className="text-theme-primary" />
                <span className="text-sm font-bold text-theme-primary">Active Applications</span>
              </div>
              <span className="text-xs font-bold text-theme-secondary px-2 py-0.5 rounded border border-theme-border bg-theme-elevated font-mono">
                {sanctionedApps?.length ?? 0}
              </span>
            </div>

            {!sanctionedApps || sanctionedApps.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-12 px-6 text-center">
                <div className="w-12 h-12 rounded border border-theme-border bg-theme-elevated flex items-center justify-center mb-4">
                  <Car size={20} className="text-theme-secondary" />
                </div>
                <p className="text-sm font-bold text-theme-primary">No Active Applications</p>
                <p className="text-xs text-theme-secondary mt-1.5 leading-relaxed max-w-[200px]">
                  Start your vehicle loan journey to see applications here.
                </p>
                <button
                  onClick={onStartJourney}
                  className="mt-4 flex items-center gap-1 text-[11px] font-bold uppercase tracking-widest text-theme-accent hover:text-[#256639] transition-colors"
                >
                  Apply now <ChevronRight size={12} />
                </button>
              </div>
            ) : (
              <div className="divide-y divide-theme-border">
                {sanctionedApps.map((app) => (
                  <motion.div key={app.refNumber} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-5 space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded border border-theme-border bg-theme-elevated flex items-center justify-center flex-shrink-0">
                          <Car size={16} className="text-theme-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-theme-primary">
                            {app.vehicleData.make} {app.vehicleData.model}
                          </p>
                          <p className="text-[10px] text-theme-secondary font-mono mt-0.5">{app.refNumber} · {app.sanctionDate}</p>
                        </div>
                      </div>
                      <span className="px-2 py-0.5 rounded border border-theme-accent/30 bg-theme-accent/10 text-theme-accent text-[9px] font-bold uppercase tracking-widest flex-shrink-0">
                        Pre-Approved
                      </span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: 'Amount', value: formatINR(app.loanAmount) },
                        { label: 'EMI', value: `${formatINR(app.emi)}/mo` },
                        { label: 'Tenure', value: `${app.tenureMonths}M` },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-theme-elevated rounded border border-theme-border p-2 text-center">
                          <p className="text-[9px] font-bold text-theme-secondary uppercase tracking-widest">{label}</p>
                          <p className="text-[11px] font-bold font-mono text-theme-primary mt-1">{value}</p>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="rounded-xl border border-theme-border bg-theme-card overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-theme-border">
              <BarChart3 size={15} className="text-theme-primary" />
              <span className="text-sm font-bold text-theme-primary">Credit Overview</span>
            </div>

            <div className="p-5 space-y-5">
              {[
                { label: 'Credit Score', value: String(CIBIL_SCORE), change: '+12 pts (3 mo)', color: 'text-theme-accent', icon: TrendingUp },
                { label: 'Available Credit', value: CREDIT_LINE, change: 'Pre-approved', color: 'text-theme-primary', icon: CreditCard },
                { label: 'Credit Utilisation', value: '0%', change: 'Excellent band', color: 'text-theme-accent', icon: Shield },
                { label: 'Loan Inquiries', value: '0', change: 'Soft pulls only', color: 'text-theme-secondary', icon: AlertCircle },
              ].map(({ label, value, change, color, icon: Icon }) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded border border-theme-border bg-theme-elevated flex items-center justify-center flex-shrink-0">
                      <Icon size={13} className={color} />
                    </div>
                    <div>
                      <p className="text-xs text-theme-primary font-bold">{label}</p>
                      <p className="text-[10px] text-theme-secondary mt-0.5">{change}</p>
                    </div>
                  </div>
                  <span className={`text-sm font-bold font-mono ${color}`}>{value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* ── Main Action Hero Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="relative rounded-2xl border border-theme-border bg-theme-card overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded border border-theme-border bg-theme-elevated flex items-center justify-center flex-shrink-0">
                    <Car size={16} className="text-theme-primary" />
                  </div>
                  <span className="text-[10px] font-bold text-theme-secondary uppercase tracking-widest font-mono">
                    New Application
                  </span>
                </div>

                <h2 className="text-xl sm:text-2xl font-bold text-theme-primary tracking-tight mb-2">
                  Apply for Vehicle Loan
                </h2>
                <p className="text-theme-secondary text-sm leading-relaxed max-w-lg">
                  Finance a brand new ride, or get a loan against a used{' '}
                  <span className="text-theme-primary font-bold">two-wheeler or four-wheeler</span>.
                  Real asset valuation · No hard credit check · Instant pre-approval.
                </p>

                <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-5">
                  {['Used & New vehicles', 'Bikes & Cars / SUVs', 'VAHAN-verified assets', 'Up to 85% LTV'].map(item => (
                    <div key={item} className="flex items-center gap-2 text-xs text-theme-primary font-semibold">
                      <CheckCircle2 size={12} className="text-theme-accent flex-shrink-0" /> {item}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:items-end sm:flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0">
                <motion.button
                  id="start-journey-btn" onClick={onStartJourney}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-lg bg-theme-accent hover:bg-[#256639] text-theme-primary font-bold text-sm transition-colors whitespace-nowrap"
                >
                  Start Loan Journey <ArrowRight size={16} />
                </motion.button>
                <div className="flex items-center gap-1.5 justify-center sm:justify-end text-theme-secondary">
                  <Clock size={12} /> <span className="text-[10px] font-bold uppercase tracking-wide">Completes in ~5 minutes</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Quick Links Row ── */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: BarChart3, label: 'EMI Calculator', color: 'text-theme-primary' },
            { icon: FileText, label: 'Document Vault', color: 'text-theme-primary' },
            { icon: Shield, label: 'Insurance', color: 'text-theme-primary' },
            { icon: User, label: 'My Profile', color: 'text-theme-secondary' },
          ].map(({ icon: Icon, label, color }) => (
            <button key={label} className="flex flex-col items-center gap-3 p-4 rounded-xl border border-theme-border bg-theme-card hover:bg-theme-elevated hover:border-theme-muted transition-colors group">
              <div className="w-8 h-8 rounded border border-theme-border bg-theme-bg flex items-center justify-center">
                <Icon size={14} className={color} />
              </div>
              <span className="text-[11px] font-bold text-theme-secondary group-hover:text-theme-primary transition-colors tracking-wide uppercase">
                {label}
              </span>
            </button>
          ))}
        </motion.div>

        {/* Footer */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-center text-[10px] text-theme-muted pb-6 font-mono">
          © 2024 Crux Auto Finance Pvt. Ltd. · NBFC · RBI Reg. No. N-13.02318 (Demo)
        </motion.p>
      </div>
    </div>
  );
}
