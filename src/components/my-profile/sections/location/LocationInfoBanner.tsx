
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface LocationInfoBannerProps {
  icon: React.ReactElement;
  title: string;
  description: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  iconColor: string;
}

const LocationInfoBanner: React.FC<LocationInfoBannerProps> = ({
  icon,
  title,
  description,
  bgColor,
  borderColor,
  textColor,
  iconColor
}) => {
  return (
    <div className={`${bgColor} p-2 rounded-md ${borderColor} mb-3`}>
      <div className="flex items-start gap-2">
        {React.cloneElement(icon, { size: 18, className: `${iconColor} mt-0.5 flex-shrink-0` })}
        <div>
          <p className={`text-sm font-medium ${textColor}`}>{title}</p>
          <p className={`text-xs ${textColor}`}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LocationInfoBanner;
