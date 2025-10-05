// components/ChatSidebar.tsx

import React, { useState, useEffect } from 'react';

import { Card } from "@/components/ui/card";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { Button } from "@/components/ui/button";

import { Badge } from "@/components/ui/badge";

import { FileManager } from "@/components/FileManager";

import { PromptManager } from "@/components/chat/PromptManager";

import { ChatHistory } from "@/components/ChatHistory";

import { ChannelSelector } from "@/components/ChannelSelector";

import { channelsApi, Channel, UserFile, Prompt } from "@/lib/api";

import {

  ChevronDown,

  ChevronRight,

  Files,

  MessageSquare,

  Hash,

  MessageCircle

} from "lucide-react";

import { ChatContext } from "@/pages/ChatInterface";
 
interface ChatSidebarProps {

  chatContext: ChatContext;

  updateChatContext: (updates: Partial<ChatContext>) => void;

}
 
export const ChatSidebar: React.FC<ChatSidebarProps> = ({ chatContext, updateChatContext }) => {

  console.log('ChatSidebar rendering with context:', chatContext);
 
  const [openSections, setOpenSections] = useState({

    files: true,

    prompts: true,

    chats: true,

    channels: true,

  });
 
  const [channels, setChannels] = useState<Channel[]>([]);
 
  useEffect(() => {

    loadChannels();

  }, []);
 
  const loadChannels = async () => {

    try {

      // Mock data for now since backend is not accessible

      const mockChannels: Channel[] = [

        {

          id: '1',

          channel_name: 'General Discussion',

          description: 'General chat and collaboration',

          is_visible: true,

          admin_user_id: 'admin',

          created_at: new Date().toISOString(),

          updated_at: new Date().toISOString(),

          user_ids: [],

          members_count: 3,

          files_count: 5,

        }

      ];

      setChannels(mockChannels);

    } catch (error) {

      console.error('Failed to load channels:', error);

    }

  };
 
  const toggleSection = (section: keyof typeof openSections) => {

    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));

  };
 
  const handleFilesChange = (files: UserFile[]) => {

    updateChatContext({ selectedFiles: files });

  };
 
  // New: handle single prompt selection

  const handlePromptSelect = (promptId: string | null) => {

    updateChatContext({ selectedPrompt: promptId });

  };
 
  const handleChatSelect = (chatId: string | null) => {

    updateChatContext({ currentChatId: chatId });

  };
 
  const handleNewChat = () => {

    // Reset context for new chat

    updateChatContext({

      currentChatId: null,

      selectedFiles: [],

      selectedPrompt: null,   // reset single prompt

      selectedChannel: null

    });

  };
 
  const handleChannelSelect = (channelId: string) => {

    updateChatContext({ selectedChannel: channelId });

  };
 
  return (
<div className="w-80 bg-background border-l border-border h-full overflow-y-auto">
<div className="p-4 space-y-4">
 
        {/* Files Section */}
<Collapsible open={openSections.files} onOpenChange={() => toggleSection('files')}>
<CollapsibleTrigger asChild>
<Button variant="ghost" className="w-full justify-between">
<div className="flex items-center gap-2">
<Files className="h-4 w-4" />
<span>Files</span>

                {chatContext.selectedFiles.length > 0 && (
<Badge variant="secondary" className="ml-auto">

                    {chatContext.selectedFiles.length}
</Badge>

                )}
</div>

              {openSections.files ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
</Button>
</CollapsibleTrigger>
<CollapsibleContent className="space-y-2">
<FileManager

              selectedFiles={chatContext.selectedFiles}

              onFilesChange={handleFilesChange}

            />
</CollapsibleContent>
</Collapsible>
 
        {/* Prompts Section */}
<Collapsible open={openSections.prompts} onOpenChange={() => toggleSection('prompts')}>
<CollapsibleTrigger asChild>
<Button variant="ghost" className="w-full justify-between">
<div className="flex items-center gap-2">
<MessageSquare className="h-4 w-4" />
<span>Prompts</span>

                {chatContext.selectedPrompt && (
<Badge variant="secondary" className="ml-auto">

                    Active
</Badge>

                )}
</div>

              {openSections.prompts ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
</Button>
</CollapsibleTrigger>
<CollapsibleContent className="space-y-2">
<PromptManager

              selectedPrompt={chatContext.selectedPrompt}   // single string

              onSelectPrompt={handlePromptSelect}

            />
</CollapsibleContent>
</Collapsible>
 
        {/* Chats Section */}
<Collapsible open={openSections.chats} onOpenChange={() => toggleSection('chats')}>
<CollapsibleTrigger asChild>
<Button variant="ghost" className="w-full justify-between">
<div className="flex items-center gap-2">
<MessageCircle className="h-4 w-4" />
<span>Chats</span>

                {chatContext.currentChatId && (
<Badge variant="secondary" className="ml-auto">Active</Badge>

                )}
</div>

              {openSections.chats ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
</Button>
</CollapsibleTrigger>
<CollapsibleContent className="space-y-2">
<ChatHistory

              currentChatId={chatContext.currentChatId}

              onChatSelect={handleChatSelect}

              onNewChat={handleNewChat}

            />
</CollapsibleContent>
</Collapsible>
 
        {/* Channels Section */}
<Collapsible open={openSections.channels} onOpenChange={() => toggleSection('channels')}>
<CollapsibleTrigger asChild>
<Button variant="ghost" className="w-full justify-between">
<div className="flex items-center gap-2">
<Hash className="h-4 w-4" />
<span>Channels</span>

                {chatContext.selectedChannel && (
<Badge variant="secondary" className="ml-auto">Connected</Badge>

                )}
</div>

              {openSections.channels ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
</Button>
</CollapsibleTrigger>
<CollapsibleContent className="space-y-2">
<div className="space-y-2 max-h-64 overflow-y-auto">

              {channels.map((channel) => (
<ChannelSelector

                  key={channel.id}

                  channel={channel}

                  isSelected={chatContext.selectedChannel === channel.id}

                  onSelect={() => handleChannelSelect(channel.id)}

                />

              ))}
</div>
 
            {channels.length === 0 && (
<div className="text-center py-8 text-sm text-muted-foreground">

                No channels available.
</div>

            )}
</CollapsibleContent>
</Collapsible>
</div>
</div>

  );

};

 