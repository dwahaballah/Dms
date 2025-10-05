// components/ChatWindow.tsx

import React, { useState, useRef, useEffect } from 'react';

import { Button } from "@/components/ui/button";

import { Textarea } from "@/components/ui/textarea";

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { ChatContext } from "@/pages/ChatInterface";

import { Send, Bot, User } from "lucide-react";
 
interface Message {

  id: string;

  content: string;

  sender: 'user' | 'ai';

  timestamp: Date;

}
 
interface ChatWindowProps {

  chatContext: ChatContext;

}
 
export const ChatWindow: React.FC<ChatWindowProps> = ({ chatContext }) => {

  console.log('ChatWindow rendering with context:', chatContext);
 
  const [messages, setMessages] = useState<Message[]>([

    {

      id: '1',

      content: 'Hello! I\'m your AI assistant. I can help you with your selected files, prompts, and channel context. How can I assist you today?',

      sender: 'ai',

      timestamp: new Date(),

    }

  ]);
 
  const [inputValue, setInputValue] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
 
  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  };
 
  useEffect(() => {

    scrollToBottom();

  }, [messages]);
 
  const handleSendMessage = async () => {

    if (!inputValue.trim()) return;
 
    const userMessage: Message = {

      id: Date.now().toString(),

      content: inputValue,

      sender: 'user',

      timestamp: new Date(),

    };
 
    setMessages(prev => [...prev, userMessage]);

    setInputValue('');

    setIsLoading(true);
 
    // Simulate AI response with context awareness

    setTimeout(() => {

      const contextInfo: string[] = [];
 
      if (chatContext.selectedFiles.length > 0) {

        contextInfo.push(`${chatContext.selectedFiles.length} file(s)`);

      }
 
      if (chatContext.selectedPrompt) {

        contextInfo.push(`a prompt`);

      }
 
      if (chatContext.selectedChannel) {

        contextInfo.push('channel context');

      }
 
      const aiResponse: Message = {

        id: (Date.now() + 1).toString(),

        content: `I understand your message: "${inputValue}". ${

          contextInfo.length > 0

            ? `I'm working with your ${contextInfo.join(', ')} to provide the best response.`

            : 'Please select files, a prompt, or a channel from the sidebar to provide more context.'

        } This is a demo response - in a real implementation, this would be connected to your AI service.`,

        sender: 'ai',

        timestamp: new Date(),

      };
 
      setMessages(prev => [...prev, aiResponse]);

      setIsLoading(false);

    }, 1000);

  };
 
  const handleKeyDown = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      handleSendMessage();

    }

  };
 
  return (
<div className="flex flex-col h-full">

      {/* Context Bar */}
<div className="border-b border-border bg-muted/30 p-4">
<div className="flex flex-wrap gap-2">

          {chatContext.selectedFiles.length > 0 && (
<Badge variant="secondary">

              {chatContext.selectedFiles.length} file(s) selected
</Badge>

          )}
 
          {chatContext.selectedPrompt && (
<Badge variant="secondary">

              Prompt active
</Badge>

          )}
 
          {chatContext.selectedChannel && (
<Badge variant="secondary">

              Channel connected
</Badge>

          )}
 
          {chatContext.currentChatId && (
<Badge variant="secondary">

              Chat session active
</Badge>

          )}
 
          {!chatContext.selectedFiles.length &&

           !chatContext.selectedPrompt &&

           !chatContext.selectedChannel && (
<span className="text-sm text-muted-foreground">

              Select files, a prompt, or channel from the sidebar to enhance your chat experience
</span>

          )}
</div>
</div>
 
      {/* Messages Area */}
<div className="flex-1 overflow-y-auto p-4 space-y-4">

        {messages.map((message) => (
<div

            key={message.id}

            className={`flex gap-3 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
>

            {message.sender === 'ai' && (
<Avatar className="h-8 w-8">
<AvatarFallback>
<Bot className="h-4 w-4" />
</AvatarFallback>
</Avatar>

            )}
<Card className={`max-w-[70%] p-3 ${message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
<p className="text-sm whitespace-pre-wrap">{message.content}</p>
<span className="text-xs opacity-70 mt-2 block">

                {message.timestamp.toLocaleTimeString()}
</span>
</Card>

            {message.sender === 'user' && (
<Avatar className="h-8 w-8">
<AvatarFallback>
<User className="h-4 w-4" />
</AvatarFallback>
</Avatar>

            )}
</div>

        ))}
 
        {isLoading && (
<div className="flex gap-3 justify-start">
<Avatar className="h-8 w-8">
<AvatarFallback>
<Bot className="h-4 w-4" />
</AvatarFallback>
</Avatar>
<Card className="bg-muted p-3">
<p className="text-sm text-muted-foreground">AI is typing...</p>
</Card>
</div>

        )}
<div ref={messagesEndRef} />
</div>
 
      {/* Input Area */}
<div className="border-t border-border p-4">
<div className="flex gap-2">
<Textarea

            value={inputValue}

            onChange={(e) => setInputValue(e.target.value)}

            onKeyDown={handleKeyDown}

            placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"

            className="flex-1 min-h-[60px] max-h-[120px] resize-none"

            disabled={isLoading}

          />
<Button

            onClick={handleSendMessage}

            disabled={!inputValue.trim() || isLoading}

            size="icon"

            className="h-[60px] w-[60px]"
>
<Send className="h-4 w-4" />
</Button>
</div>
</div>
</div>

  );

};

 