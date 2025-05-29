import React, { useState, forwardRef, useEffect, useRef, ElementType } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  ChevronLeft, ChevronRight, Plus, ChevronDown, ChevronUp, Edit3, Sparkles, 
  FileText, Database, // Existing icons for node cards
  LogIn, BrainCircuit, GitFork, UserCheck, /* Mail - Will be replaced by URL */ LogOut // New icons for other nodes
} from 'lucide-react';
import { cn } from "@/lib/utils";
import ChatNodeCard from '@/components/ChatNodeCard';

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  width: number;
  onResizeStart: (event: React.MouseEvent) => void;
};

// Define a type for chat messages
type ChatMessageNodeCard = {
  icon: ElementType | string; // Changed to union type
  name: string;
  sublabel?: string;
};

type ChatMessage = {
  id: string;
  sender: 'user' | 'ai';
  text?: string; // Text is now optional
  nodeCard?: ChatMessageNodeCard; // Optional node card data
  timestamp: string;
};

// Fake chat history
const fakeChatHistory: ChatMessage[] = [
  { id: '1', sender: 'user', text: "Okay, let's start building out this YC SAFE Analyzer workflow.", timestamp: "10:00 AM" },
  { id: '2', sender: 'ai', text: "Great! What's the first step?", timestamp: "10:01 AM" },
  { id: '3', sender: 'user', text: "We need an input node to accept the Document ID for the term sheet.", timestamp: "10:02 AM" },
  { id: '4', sender: 'ai', text: "Done. I've added a 'Workflow Input' node.", timestamp: "10:03 AM" },
  { 
    id: '4b', 
    sender: 'ai', 
    nodeCard: { icon: LogIn, name: "Workflow Input", sublabel: "Input: Document ID"}, 
    timestamp: "10:03 AM" 
  },
  { id: '5', sender: 'user', text: "Then, we need to fetch the actual term sheet document and also get our standard YC terms from a data store.", timestamp: "10:05 AM" },
  { 
    id: '5b', 
    sender: 'ai', 
    text: "Okay, adding the document and data store steps now:",
    timestamp: "10:07 AM" 
  },
  { 
    id: '5c', 
    sender: 'ai', 
    nodeCard: { icon: FileText, name: "Get Term Sheet", sublabel: "Retrieve Document" }, 
    timestamp: "10:07 AM" 
  },
  { 
    id: '5d', 
    sender: 'ai', 
    nodeCard: { icon: Database, name: "Get Standard Terms", sublabel: "Retrieve from Data Store" }, 
    timestamp: "10:07 AM" 
  },
  { id: '7', sender: 'user', text: "Perfect. Now, let's use an AI task to extract the key terms from the fetched term sheet.", timestamp: "10:08 AM" },
  { id: '8', sender: 'ai', text: "Sounds good. I've added an 'Extract Terms' AI task.", timestamp: "10:10 AM" },
  { 
    id: '8b', 
    sender: 'ai', 
    nodeCard: { icon: BrainCircuit, name: "Extract Terms", sublabel: "AI Task: Process Document"}, 
    timestamp: "10:10 AM" 
  },
  { id: '9', sender: 'user', text: "After extraction, we need to compare these terms against our standard terms. This will be a decision point.", timestamp: "10:12 AM" },
  { id: '10', sender: 'ai', text: "Understood. A 'Compare Terms' decision node has been added.", timestamp: "10:14 AM" },
  { 
    id: '10b', 
    sender: 'ai', 
    nodeCard: { icon: GitFork, name: "Compare Terms", sublabel: "Decision: Auto Approve / Review"}, 
    timestamp: "10:14 AM" 
  },
  { id: '11', sender: 'user', text: "If review is required, it should go to a manual task for a partner to review.", timestamp: "10:15 AM" },
  { id: '12', sender: 'ai', text: "I've set up a 'Review Term Sheet' manual task.", timestamp: "10:17 AM" },
  { 
    id: '12b', 
    sender: 'ai', 
    nodeCard: { icon: UserCheck, name: "Review Term Sheet", sublabel: "Manual Task: Partner Review"}, 
    timestamp: "10:17 AM" 
  },
  { id: '13', sender: 'user', text: "And if the partner requests a revision during the manual task, we need to send an email.", timestamp: "10:18 AM" },
  { id: '14', sender: 'ai', text: "Okay, I've added a 'Send Revision Request' integration node.", timestamp: "10:20 AM" },
  { 
    id: '14b', 
    sender: 'ai', 
    nodeCard: { 
      icon: 'https://cdn.simpleicons.org/gmail', // Changed from Mail to URL
      name: "Send Revision Request", 
      sublabel: "Integration: Gmail"
    }, 
    timestamp: "10:20 AM" 
  },
  { id: '15', sender: 'user', text: "Finally, all paths should lead to a workflow output.", timestamp: "10:22 AM" },
  { id: '16', sender: 'ai', text: "Got it. All relevant paths now converge to a 'Workflow Output' node. The basic structure is complete!", timestamp: "10:24 AM" },
  { 
    id: '16b', 
    sender: 'ai', 
    nodeCard: { icon: LogOut, name: "Workflow Output", sublabel: "Format output data"}, 
    timestamp: "10:24 AM" 
  },
];

const Sidebar = forwardRef<HTMLElement, SidebarProps>(
  ({ isOpen, onClose, width, onResizeStart }, ref) => {
    const isMobile = useIsMobile();
    const [message, setMessage] = useState('');
    const [isChatHistoryVisible, setIsChatHistoryVisible] = useState(isOpen);
    const prevIsOpenRef = useRef<boolean>(isOpen);

    // Refs for scrollable chat areas
    const mobileChatScrollRef = useRef<HTMLDivElement>(null);
    const desktopChatScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const prevIsOpen = prevIsOpenRef.current;
      if (prevIsOpen === false && isOpen === true) {
        setIsChatHistoryVisible(true);
      } else if (prevIsOpen === true && isOpen === false) {
        setIsChatHistoryVisible(false);
      }
      prevIsOpenRef.current = isOpen;
    }, [isOpen]);

    // Effect to scroll to bottom when chat becomes visible or history changes
    useEffect(() => {
      if (isChatHistoryVisible) {
        // A short timeout can help ensure the DOM has updated before scrolling
        // especially if visibility is toggled rapidly or content loads asynchronously.
        setTimeout(() => {
          if (isMobile && mobileChatScrollRef.current) {
            mobileChatScrollRef.current.scrollTop = mobileChatScrollRef.current.scrollHeight;
          } else if (!isMobile && desktopChatScrollRef.current) {
            desktopChatScrollRef.current.scrollTop = desktopChatScrollRef.current.scrollHeight;
          }
        }, 0);
      }
    }, [isChatHistoryVisible, fakeChatHistory, isMobile]); // Added isMobile to dependencies

    const conversationTitle = "Building YC SAFE Analyzer";

    if (isMobile) {
      return (
        <>
          {isOpen && (
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-50 z-20"
              onClick={onClose}
            />
          )}
          
          <aside 
            className={`fixed inset-y-0 left-0 z-30 w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="flex flex-col h-full">
              <div ref={mobileChatScrollRef} className="flex-1 overflow-y-auto">
                <div className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
                  <div className="flex items-center">
                    <span className="text-md font-semibold mr-2 truncate">{conversationTitle}</span>
                    <button onClick={() => {/* Placeholder for edit action */}} className="text-gray-500 hover:text-gray-700">
                      <Edit3 size={16} />
                    </button>
                  </div>
                </div>
                {isChatHistoryVisible ? (
                  <div className="space-y-4 mb-4 px-4 pt-3">
                    {fakeChatHistory.map((chat) => (
                      <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="w-full max-w-[85%] flex flex-col">
                          {chat.nodeCard && chat.sender === 'ai' ? (
                            <ChatNodeCard 
                              icon={chat.nodeCard.icon} 
                              name={chat.nodeCard.name} 
                              sublabel={chat.nodeCard.sublabel} 
                            />
                          ) : chat.text ? (
                            <div className={`p-3 rounded-lg shadow-sm ${chat.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}> 
                              <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
                            </div>
                          ) : null}
                          {!chat.nodeCard && (
                            <p className={`text-xs mt-1 px-2 pb-0.5 self-end ${chat.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>{chat.timestamp}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm text-center py-8 px-4">
                    Click button below to view chat history.
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 p-4">
                <div className="bg-gray-100 rounded-lg p-2 text-xs text-gray-600 mb-2">
                  Tip: Try "Explain selected node"
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
                  />
                  <button 
                    className="bg-primary text-white px-3 py-2 rounded-lg"
                  >
                    Send
                  </button>
                </div>
                <div className="mt-4 flex justify-between items-center">
                  <button 
                    // onClick={() => console.log("New Chat clicked")} // Placeholder action
                    className="text-primary text-sm font-medium flex items-center hover:text-primary-dark transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    New Chat
                  </button>
                  <button 
                    onClick={() => setIsChatHistoryVisible(!isChatHistoryVisible)}
                    className="text-gray-500 text-xs font-medium flex items-center hover:text-gray-600 transition-colors"
                  >
                    Chat History
                    {isChatHistoryVisible ? (
                      <ChevronUp size={16} className="ml-1.5" />
                    ) : (
                      <ChevronDown size={16} className="ml-1.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </>
      );
    }

    return (
      <aside 
        ref={ref}
        className={cn(
          "h-[calc(100vh-64px)] border-r border-gray-200 bg-white transition-width duration-100 ease-in-out overflow-hidden relative",
          !isOpen && "duration-300"
        )}
        style={{ width: isOpen ? `${width}px` : '56px' }}
      >
        {isOpen && (
          <div
            onMouseDown={onResizeStart}
            className="absolute top-0 right-0 h-full w-1.5 cursor-col-resize bg-transparent hover:bg-blue-200 active:bg-blue-300 transition-colors duration-200 z-10"
            aria-label="Resize sidebar"
          />
        )}

        <div className="flex flex-col h-full">
          {isOpen ? (
            <>
              <div className="sticky top-0 z-10 bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200">
                <div className="flex items-center">
                  <span className="text-md font-semibold mr-2 truncate">{conversationTitle}</span>
                  <button onClick={() => {/* Placeholder for edit action */}} className="text-gray-500 hover:text-gray-700">
                    <Edit3 size={16} />
                  </button>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-500 rounded-md hover:bg-gray-100 hover:text-gray-800"
                  aria-label="Collapse sidebar"
                >
                  <ChevronLeft size={20} />
                </button>
              </div>
              
              <div ref={desktopChatScrollRef} className="flex-1 overflow-y-auto">
                {isChatHistoryVisible ? (
                  <div className="space-y-4 mb-4 px-4 pt-3">
                    {fakeChatHistory.map((chat) => (
                      <div key={chat.id} className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className="w-full max-w-[85%] flex flex-col">
                          {chat.nodeCard && chat.sender === 'ai' ? (
                            <ChatNodeCard 
                              icon={chat.nodeCard.icon} 
                              name={chat.nodeCard.name} 
                              sublabel={chat.nodeCard.sublabel} 
                            />
                          ) : chat.text ? (
                            <div className={`p-3 rounded-lg shadow-sm ${chat.sender === 'user' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-800'}`}> 
                              <p className="text-sm whitespace-pre-wrap">{chat.text}</p>
                            </div>
                          ) : null}
                          {!chat.nodeCard && (
                            <p className={`text-xs mt-1 px-2 pb-0.5 self-end ${chat.sender === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>{chat.timestamp}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-500 text-sm text-center py-8 px-4">
                    Click button below to view chat history.
                  </div>
                )}
              </div>
              
              <div className="border-t border-gray-200 p-4">
                <div className="bg-gray-100 rounded-lg p-2 text-xs text-gray-600 mb-2">
                  Tip: Try "Explain selected node"
                </div>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg mr-2"
                  />
                  <button 
                    className="bg-primary text-white px-3 py-2 rounded-lg"
                  >
                    Send
                  </button>
                </div>
                <div className="mt-4 flex justify-between items-center">
                   <button 
                    // onClick={() => console.log("New Chat clicked")} // Placeholder action
                    className="text-primary text-sm font-medium flex items-center hover:text-primary-dark transition-colors"
                  >
                    <Plus size={16} className="mr-1" />
                    New Chat
                  </button>
                  <button 
                    onClick={() => setIsChatHistoryVisible(!isChatHistoryVisible)}
                    className="text-gray-500 text-xs font-medium flex items-center hover:text-gray-600 transition-colors"
                  >
                    Chat History
                    {isChatHistoryVisible ? (
                      <ChevronUp size={16} className="ml-1.5" />
                    ) : (
                      <ChevronDown size={16} className="ml-1.5" />
                    )}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center py-4">
              <button 
                className="w-10 h-10 flex items-center justify-center mb-4 text-gray-600 hover:text-primary rounded-md hover:bg-gray-100"
                onClick={onClose}
                aria-label="Expand sidebar"
              >
                <Sparkles size={20} />
              </button>
              <button 
                className="w-8 h-8 flex items-center justify-center mb-2 bg-primary text-white rounded-full relative"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
            </div>
          )}
        </div>
      </aside>
    );
  }
);

Sidebar.displayName = 'Sidebar';

export default Sidebar;
