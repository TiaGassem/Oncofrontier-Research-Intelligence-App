import type { ReactNode } from 'react';

interface PageHeaderProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  accent?: 'navy' | 'teal';
}

export function PageHeader({ icon, title, subtitle, accent = 'navy' }: PageHeaderProps) {
  const bgClass = accent === 'teal' ? 'bg-teal-50 text-teal-600' : 'bg-navy-50 text-navy-600';
  return (
    <div className="flex items-start gap-3 mb-6">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${bgClass}`}>
        {icon}
      </div>
      <div>
        <h1 className="text-xl font-bold text-navy-900 leading-tight">{title}</h1>
        <p className="text-sm text-navy-500 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
