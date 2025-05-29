
import React, { useState } from 'react';
import { Search, Mic } from 'lucide-react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";

const SearchInput = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const handleVoiceStart = () => {
    setIsSpeaking(true);
  };

  const handleVoiceEnd = () => {
    setIsSpeaking(false);
  };

  return (
    <div className="relative flex items-center">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
      <input 
        type="text" 
        placeholder="Jump to page or ask Copilot..." 
        className="w-64 lg:w-80 pl-10 pr-10 py-2 text-sm bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white"
        aria-label="Search"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              className={`absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none ${isSpeaking ? 'text-primary animate-pulse' : ''}`}
              onMouseDown={handleVoiceStart}
              onMouseUp={handleVoiceEnd}
              onMouseLeave={handleVoiceEnd}
            >
              <Mic size={16} />
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Hold to talk</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default SearchInput;
