import React, { useState, useEffect } from 'react';

import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';

import { Textarea } from '@/components/ui/textarea';

import { Plus, Search, Edit, Trash2, Wand2 } from 'lucide-react';

import { promptsApi, Prompt as ApiPrompt } from '@/lib/api';

import { useToast } from '@/hooks/use-toast';
 
interface Prompt {

  id: string;

  name: string;

  content: string;

  category: string;

  isActive?: boolean;

}
 
interface PromptManagerProps {

  selectedPrompt: string | null;

  onSelectPrompt: (promptId: string | null) => void;

}
 
export const PromptManager: React.FC<PromptManagerProps> = ({

  selectedPrompt,

  onSelectPrompt

}) => {

  const [searchQuery, setSearchQuery] = useState('');

  const [isCreating, setIsCreating] = useState(false);

  const [prompts, setPrompts] = useState<Prompt[]>([]);

  const [newPromptName, setNewPromptName] = useState('');

  const [newPromptContent, setNewPromptContent] = useState('');

  const { toast } = useToast();
 
  useEffect(() => {

    loadPrompts();

  }, []);
 
  const loadPrompts = async () => {

    try {

      const apiPrompts = await promptsApi.getUserPrompts();

      const convertedPrompts: Prompt[] = apiPrompts.map(p => ({

        id: p.id,

        name: p.name,

        content: p.content,

        category: 'User', // Default category since API doesn't provide it

        isActive: true

      }));

      setPrompts(convertedPrompts);

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to load prompts",

        variant: "destructive",

      });

    }

  };
 
  const handleCreatePrompt = async () => {

    if (!newPromptName.trim() || !newPromptContent.trim()) {

      toast({

        title: "Error",

        description: "Please fill in both name and content",

        variant: "destructive",

      });

      return;

    }
 
    try {

      const newPrompt = await promptsApi.addPrompt(newPromptName, newPromptContent);

      const convertedPrompt: Prompt = {

        id: newPrompt.id,

        name: newPrompt.name,

        content: newPrompt.content,

        category: 'User',

        isActive: true

      };

      setPrompts(prev => [convertedPrompt, ...prev]);

      setNewPromptName('');

      setNewPromptContent('');

      setIsCreating(false);

      toast({

        title: "Success",

        description: "Prompt created successfully",

      });

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to create prompt",

        variant: "destructive",

      });

    }

  };
 
  const handleDeletePrompt = async (promptId: string) => {

    try {

      await promptsApi.deletePrompt(promptId);

      setPrompts(prev => prev.filter(p => p.id !== promptId));

      if (selectedPrompt === promptId) {

        onSelectPrompt(null);

      }

      toast({

        title: "Success",

        description: "Prompt deleted successfully",

      });

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to delete prompt",

        variant: "destructive",

      });

    }

  };
 
  const filteredPrompts = prompts.filter(prompt =>

    prompt.name.toLowerCase().includes(searchQuery.toLowerCase()) ||

    prompt.content.toLowerCase().includes(searchQuery.toLowerCase()) ||

    prompt.category.toLowerCase().includes(searchQuery.toLowerCase())

  );
 
  const categories = [...new Set(prompts.map(p => p.category))];
 
  return (
<div className="h-full flex flex-col">

      {/* Header */}
<div className="p-4 border-b border-border">
<div className="flex items-center justify-between mb-3">
<h3 className="font-semibold text-foreground">System Prompts</h3>
<Button 

            size="sm" 

            variant="outline" 

            className="h-8 gap-2"

            onClick={() => setIsCreating(true)}
>
<Plus className="h-3 w-3" />

            New
</Button>
</div>

        {/* Search */}
<div className="relative">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<Input

            placeholder="Search prompts..."

            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}

            className="pl-10 h-9"

          />
</div>
</div>
 
      {/* Active Prompt */}

      {selectedPrompt && (
<div className="p-3 bg-primary/5 border-b border-border">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<Wand2 className="h-4 w-4 text-primary" />
<span className="text-sm font-medium text-primary">

                Active: {prompts.find(p => p.id === selectedPrompt)?.name}
</span>
</div>
<Button

              variant="ghost"

              size="sm"

              className="h-6 text-xs"

              onClick={() => onSelectPrompt(null)}
>

              Clear
</Button>
</div>
</div>

      )}
 
      {/* Prompts List */}
<ScrollArea className="flex-1">
<div className="p-3 space-y-2">

          {/* No instructions state */}

          {filteredPrompts.length === 0 && !searchQuery && (
<div className="text-center py-8">
<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
<Wand2 className="h-6 w-6 text-muted-foreground" />
</div>
<p className="text-sm text-muted-foreground mb-2">

                No instructions added yet
</p>
<Button 

                variant="outline" 

                size="sm"

                onClick={() => setIsCreating(true)}
>

                Create your first prompt
</Button>
</div>

          )}
 
          {/* Search no results */}

          {filteredPrompts.length === 0 && searchQuery && (
<div className="text-center py-8">
<p className="text-sm text-muted-foreground">

                No prompts found matching "{searchQuery}"
</p>
</div>

          )}
 
          {/* Prompts by category */}

          {categories.map(category => {

            const categoryPrompts = filteredPrompts.filter(p => p.category === category);

            if (categoryPrompts.length === 0) return null;
 
            return (
<div key={category} className="space-y-2">
<h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider px-1">

                  {category}
</h4>

                {categoryPrompts.map((prompt) => (
<Card

                    key={prompt.id}

                    className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-sm ${

                      selectedPrompt === prompt.id

                        ? 'bg-primary/10 border-primary'

                        : 'hover:bg-muted/50'

                    }`}

                    onClick={() => onSelectPrompt(

                      selectedPrompt === prompt.id ? null : prompt.id

                    )}
>
<div className="space-y-2">
<div className="flex items-start justify-between">
<h5 className="font-medium text-sm text-foreground">

                          {prompt.name}
</h5>
<div className="flex items-center gap-1 ml-2">
<Button

                            variant="ghost"

                            size="sm"

                            className="h-6 w-6 p-0"

                            onClick={(e) => {

                              e.stopPropagation();

                              // Edit functionality - could be implemented later

                            }}
>
<Edit className="h-3 w-3" />
</Button>
<Button

                            variant="ghost"

                            size="sm"

                            className="h-6 w-6 p-0 hover:bg-destructive/20"

                            onClick={(e) => {

                              e.stopPropagation();

                              handleDeletePrompt(prompt.id);

                            }}
>
<Trash2 className="h-3 w-3" />
</Button>
</div>
</div>
<p className="text-xs text-muted-foreground line-clamp-2">

                        {prompt.content}
</p>
<Badge variant="outline" className="text-xs w-fit">

                        {prompt.category}
</Badge>
</div>
</Card>

                ))}
</div>

            );

          })}
</div>
</ScrollArea>
 
      {/* Create Prompt Form */}
      {isCreating && (
<div className="p-3 border-t border-border space-y-3">
<div className="flex items-center justify-between">
<h4 className="font-medium text-sm">New Prompt</h4>
<Button

              variant="ghost"

              size="sm"

              onClick={() => {

                setIsCreating(false);

                setNewPromptName('');

                setNewPromptContent('');

              }}
>

              Cancel
</Button>
</div>
<Input 

            placeholder="Prompt name" 

            className="h-8" 

            value={newPromptName}

            onChange={(e) => setNewPromptName(e.target.value)}

          />
<Textarea 

            placeholder="Prompt content..."

            className="min-h-[60px] resize-none"

            value={newPromptContent}

            onChange={(e) => setNewPromptContent(e.target.value)}

          />
<Button 

            size="sm" 

            className="w-full"

            onClick={handleCreatePrompt}
>

            Create Prompt
</Button>
</div>

      )}
</div>

  );

};
 