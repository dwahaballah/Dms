import React, { useState, useRef } from 'react';

import { MessageList } from './MessageList';

import { ChatInput } from './ChatInput';

import { TypingIndicator } from './TypingIndicator';

import { FilePreview } from './FilePreview';
 
interface ChatContext {

  selectedFiles: string[];

  selectedPrompt: string | null;

  currentConversation: string | null;

}
 
interface ChatAreaProps {

  chatContext: ChatContext;

  updateChatContext: (updates: Partial<ChatContext>) => void;

}
 
export const ChatArea: React.FC<ChatAreaProps> = ({

  chatContext,

  updateChatContext

}) => {

  const [isTyping, setIsTyping] = useState(false);

  const [messages, setMessages] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  };
 
  const handleSendMessage = async (message: string) => {

    // Add user message

    const userMessage = {

      id: Date.now().toString(),

      content: message,

      sender: 'user',

      timestamp: new Date().toISOString(),

    };
 
    setMessages(prev => [...prev, userMessage]);

    setIsTyping(true);
 
    // Simulate API call

    setTimeout(() => {

      const assistantMessage = {

        id: (Date.now() + 1).toString(),

        content: "I'll help you with that. Let me analyze your request and provide a comprehensive response.",

        sender: 'assistant',

        timestamp: new Date().toISOString(),

        sources: chatContext.selectedFiles.length > 0 ? [

          { file: 'document.pdf', page: 5 },

          { file: 'readme.md', page: 1 }

        ] : undefined

      };
 
      setMessages(prev => [...prev, assistantMessage]);

      setIsTyping(false);

      scrollToBottom();

    }, 2000);

  };
 
  return (
<div className="h-full flex flex-col bg-background">

      {/* Header */}
<div className="p-4 border-b border-border bg-card">
<div className="flex items-center justify-between">
<div>
<h1 className="text-lg font-semibold text-foreground">

              {chatContext.currentConversation ? 'Ongoing Conversation' : 'New Chat'}
</h1>
<p className="text-sm text-muted-foreground">

              {chatContext.selectedFiles.length > 0 

                ? `${chatContext.selectedFiles.length} files selected`

                : 'No files selected'

              }
</p>
</div>
</div>

        {/* File Preview Bar */}

        {chatContext.selectedFiles.length > 0 && (
<FilePreview 

            files={chatContext.selectedFiles}

            onRemoveFile={(file) => {

              updateChatContext({

                selectedFiles: chatContext.selectedFiles.filter(f => f !== file)

              });

            }}

          />

        )}
</div>
 
      {/* Messages Area */}
<div className="flex-1 overflow-hidden">

        {messages.length === 0 ? (
<div className="h-full flex items-center justify-center">
<div className="text-center max-w-md mx-auto p-6">
<div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
<span className="text-2xl">💬</span>
</div>
<h2 className="text-xl font-semibold text-foreground mb-2">

                Start a conversation
</h2>
<p className="text-muted-foreground">

                Ask me anything or upload files to get started with your AI assistant.
</p>
</div>
</div>

        ) : (
<MessageList messages={messages} />

        )}

        {isTyping && <TypingIndicator />}
<div ref={messagesEndRef} />
</div>
 
      {/* Chat Input */}
<div className="border-t border-border bg-card">
<ChatInput 

          onSendMessage={handleSendMessage}

          disabled={isTyping}

          placeholder={

            chatContext.selectedFiles.length > 0

              ? "Ask about your files..."

              : "Type your message..."

          }

        />
</div>
</div>

  );

};
 