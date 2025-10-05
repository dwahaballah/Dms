import React from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Card } from '@/components/ui/card';

import { Badge } from '@/components/ui/badge';

import { User, Bot, FileText } from 'lucide-react';
 
interface Message {

  id: string;

  content: string;

  sender: 'user' | 'assistant';

  timestamp: string;

  sources?: { file: string; page: number }[];

}
 
interface MessageListProps {

  messages: Message[];

}
 
export const MessageList: React.FC<MessageListProps> = ({ messages }) => {

  const formatTime = (timestamp: string) => {

    return new Date(timestamp).toLocaleTimeString([], { 

      hour: '2-digit', 

      minute: '2-digit' 

    });

  };
 
  return (
<ScrollArea className="h-full">
<div className="p-4 space-y-4">

        {messages.map((message) => (
<div

            key={message.id}

            className={`flex gap-3 ${

              message.sender === 'user' ? 'justify-end' : 'justify-start'

            }`}
>

            {message.sender === 'assistant' && (
<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
<Bot className="h-4 w-4 text-primary-foreground" />
</div>

            )}
<div className={`max-w-[70%] space-y-2 ${

              message.sender === 'user' ? 'order-2' : ''

            }`}>
<Card className={`p-3 ${

                message.sender === 'user'

                  ? 'bg-primary text-primary-foreground ml-auto'

                  : 'bg-muted'

              }`}>
<div className="prose prose-sm max-w-none dark:prose-invert">
<p className="m-0 whitespace-pre-wrap leading-relaxed">

                    {message.content}
</p>
</div>
</Card>
 
              {/* Sources */}

              {message.sources && message.sources.length > 0 && (
<div className="flex flex-wrap gap-1">

                  {message.sources.map((source, index) => (
<Badge 

                      key={index} 

                      variant="secondary" 

                      className="text-xs cursor-pointer hover:bg-secondary/80"
>
<FileText className="h-3 w-3 mr-1" />

                      {source.file} (p.{source.page})
</Badge>

                  ))}
</div>

              )}
 
              <div className={`text-xs text-muted-foreground ${

                message.sender === 'user' ? 'text-right' : 'text-left'

              }`}>

                {formatTime(message.timestamp)}
</div>
</div>
 
            {message.sender === 'user' && (
<div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1 order-3">
<User className="h-4 w-4 text-secondary-foreground" />
</div>

            )}
</div>

        ))}
</div>
</ScrollArea>

  );

};
 