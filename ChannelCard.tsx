import React from 'react';

import { Users, FileText, Calendar, Eye, Hash } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';

import { Channel } from '@/lib/api';
 
interface ChannelCardProps {

  channel: Channel;

  onView: (channelId: string) => void;

}
 
export const ChannelCard: React.FC<ChannelCardProps> = ({ channel, onView }) => {

  const formatDate = (dateString: string) => {

    return new Date(dateString).toLocaleDateString('en-US', {

      year: 'numeric',

      month: 'short',

      day: 'numeric',

    });

  };
 
  const truncateText = (text: string, maxLength: number) => {

    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;

  };
 
  return (
<Card className="group relative overflow-hidden transition-all duration-300 hover:shadow-elegant hover:-translate-y-1 border border-border/50 hover:border-primary/20 bg-gradient-to-br from-card to-card/95">

      {/* Gradient overlay on hover */}
<div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-300" />
<CardHeader className="relative">
<div className="flex items-start justify-between">
<div className="flex items-center gap-2">
<div className="p-2 bg-gradient-primary rounded-lg">
<Hash className="h-4 w-4 text-white" />
</div>
<div>
<h3 className="font-semibold text-lg text-card-foreground group-hover:text-primary transition-colors duration-200">

                {truncateText(channel.channel_name, 25)}
</h3>
<div className="flex items-center gap-2 mt-1">
<Badge variant={channel.is_visible ? "default" : "secondary"} className="text-xs">

                  {channel.is_visible ? (
<><Eye className="h-3 w-3 mr-1" /> Public</>

                  ) : (
<><Eye className="h-3 w-3 mr-1" /> Private</>

                  )}
</Badge>
</div>
</div>
</div>
</div>
</CardHeader>
 
      <CardContent className="relative space-y-4">

        {/* Description */}
<p className="text-muted-foreground text-sm leading-relaxed">

          {truncateText(channel.description, 120)}
</p>
 
        {/* Admin and Stats */}
<div className="space-y-3">
<div className="flex items-center gap-2">
<div className="w-6 h-6 bg-gradient-primary rounded-full flex items-center justify-center">
<span className="text-white text-xs font-medium">

                {(channel.admin_username || 'A')[0].toUpperCase()}
</span>
</div>
<span className="text-sm font-medium">

              Admin: {channel.admin_username || 'Unknown'}
</span>
</div>
 
          {/* Stats Grid */}
<div className="grid grid-cols-3 gap-3">
<div className="flex items-center gap-1 p-2 bg-gradient-secondary rounded-lg">
<Users className="h-4 w-4 text-primary" />
<span className="text-sm font-medium">

                {channel.members_count || channel.user_ids?.length || 0}
</span>
</div>
<div className="flex items-center gap-1 p-2 bg-gradient-secondary rounded-lg">
<FileText className="h-4 w-4 text-primary" />
<span className="text-sm font-medium">

                {channel.files_count || channel.files?.length || 0}
</span>
</div>
<div className="flex items-center gap-1 p-2 bg-gradient-secondary rounded-lg">
<Calendar className="h-4 w-4 text-primary" />
<span className="text-xs">

                {formatDate(channel.created_at)}
</span>
</div>
</div>
</div>
</CardContent>
 
      <CardFooter className="relative">
<Button 

          onClick={() => onView(channel.id)}

          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200"

          variant="outline"
>
<Eye className="h-4 w-4 mr-2" />

          Open Channel
</Button>
</CardFooter>
</Card>

  );

};
 