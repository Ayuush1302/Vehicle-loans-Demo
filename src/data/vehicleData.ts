// Mock vehicle data for Vahan simulation
export const vahanData: Record<string, {
  make: string;
  model: string;
  fuelType: string;
  year: number;
  hypothecation: 'Clear' | 'Active';
  color: string;
  engineCC: number;
  variants: string[];
}> = {
  'DL01AB1234': {
    make: 'Hyundai',
    model: 'Creta',
    fuelType: 'Petrol',
    year: 2021,
    hypothecation: 'Active',
    color: 'Phantom Black',
    engineCC: 1497,
    variants: ['E', 'EX', 'S', 'S+', 'SX', 'SX(O)'],
  },
  'MH02CD5678': {
    make: 'Royal Enfield',
    model: 'Classic 350',
    fuelType: 'Petrol',
    year: 2020,
    hypothecation: 'Clear',
    color: 'Stealth Black',
    engineCC: 349,
    variants: ['Signals Desert Storm', 'Redditch', 'Halcyon', 'Dark'],
  },
  'KA03EF9012': {
    make: 'Maruti Suzuki',
    model: 'Swift',
    fuelType: 'Petrol',
    year: 2022,
    hypothecation: 'Clear',
    color: 'Midnight Blue',
    engineCC: 1197,
    variants: ['LXi', 'VXi', 'ZXi', 'ZXi+'],
  },
  'TN04GH3456': {
    make: 'Honda',
    model: 'Activa 6G',
    fuelType: 'Petrol',
    year: 2023,
    hypothecation: 'Active',
    color: 'Pearl Amazing White',
    engineCC: 109,
    variants: ['STD', 'DLX'],
  },
};

export const cities = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
  'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Bhopal',
  'Chandigarh', 'Kochi', 'Gurgaon', 'Noida', 'Visakhapatnam',
];

export const vehicleCatalog = {
  '2W': {
    'Royal Enfield': {
      models: {
        'Classic 350': {
          fuelTypes: ['Petrol'],
          variants: {
            'Petrol': ['Signals Desert Storm', 'Redditch Red', 'Halcyon Black', 'Dark'],
          },
          exShowroom: { 'Signals Desert Storm': 194900, 'Redditch Red': 199900, 'Halcyon Black': 203900, 'Dark': 208900 },
        },
        'Meteor 350': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['Fireball', 'Stellar', 'Supernova'] },
          exShowroom: { 'Fireball': 214900, 'Stellar': 224900, 'Supernova': 234900 },
        },
        'Hunter 350': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['Dapper', 'Metro', 'Retro'] },
          exShowroom: { 'Dapper': 149900, 'Metro': 159900, 'Retro': 169900 },
        },
      },
    },
    'Honda': {
      models: {
        'Activa 6G': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['STD', 'DLX'] },
          exShowroom: { 'STD': 74200, 'DLX': 77200 },
        },
        'CB350': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['DLX', 'DLX Pro'] },
          exShowroom: { 'DLX': 194500, 'DLX Pro': 204500 },
        },
      },
    },
    'Bajaj': {
      models: {
        'Pulsar NS200': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['STD'] },
          exShowroom: { 'STD': 149900 },
        },
        'Dominar 400': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['STD', 'Touring'] },
          exShowroom: { 'STD': 219800, 'Touring': 229800 },
        },
      },
    },
    'Yamaha': {
      models: {
        'MT-15 V2': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['STD'] },
          exShowroom: { 'STD': 163400 },
        },
        'FZ-S V3': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['STD', 'Fi V3.0'] },
          exShowroom: { 'STD': 124400, 'Fi V3.0': 131400 },
        },
      },
    },
  },
  '4W': {
    'Hyundai': {
      models: {
        'Creta': {
          fuelTypes: ['Petrol', 'Diesel', 'CNG'],
          variants: {
            'Petrol': ['E', 'EX', 'S', 'S+', 'SX', 'SX(O)'],
            'Diesel': ['S', 'S+', 'SX', 'SX(O)'],
            'CNG': ['S', 'SX'],
          },
          exShowroom: {
            'E': 1099000, 'EX': 1250000, 'S': 1380000, 'S+': 1480000, 'SX': 1720000, 'SX(O)': 1950000,
          },
        },
        'i20': {
          fuelTypes: ['Petrol', 'Diesel'],
          variants: {
            'Petrol': ['Era', 'Magna', 'Sportz', 'Asta', 'Asta(O)'],
            'Diesel': ['Magna', 'Sportz', 'Asta'],
          },
          exShowroom: {
            'Era': 729000, 'Magna': 850000, 'Sportz': 1000000, 'Asta': 1150000, 'Asta(O)': 1290000,
          },
        },
        'Venue': {
          fuelTypes: ['Petrol', 'Diesel', 'CNG'],
          variants: {
            'Petrol': ['E', 'S', 'S+', 'SX', 'SX(O)'],
            'Diesel': ['S', 'SX', 'SX(O)'],
            'CNG': ['S', 'SX'],
          },
          exShowroom: {
            'E': 779000, 'S': 900000, 'S+': 1000000, 'SX': 1150000, 'SX(O)': 1320000,
          },
        },
      },
    },
    'Maruti Suzuki': {
      models: {
        'Swift': {
          fuelTypes: ['Petrol', 'CNG'],
          variants: {
            'Petrol': ['LXi', 'VXi', 'ZXi', 'ZXi+'],
            'CNG': ['LXi', 'VXi'],
          },
          exShowroom: { 'LXi': 647000, 'VXi': 720000, 'ZXi': 820000, 'ZXi+': 920000 },
        },
        'Brezza': {
          fuelTypes: ['Petrol'],
          variants: { 'Petrol': ['LXi', 'VXi', 'ZXi', 'ZXi+'] },
          exShowroom: { 'LXi': 879000, 'VXi': 1000000, 'ZXi': 1120000, 'ZXi+': 1320000 },
        },
        'Grand Vitara': {
          fuelTypes: ['Petrol', 'Hybrid'],
          variants: {
            'Petrol': ['Sigma', 'Delta', 'Zeta', 'Alpha'],
            'Hybrid': ['Zeta+', 'Alpha+'],
          },
          exShowroom: {
            'Sigma': 1069000, 'Delta': 1170000, 'Zeta': 1280000, 'Alpha': 1460000,
            'Zeta+': 1680000, 'Alpha+': 1800000,
          },
        },
      },
    },
    'Tata': {
      models: {
        'Nexon': {
          fuelTypes: ['Petrol', 'Diesel', 'EV'],
          variants: {
            'Petrol': ['Smart', 'Smart+', 'Pure', 'Creative', 'Fearless'],
            'Diesel': ['Smart+', 'Pure', 'Creative', 'Fearless'],
            'EV': ['Smart', 'Pure', 'Creative+', 'Fearless+'],
          },
          exShowroom: {
            'Smart': 799000, 'Smart+': 880000, 'Pure': 1000000, 'Creative': 1150000, 'Fearless': 1380000,
            'Creative+': 1680000, 'Fearless+': 1820000,
          },
        },
        'Punch': {
          fuelTypes: ['Petrol', 'CNG', 'EV'],
          variants: {
            'Petrol': ['Pure', 'Adventure', 'Accomplished', 'Creative'],
            'CNG': ['Pure', 'Adventure'],
            'EV': ['Adventure', 'Accomplished', 'Creative'],
          },
          exShowroom: {
            'Pure': 605000, 'Adventure': 720000, 'Accomplished': 840000, 'Creative': 960000,
          },
        },
      },
    },
    'Kia': {
      models: {
        'Seltos': {
          fuelTypes: ['Petrol', 'Diesel'],
          variants: {
            'Petrol': ['EX', 'HTX', 'HTX+', 'GTX+'],
            'Diesel': ['HTX', 'HTX+', 'GTX+'],
          },
          exShowroom: {
            'EX': 1069000, 'HTX': 1280000, 'HTX+': 1480000, 'GTX+': 1980000,
          },
        },
        'Sonet': {
          fuelTypes: ['Petrol', 'Diesel'],
          variants: {
            'Petrol': ['HTE', 'HTK', 'HTX', 'GTX+'],
            'Diesel': ['HTK', 'HTX', 'HTX+', 'GTX+'],
          },
          exShowroom: {
            'HTE': 769000, 'HTK': 930000, 'HTX': 1100000, 'HTX+': 1280000, 'GTX+': 1480000,
          },
        },
      },
    },
  },
};

export const rtoTaxRates: Record<string, number> = {
  'Delhi': 0.12,
  'Mumbai': 0.11,
  'Bangalore': 0.13,
  'Hyderabad': 0.12,
  'Chennai': 0.10,
  'Kolkata': 0.09,
  'Pune': 0.11,
  'Ahmedabad': 0.10,
  'Jaipur': 0.08,
  'Surat': 0.10,
};

export const personas = [
  {
    id: 'used-creta',
    label: 'Used Creta (4W)',
    vehicleType: '4W' as const,
    condition: 'used' as const,
    plate: 'DL01AB1234',
  },
  {
    id: 'new-creta',
    label: 'New Creta (4W)',
    vehicleType: '4W' as const,
    condition: 'new' as const,
    make: 'Hyundai',
    model: 'Creta',
    city: 'Delhi',
  },
  {
    id: 'used-classic',
    label: 'Used Classic 350 (2W)',
    vehicleType: '2W' as const,
    condition: 'used' as const,
    plate: 'MH02CD5678',
  },
  {
    id: 'new-classic',
    label: 'New Classic 350 (2W)',
    vehicleType: '2W' as const,
    condition: 'new' as const,
    make: 'Royal Enfield',
    model: 'Classic 350',
    city: 'Mumbai',
  },
];
