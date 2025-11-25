// ============================================
// Global Crisis Helplines Database
// ============================================

import { Helpline } from '@/types';

export const helplines: Helpline[] = [
  // United States
  {
    country: 'United States',
    countryCode: 'US',
    name: 'Suicide & Crisis Lifeline',
    number: '988',
    available: '24/7'
  },
  {
    country: 'United States',
    countryCode: 'US',
    name: 'Crisis Text Line',
    number: 'Text HOME to 741741',
    available: '24/7'
  },

  // India
  {
    country: 'India',
    countryCode: 'IN',
    name: 'AASRA',
    number: '9820466726',
    available: '24/7'
  },
  {
    country: 'India',
    countryCode: 'IN',
    name: 'iCall',
    number: '9152987821',
    available: 'Mon-Sat 8 AM - 10 PM'
  },
  {
    country: 'India',
    countryCode: 'IN',
    name: 'Vandrevala Foundation',
    number: '1860-2662-345',
    available: '24/7'
  },

  // United Kingdom
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    name: 'Samaritans',
    number: '116 123',
    available: '24/7',
    url: 'https://www.samaritans.org'
  },
  {
    country: 'United Kingdom',
    countryCode: 'GB',
    name: 'CALM (Men)',
    number: '0800 58 58 58',
    available: '5 PM - midnight'
  },

  // Canada
  {
    country: 'Canada',
    countryCode: 'CA',
    name: 'Suicide Crisis Helpline',
    number: '988',
    available: '24/7'
  },
  {
    country: 'Canada',
    countryCode: 'CA',
    name: 'Kids Help Phone',
    number: '1-800-668-6868',
    available: '24/7'
  },

  // Australia
  {
    country: 'Australia',
    countryCode: 'AU',
    name: 'Lifeline',
    number: '13 11 14',
    available: '24/7',
    url: 'https://www.lifeline.org.au'
  },
  {
    country: 'Australia',
    countryCode: 'AU',
    name: 'Beyond Blue',
    number: '1300 22 4636',
    available: '24/7'
  },

  // Germany
  {
    country: 'Germany',
    countryCode: 'DE',
    name: 'Telefonseelsorge',
    number: '0800 111 0 111',
    available: '24/7'
  },

  // France
  {
    country: 'France',
    countryCode: 'FR',
    name: 'SOS Amitié',
    number: '09 72 39 40 50',
    available: '24/7'
  },

  // Spain
  {
    country: 'Spain',
    countryCode: 'ES',
    name: 'Teléfono de la Esperanza',
    number: '717 003 717',
    available: '24/7'
  },

  // Brazil
  {
    country: 'Brazil',
    countryCode: 'BR',
    name: 'CVV',
    number: '188',
    available: '24/7'
  },

  // Japan
  {
    country: 'Japan',
    countryCode: 'JP',
    name: 'TELL Lifeline',
    number: '03-5774-0992',
    available: '9 AM - 11 PM'
  },

  // South Korea
  {
    country: 'South Korea',
    countryCode: 'KR',
    name: 'Suicide Prevention Hotline',
    number: '1393',
    available: '24/7'
  },

  // Singapore
  {
    country: 'Singapore',
    countryCode: 'SG',
    name: 'Samaritans of Singapore',
    number: '1800 221 4444',
    available: '24/7'
  },

  // South Africa
  {
    country: 'South Africa',
    countryCode: 'ZA',
    name: 'SADAG',
    number: '0800 567 567',
    available: '24/7'
  },

  // Philippines
  {
    country: 'Philippines',
    countryCode: 'PH',
    name: 'Hopeline',
    number: '(02) 804-4673',
    available: '24/7'
  },

  // Mexico
  {
    country: 'Mexico',
    countryCode: 'MX',
    name: 'SAPTEL',
    number: '55 5259-8121',
    available: '24/7'
  },

  // UAE
  {
    country: 'United Arab Emirates',
    countryCode: 'AE',
    name: 'Befrienders Worldwide',
    number: '050 835 3653',
    available: '24/7'
  },

  // New Zealand
  {
    country: 'New Zealand',
    countryCode: 'NZ',
    name: 'Lifeline',
    number: '0800 543 354',
    available: '24/7'
  },
];

// Get helplines by country code
export function getHelplinesByCountry(countryCode: string): Helpline[] {
  const filtered = helplines.filter(
    h => h.countryCode.toUpperCase() === countryCode.toUpperCase()
  );

  // Return US helplines as fallback if country not found
  if (filtered.length === 0) {
    return helplines.filter(h => h.countryCode === 'US');
  }

  return filtered;
}

// Get all countries with helplines
export function getAvailableCountries(): Array<{ code: string; name: string }> {
  const countries = new Map<string, string>();
  for (const helpline of helplines) {
    countries.set(helpline.countryCode, helpline.country);
  }
  return Array.from(countries.entries()).map(([code, name]) => ({ code, name }));
}
