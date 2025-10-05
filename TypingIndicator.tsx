import React from 'react';

import { Bot } from 'lucide-react';
 
export const TypingIndicator: React.FC = () => {

  return (
<div className="p-4">
<div className="flex gap-3 justify-start">
<div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
<Bot className="h-4 w-4 text-primary-foreground" />
</div>
<div className="bg-muted rounded-lg p-3 max-w-[70%]">
<div className="flex items-center gap-1">
<span className="text-sm text-muted-foreground">AI is typing</span>
<div className="flex gap-1 ml-2">
<div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></div>
<div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></div>
<div className="w-1 h-1 bg-muted-foreground rounded-full animate-bounce"></div>
</div>
</div>
</div>
</div>
</div>

  );

};
 