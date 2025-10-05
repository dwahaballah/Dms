import React, { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/button';

import { Textarea } from '@/components/ui/textarea';

import { Send, Paperclip, Mic } from 'lucide-react';
 
interface ChatInputProps {

  onSendMessage: (message: string) => void;

  disabled?: boolean;

  placeholder?: string;

}
 
export const ChatInput: React.FC<ChatInputProps> = ({

  onSendMessage,

  disabled = false,

  placeholder = "Type your message..."

}) => {

  const [message, setMessage] = useState('');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
 
  const handleSubmit = (e: React.FormEvent) => {

    e.preventDefault();

    if (message.trim() && !disabled) {

      onSendMessage(message.trim());

      setMessage('');

      resetTextareaHeight();

    }

  };
 
  const handleKeyDown = (e: React.KeyboardEvent) => {

    if (e.key === 'Enter' && !e.shiftKey) {

      e.preventDefault();

      handleSubmit(e);

    }

  };
 
  const resetTextareaHeight = () => {

    if (textareaRef.current) {

      textareaRef.current.style.height = 'auto';

    }

  };
 
  const adjustTextareaHeight = () => {

    if (textareaRef.current) {

      textareaRef.current.style.height = 'auto';

      const scrollHeight = textareaRef.current.scrollHeight;

      const maxHeight = 120; // Max 6 lines approximately

      textareaRef.current.style.height = Math.min(scrollHeight, maxHeight) + 'px';

    }

  };
 
  useEffect(() => {

    adjustTextareaHeight();

  }, [message]);
 
  return (
<div className="p-4">
<form onSubmit={handleSubmit} className="space-y-3">
<div className="relative">
<Textarea

            ref={textareaRef}

            value={message}

            onChange={(e) => setMessage(e.target.value)}

            onKeyDown={handleKeyDown}

            placeholder={placeholder}

            disabled={disabled}

            className="min-h-[44px] max-h-[120px] resize-none pr-24 py-3"

            style={{ height: 'auto' }}

          />

          {/* Action Buttons */}
<div className="absolute right-2 bottom-2 flex items-center gap-1">
<Button

              type="button"

              variant="ghost"

              size="sm"

              className="h-8 w-8 p-0"

              disabled={disabled}
>
<Paperclip className="h-4 w-4" />
</Button>
<Button

              type="button"

              variant="ghost"

              size="sm"

              className="h-8 w-8 p-0"

              disabled={disabled}
>
<Mic className="h-4 w-4" />
</Button>
</div>
</div>
 
        <div className="flex items-center justify-between">
<div className="text-xs text-muted-foreground">

            Press <kbd className="px-1 py-0.5 bg-muted rounded text-xs">Enter</kbd> to send, 
<kbd className="px-1 py-0.5 bg-muted rounded text-xs ml-1">Shift + Enter</kbd> for new line
</div>
<Button

            type="submit"

            disabled={!message.trim() || disabled}

            size="sm"

            className="gap-2"
>
<Send className="h-4 w-4" />

            Send
</Button>
</div>
</form>
</div>

  );

};
 