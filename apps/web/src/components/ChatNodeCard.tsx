import React, { ElementType } from 'react';
import { ChevronRight } from 'lucide-react';

type ChatNodeCardProps = {
  icon: ElementType | string; // Accepts Lucide component or image URL string
  name: string;
  sublabel?: string;
};

const ChatNodeCard: React.FC<ChatNodeCardProps> = ({ 
  icon, // Renamed from icon: IconComponent for clarity with type check
  name, 
  sublabel 
}) => {
  const iconClasses = "w-6 h-6 mr-3 flex-shrink-0"; // Common classes for icon/image

  return (
    <div className="flex items-center p-3 my-0.5 bg-white border border-gray-200 rounded-lg shadow-sm w-full hover:shadow-md transition-shadow duration-150 cursor-pointer">
      {typeof icon === 'string' ? (
        <img src={icon} alt={`${name} icon`} className={`${iconClasses} object-contain`} />
      ) : (
        React.createElement(icon, { className: `${iconClasses} text-gray-500` })
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800 truncate">{name}</p>
        {sublabel && (
          <p className="text-xs text-gray-500 truncate">{sublabel}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 ml-2 text-gray-400 flex-shrink-0" />
    </div>
  );
};

export default ChatNodeCard; 