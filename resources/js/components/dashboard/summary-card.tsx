import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SummaryCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  className?: string;
  onClick?: () => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  description,
  icon,
  trend,
  className,
  onClick,
}) => {
  return (
    <Card 
      className={cn(
        "bg-black border-gray-800 text-white overflow-hidden transition-all duration-300",
        onClick && "cursor-pointer hover:border-gray-700 hover:shadow-md",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-sm font-medium text-gray-200">{title}</CardTitle>
        {icon && (
          <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gray-800">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent className="py-2">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </CardContent>
      {trend && (
        <CardFooter className="pt-0 px-4 pb-4">
          <div className={cn(
            "text-xs flex items-center gap-1",
            trend.positive ? "text-green-500" : "text-red-500"
          )}>
            {trend.positive ? (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
              </svg>
            )}
            <span>{trend.value}% {trend.label}</span>
          </div>
        </CardFooter>
      )}
    </Card>
  );
};

export default SummaryCard; 