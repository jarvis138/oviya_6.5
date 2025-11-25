'use client';

// ============================================
// Crisis Resource Card Component
// ============================================

import React from 'react';
import { motion } from 'framer-motion';
import { getHelplinesByCountry } from '@/server/modules/crisis/helplines';

interface CrisisResourceCardProps {
  countryCode: string;
}

export function CrisisResourceCard({ countryCode }: CrisisResourceCardProps) {
  const helplines = getHelplinesByCountry(countryCode);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-xl p-4 shadow-lg"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl">🆘</span>
        <h3 className="font-semibold text-gray-800">
          If you need immediate help
        </h3>
      </div>

      <div className="space-y-2">
        {helplines.slice(0, 3).map((helpline) => (
          <div
            key={helpline.number}
            className="flex items-center justify-between bg-white/50 rounded-lg p-3"
          >
            <div>
              <p className="font-medium text-gray-800">{helpline.name}</p>
              <p className="text-xs text-gray-600">{helpline.available}</p>
            </div>
            <a
              href={`tel:${helpline.number.replace(/\s/g, '')}`}
              className="bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              {helpline.number}
            </a>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-600 mt-3 text-center">
        You're not alone. Help is available 24/7.
      </p>
    </motion.div>
  );
}
