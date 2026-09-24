// Shared types for the multi-step loan journey
export type VehicleType = '2W' | '4W';
export type Condition = 'used' | 'new';

export interface UsedVehicleData {
  make: string;
  model: string;
  year: number;
  fuelType: string;
  color: string;
  engineCC: number;
  hypothecation: 'Clear' | 'Active';
  variant: string;
  odometerBand: 'lt30' | '30-60' | 'gt60';
}

export interface NewVehicleData {
  make: string;
  model: string;
  fuelType: string;
  variant: string;
  city: string;
  exShowroom: number;
  rtoTax: number;
  insurance: number;
  onRoad: number;
}

export type VehicleData = 
  | ({ kind: 'used' } & UsedVehicleData)
  | ({ kind: 'new' } & NewVehicleData);

export interface ValuationResult {
  vehicleType: VehicleType;
  condition: Condition;
  baseValue: number;          // market / on-road value
  maxLTV: number;             // e.g. 0.70, 0.90
  maxLoanAmount: number;      // baseValue * maxLTV
  maxTenureMonths: number;    // computed from age rule
  interestRate: number;       // annual %
  vehicleData: VehicleData;
  vehicleAge: number;         // years, 0 for new
  depreciationRate: number;   // % for used
}

export interface SanctionedApp {
  refNumber: string;
  loanAmount: number;
  tenureMonths: number;
  emi: number;
  vehicleData: VehicleData;
  vehicleType: VehicleType;
  condition: Condition;
  sanctionDate: string;
}

export interface Application {
  id: string;
  status: 'Draft' | 'Submitted' | 'Sanctioned' | 'Approved' | 'Declined';
  lastUpdated?: number;
  mobileNumber?: string;
  vehicleData?: VehicleData;
  sanctionedApp?: SanctionedApp;
}


export function formatINR(n: number): string {
  return '₹' + Math.round(n).toLocaleString('en-IN');
}

export function calcEMI(principal: number, annualRate: number, months: number): number {
  if (months <= 0 || principal <= 0) return 0;
  const r = annualRate / 100 / 12;
  if (r === 0) return principal / months;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

export function genRefNumber(): string {
  return '#SL-2026-' + String(Math.floor(Math.random() * 9000) + 1000);
}
