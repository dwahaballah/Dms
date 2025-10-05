import React, { useState } from 'react';

import { ConversationSidebar } from './ConversationSidebar';

import { ChatArea } from './ChatArea';

import { FileManager } from './FileManager';

import { PromptManager } from './PromptManager';
 
interface ChatContext {

  selectedFiles: string[];

  selectedPrompt: string | null;

  currentConversation: string | null;

}
 
export const ChatContainer: React.FC = () => {

  const [chatContext, setChatContext] = useState<ChatContext>({

    selectedFiles: [],

    selectedPrompt: null,

    currentConversation: null,

  });
 
  const updateChatContext = (updates: Partial<ChatContext>) => {

    setChatContext(prev => ({ ...prev, ...updates }));

  };
 
  return (
<div className="min-h-screen bg-background flex">

      {/* Left Sidebar - Conversations */}
<div className="w-80 border-r border-border bg-card">
<ConversationSidebar 

          currentConversation={chatContext.currentConversation}

          onSelectConversation={(id) => updateChatContext({ currentConversation: id })}

        />
</div>
 
      {/* Main Chat Area */}
<div className="flex-1 flex flex-col">
<ChatArea 

          chatContext={chatContext}

          updateChatContext={updateChatContext}

        />
</div>
 
      {/* Right Sidebar - Files & Prompts */}
<div className="w-80 border-l border-border bg-card/50">
<div className="h-full flex flex-col">
<div className="flex-1 border-b border-border">
<FileManager 

              selectedFiles={chatContext.selectedFiles}

              onSelectFiles={(files) => updateChatContext({ selectedFiles: files })}

            />
</div>
<div className="flex-1">
<PromptManager 

              selectedPrompt={chatContext.selectedPrompt}

              onSelectPrompt={(prompt) => updateChatContext({ selectedPrompt: prompt })}

            />
</div>
</div>
</div>
</div>

  );

};
 