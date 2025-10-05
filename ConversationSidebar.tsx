import React, { useState } from 'react';

import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Badge } from '@/components/ui/badge';

import { MessageSquare, Plus, Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
 
interface Conversation {

  id: string;

  title: string;

  messageCount: number;

  lastMessage: string;

  timestamp: string;

  isActive?: boolean;

}
 
interface ConversationSidebarProps {

  currentConversation: string | null;

  onSelectConversation: (id: string) => void;

}
 
export const ConversationSidebar: React.FC<ConversationSidebarProps> = ({

  currentConversation,

  onSelectConversation

}) => {

  const [searchQuery, setSearchQuery] = useState('');
 
  // Mock data - replace with actual API calls

  const conversations: Conversation[] = [

    {

      id: '1',

      title: 'React Components Discussion',

      messageCount: 24,

      lastMessage: 'Can you help me with useEffect?',

      timestamp: '2 min ago'

    },

    {

      id: '2',

      title: 'Database Schema Design',

      messageCount: 18,

      lastMessage: 'The user table needs validation',

      timestamp: '1 hour ago'

    },

    {

      id: '3',

      title: 'API Integration Help',

      messageCount: 12,

      lastMessage: 'POST request is returning 404',

      timestamp: '3 hours ago'

    }

  ];
 
  const filteredConversations = conversations.filter(conv =>

    conv.title.toLowerCase().includes(searchQuery.toLowerCase()) ||

    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())

  );
 
  return (
<div className="h-full flex flex-col">

      {/* Header */}
<div className="p-4 border-b border-border">
<div className="flex items-center justify-between mb-4">
<h2 className="text-lg font-semibold text-foreground">Conversations</h2>
<Button size="sm" className="h-8 w-8 p-0">
<Plus className="h-4 w-4" />
</Button>
</div>

        {/* Search */}
<div className="relative">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<Input

            placeholder="Search conversations..."

            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}

            className="pl-10"

          />
</div>
</div>
 
      {/* Conversations List */}
<ScrollArea className="flex-1">
<div className="p-2 space-y-2">

          {filteredConversations.map((conversation) => (
<Card

              key={conversation.id}

              className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-sm ${

                currentConversation === conversation.id

                  ? 'bg-primary/10 border-primary'

                  : 'hover:bg-muted/50'

              }`}

              onClick={() => onSelectConversation(conversation.id)}
>
<div className="space-y-2">
<div className="flex items-start justify-between">
<h3 className="font-medium text-sm leading-tight text-foreground line-clamp-2">

                    {conversation.title}
</h3>
<Badge variant="secondary" className="ml-2 text-xs">

                    {conversation.messageCount}
</Badge>
</div>
<p className="text-xs text-muted-foreground line-clamp-2">

                  {conversation.lastMessage}
</p>
<div className="flex items-center justify-between">
<div className="flex items-center gap-1 text-xs text-muted-foreground">
<MessageSquare className="h-3 w-3" />
<span>{conversation.messageCount} messages</span>
</div>
<span className="text-xs text-muted-foreground">

                    {conversation.timestamp}
</span>
</div>
</div>
</Card>

          ))}
</div>
</ScrollArea>
 
      {/* Footer */}
<div className="p-4 border-t border-border">
<Button 

          className="w-full" 

          onClick={() => onSelectConversation('new')}
>
<Plus className="h-4 w-4 mr-2" />

          New Conversation
</Button>
</div>
</div>

  );

};
 