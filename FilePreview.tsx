import React from 'react';

import { Badge } from '@/components/ui/badge';

import { Button } from '@/components/ui/button';

import { ScrollArea } from '@/components/ui/scroll-area';

import { X, FileText, Image, File } from 'lucide-react';
 
interface FilePreviewProps {

  files: string[];

  onRemoveFile: (file: string) => void;

}
 
export const FilePreview: React.FC<FilePreviewProps> = ({

  files,

  onRemoveFile

}) => {

  const getFileIcon = (filename: string) => {

    const ext = filename.split('.').pop()?.toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {

      return <Image className="h-3 w-3" />;

    }

    if (['pdf', 'doc', 'docx', 'txt', 'md'].includes(ext || '')) {

      return <FileText className="h-3 w-3" />;

    }

    return <File className="h-3 w-3" />;

  };
 
  if (files.length === 0) return null;
 
  return (
<div className="mt-3 p-3 bg-muted/50 rounded-lg border">
<div className="flex items-center justify-between mb-2">
<span className="text-sm font-medium text-foreground">

          Selected Files ({files.length})
</span>
</div>
<ScrollArea className="max-h-20">
<div className="flex flex-wrap gap-2">

          {files.map((file, index) => (
<Badge

              key={index}

              variant="secondary"

              className="flex items-center gap-2 py-1 px-2 max-w-[200px]"
>

              {getFileIcon(file)}
<span className="truncate text-xs">{file}</span>
<Button

                variant="ghost"

                size="sm"

                className="h-4 w-4 p-0 hover:bg-destructive/20"

                onClick={() => onRemoveFile(file)}
>
<X className="h-3 w-3" />
</Button>
</Badge>

          ))}
</div>
</ScrollArea>
</div>

  );

};
 