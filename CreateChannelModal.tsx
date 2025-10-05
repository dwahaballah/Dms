import React, { useState } from 'react';

import { Plus, Upload, X } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Input } from '@/components/ui/input';

import { Label } from '@/components/ui/label';

import { Textarea } from '@/components/ui/textarea';

import { Switch } from '@/components/ui/switch';

import {

  Dialog,

  DialogContent,

  DialogDescription,

  DialogHeader,

  DialogTitle,

  DialogTrigger,

} from '@/components/ui/dialog';

import { useToast } from '@/hooks/use-toast';

import { channelsApi } from '@/lib/api';  // ✅ use channelsApi
 
interface CreateChannelModalProps {

  onChannelCreated?: () => void;

}
 
export const CreateChannelModal: React.FC<CreateChannelModalProps> = ({

  onChannelCreated,

}) => {

  const [isOpen, setIsOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const { toast } = useToast();
 
  const [formData, setFormData] = useState({

    channel_name: '',

    description: '',

    is_visible: true,

    admin_username: '',

    prompt_name: '',

    prompt_content: '',

  });
 
  const handleInputChange = (field: string, value: string | boolean) => {

    setFormData(prev => ({ ...prev, [field]: value }));

  };
 
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {

    const files = Array.from(event.target.files || []);

    setSelectedFiles(prev => [...prev, ...files]);

  };
 
  const removeFile = (index: number) => {

    setSelectedFiles(prev => prev.filter((_, i) => i !== index));

  };
 
  const resetForm = () => {

    setFormData({

      channel_name: '',

      description: '',

      is_visible: true,

      admin_username: '',

      prompt_name: '',

      prompt_content: '',

    });

    setSelectedFiles([]);

  };
 
  const handleSubmit = async (e: React.FormEvent) => {

    e.preventDefault();
 
    if (!formData.channel_name.trim() || !formData.description.trim() || !formData.admin_username.trim()) {

      toast({

        title: "Validation Error",

        description: "Please fill in all required fields.",

        variant: "destructive",

      });

      return;

    }
 
    setIsLoading(true);
 
    try {

      const createData = new FormData();

      createData.append("channel_name", formData.channel_name);

      createData.append("description", formData.description);

      createData.append("is_visible", String(formData.is_visible));

      createData.append("admin_username", formData.admin_username);
 
      if (formData.prompt_name && formData.prompt_content) {

        createData.append("prompt_name", formData.prompt_name);

        createData.append("prompt_content", formData.prompt_content);

      }
 
      
      selectedFiles.forEach(file => {

        createData.append("files", file);

      });
 
      // ✅ Call backend

      await channelsApi.createChannel({

        channel_name: formData.channel_name,
      
        description: formData.description,
      
        is_visible: formData.is_visible,
      
        admin_user_id: formData.admin_username, // using username as ID
      
        files: selectedFiles,
      
        prompt: formData.prompt_name && formData.prompt_content
      
          ? {
      
              name: formData.prompt_name,
      
              content: formData.prompt_content,
      
            }
      
          : undefined,
      
      });
      
       
 
      toast({

        title: "Success",

        description: "Channel created successfully!",

        variant: "default",

      });
 
      resetForm();

      setIsOpen(false);

      onChannelCreated?.();

    } catch (error) {

      toast({

        title: "Error",

        description: error instanceof Error ? error.message : "Failed to create channel",

        variant: "destructive",

      });

    } finally {

      setIsLoading(false);

    }

  };
 
  return (
<Dialog open={isOpen} onOpenChange={setIsOpen}>
<DialogTrigger asChild>
<Button variant="hero" className="gap-2">
<Plus className="h-4 w-4" />

          Create Channel
</Button>
</DialogTrigger>
<DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
<DialogHeader>
<DialogTitle className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">

            Create New Channel
</DialogTitle>
<DialogDescription>

            Set up a new channel for your team to collaborate
</DialogDescription>
</DialogHeader>
 
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Channel Name */}
<div className="space-y-2">
<Label htmlFor="channel_name" className="text-sm font-medium">

              Channel Name *
</Label>
<Input

              id="channel_name"

              placeholder="Enter channel name"

              value={formData.channel_name}

              onChange={(e) => handleInputChange('channel_name', e.target.value)}

              required

            />
</div>

          {/* Description */}
          <div className="space-y-2">
<Label htmlFor="description" className="text-sm font-medium">

              Description *
</Label>
<Textarea

              id="description"

              placeholder="Describe what this channel is for"

              value={formData.description}

              onChange={(e) => handleInputChange('description', e.target.value)}

              required

            />
</div>
 
          {/* Public Channel Toggle */}
<div className="flex items-center justify-between p-4 bg-gradient-secondary rounded-lg border">
<div className="space-y-1">
<Label htmlFor="is_visible" className="text-sm font-medium">

                Public Channel
</Label>
<p className="text-xs text-muted-foreground">

                Make this channel visible to all users
</p>
</div>
<Switch

              id="is_visible"

              checked={formData.is_visible}

              onCheckedChange={(checked) => handleInputChange('is_visible', checked)}

            />
</div>
 
          {/* Admin Username */}
<div className="space-y-2">
<Label htmlFor="admin_username" className="text-sm font-medium">

              Admin Username *
</Label>
<Input

              id="admin_username"

              placeholder="Enter admin username"

              value={formData.admin_username}

              onChange={(e) => handleInputChange('admin_username', e.target.value)}

              required

            />
</div>
 
          {/* File Upload */}
<div className="space-y-2">
<Label htmlFor="files" className="text-sm font-medium">

              Select Files
</Label>
<div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
<Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
<Label

                htmlFor="files"

                className="cursor-pointer text-sm text-primary hover:text-primary/80"
>

                Click to upload files or drag and drop
</Label>
<Input

                id="files"

                type="file"

                multiple

                onChange={handleFileChange}

                className="hidden"

              />
</div>
 
            {/* Selected Files */}

            {selectedFiles.length > 0 && (
<div className="space-y-2">
<p className="text-sm font-medium">Selected Files:</p>
<div className="space-y-1">

                  {selectedFiles.map((file, index) => (
<div

                      key={index}

                      className="flex items-center justify-between p-2 bg-secondary rounded border"
>
<span className="text-sm truncate">{file.name}</span>
<Button

                        type="button"

                        variant="ghost"

                        size="sm"

                        onClick={() => removeFile(index)}

                        className="h-6 w-6 p-0"
>
<X className="h-3 w-3" />
</Button>
</div>

                  ))}
</div>
</div>

            )}
</div>
 
          {/* Prompt Section */}
<div className="space-y-4 p-4 bg-gradient-secondary rounded-lg border">
<h3 className="font-medium text-sm">Optional Prompt</h3>
 
            <div className="space-y-2">
<Label htmlFor="prompt_name" className="text-sm">

                Prompt Name
</Label>
<Input

                id="prompt_name"

                placeholder="Enter prompt name"

                value={formData.prompt_name}

                onChange={(e) => handleInputChange('prompt_name', e.target.value)}

              />
</div>
 
            <div className="space-y-2">
<Label htmlFor="prompt_content" className="text-sm">

                Prompt Content
</Label>
<Textarea

                id="prompt_content"

                placeholder="Enter prompt content"

                value={formData.prompt_content}

                onChange={(e) => handleInputChange('prompt_content', e.target.value)}

              />
</div>
</div>
 
          {/* Submit Button */}
<div className="flex justify-end space-x-3 pt-4">
<Button

              type="button"

              variant="outline"

              onClick={() => setIsOpen(false)}
>

              Cancel
</Button>
<Button

              type="submit"

              variant="gradient"

              disabled={isLoading}

              className="gap-2"
>

              {isLoading ? (
<>
<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />

                  Creating...
</>

              ) : (
<>
<Plus className="h-4 w-4" />

                  Create Channel
</>

              )}
</Button>
</div>
</form>
</DialogContent>
</Dialog>

  );

};
 
 