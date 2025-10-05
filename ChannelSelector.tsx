import React from 'react';

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Channel } from "@/lib/api";

import { Hash, Users, FileText } from "lucide-react";
 
interface ChannelSelectorProps {

  channel: Channel;

  isSelected: boolean;

  onSelect: () => void;

}
 
export const ChannelSelector: React.FC<ChannelSelectorProps> = ({ 

  channel, 

  isSelected, 

  onSelect 

}) => {

  return (
<Card 

      className={`p-3 cursor-pointer transition-colors ${

        isSelected 

          ? 'bg-muted border-primary' 

          : 'hover:bg-muted/50'

      }`}

      onClick={onSelect}
>
<div className="flex items-center gap-3">
<Hash className="h-4 w-4 text-muted-foreground" />
<div className="flex-1 min-w-0">
<div className="text-sm font-medium truncate">{channel.channel_name}</div>
<div className="text-xs text-muted-foreground truncate">

            {channel.description}
</div>
<div className="flex gap-2 mt-1">
<Badge variant="outline" className="text-xs">
<Users className="h-3 w-3 mr-1" />

              {channel.members_count || channel.user_ids?.length || 0}
</Badge>
<Badge variant="outline" className="text-xs">
<FileText className="h-3 w-3 mr-1" />

              {channel.files_count || channel.files?.length || 0}
</Badge>
</div>
</div>
</div>
</Card>

  );

};
 