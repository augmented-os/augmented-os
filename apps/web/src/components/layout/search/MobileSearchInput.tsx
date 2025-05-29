
import React, { useState } from 'react';
import { Search, Mic } from 'lucide-react';

const MobileSearchInput = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleVoiceStart = () => {
    setIsSpeaking(true);
  };

  const handleVoiceEnd = () => {
    setIsSpeaking(false);
  };

  return (
    <div className="pt-2 w-full">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
        <input 
          type="text" 
          placeholder="Search..." 
          className="w-full pl-10 pr-10 py-2 text-sm bg-gray-100 border-0 rounded-lg"
          aria-label="Search"
        />
        <button 
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 ${isSpeaking ? 'text-primary' : ''}`}
          onMouseDown={handleVoiceStart}
          onMouseUp={handleVoiceEnd}
          onTouchStart={handleVoiceStart}
          onTouchEnd={handleVoiceEnd}
        >
          <Mic size={16} />
        </button>
      </div>
    </div>
  );
};

export default MobileSearchInput;
