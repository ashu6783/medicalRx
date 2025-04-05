// components/ui/Card.tsx
import React from 'react';
import clsx from 'clsx';

export const Card = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={clsx("bg-white rounded-2xl shadow-sm border border-gray-200", className)}>
      {children}
    </div>
  );
};

export const CardContent = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  return (
    <div className={clsx("p-4", className)}>
      {children}
    </div>
  );
};
