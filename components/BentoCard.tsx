import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  delay?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({ children, className = '', delay = '0s' }) => {
  return (
    <div 
      className={`relative overflow-hidden rounded-3xl p-6 transition-transform hover:scale-[1.02] duration-300 animate-slide-up ${className}`}
      style={{ animationDelay: delay }}
    >
      {children}
    </div>
  );
};

export default BentoCard;