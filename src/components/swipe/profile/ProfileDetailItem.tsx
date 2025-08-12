import React from 'react';
interface ProfileDetailItemProps {
  label: string;
  value: string | string[] | undefined;
}
const ProfileDetailItem = ({
  label,
  value
}: ProfileDetailItemProps) => {
  if (!value || Array.isArray(value) && value.length === 0) return null;
  const displayValue = Array.isArray(value) ? value.join(", ") : value;
  if (!displayValue) return null;
  return <div className="flex justify-between items-start mx-[5px] my-[3px] px-[5px] py-[5px]">
      <span className="text-white/70 text-xs font-medium">{label}:</span>
      <span className="text-white text-xs text-right flex-1 ml-2">{displayValue}</span>
    </div>;
};
export default ProfileDetailItem;