import React, { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { ChatSession } from "@/lib/api";

import { MessageCircle, Plus, Trash2 } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
 
interface ChatHistoryProps {

  currentChatId: string | null;

  onChatSelect: (chatId: string | null) => void;

  onNewChat: () => void;

}
 
export const ChatHistory: React.FC<ChatHistoryProps> = ({ 

  currentChatId, 

  onChatSelect, 

  onNewChat 

}) => {

  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const { toast } = useToast();
 
  useEffect(() => {

    loadChatSessions();

  }, []);
 
  const loadChatSessions = () => {

    // Load from localStorage for now (later can be API endpoint)

    const saved = localStorage.getItem('chat_sessions');

    if (saved) {

      setChatSessions(JSON.parse(saved));

    }

  };
 
  const saveChatSessions = (sessions: ChatSession[]) => {

    localStorage.setItem('chat_sessions', JSON.stringify(sessions));

    setChatSessions(sessions);

  };
 
  const handleDeleteChat = (chatId: string) => {

    const updated = chatSessions.filter(chat => chat.id !== chatId);

    saveChatSessions(updated);

    if (currentChatId === chatId) {

      onChatSelect(null);

    }

    toast({

      title: "Success",

      description: "Chat session deleted",

    });

  };
 
  const formatDate = (dateString: string) => {

    const date = new Date(dateString);

    const now = new Date();

    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {

      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    } else if (diffInHours < 24 * 7) {

      return date.toLocaleDateString([], { weekday: 'short', hour: '2-digit', minute: '2-digit' });

    } else {

      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });

    }

  };
 
  return (
<div className="space-y-4">
<Button 

        variant="outline" 

        size="sm" 

        onClick={onNewChat}

        className="w-full"
>
<Plus className="h-4 w-4 mr-2" />

        New Chat
</Button>
 
      <div className="space-y-2 max-h-96 overflow-y-auto">

        {chatSessions.map((chat) => (
<Card 

            key={chat.id} 

            className={`p-3 cursor-pointer transition-colors ${

              currentChatId === chat.id 

                ? 'bg-muted border-primary' 

                : 'hover:bg-muted/50'

            }`}

            onClick={() => onChatSelect(chat.id)}
>
<div className="flex items-center gap-3">
<MessageCircle className="h-4 w-4 text-muted-foreground" />
<div className="flex-1 min-w-0">
<div className="text-sm font-medium truncate">{chat.title}</div>
<div className="text-xs text-muted-foreground">

                  {formatDate(chat.updated_at)} • {chat.messages.length} messages
</div>
<div className="flex gap-1 mt-1">

                  {chat.file_ids.length > 0 && (
<Badge variant="outline" className="text-xs">

                      {chat.file_ids.length} file(s)
</Badge>

                  )}

                  {chat.prompt_ids.length > 0 && (
<Badge variant="outline" className="text-xs">

                      {chat.prompt_ids.length} prompt(s)
</Badge>

                  )}
</div>
</div>
 
              <Button

                variant="ghost"

                size="icon"

                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100"

                onClick={(e) => {

                  e.stopPropagation();

                  handleDeleteChat(chat.id);

                }}
>
<Trash2 className="h-3 w-3" />
</Button>
</div>
</Card>

        ))}
</div>
 
      {chatSessions.length === 0 && (
<div className="text-center py-8 text-sm text-muted-foreground">

          No chat sessions yet. Start a new chat to begin.
</div>

      )}
</div>

  );

};
 