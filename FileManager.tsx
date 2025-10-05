import React, { useState, useEffect } from 'react';

import { Card } from '@/components/ui/card';

import { Button } from '@/components/ui/button';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Badge } from '@/components/ui/badge';

import { Input } from '@/components/ui/input';

import { Upload, Search, FileText, Image, File, Trash2, Eye } from 'lucide-react';

import { filesApi, UserFile } from '@/lib/api';

import { useToast } from '@/hooks/use-toast';
 
interface FileItem {

  id: string;

  name: string;

  type: string;

  size: string;

  uploadDate: string;

  pages?: number;

}
 
interface FileManagerProps {

  selectedFiles: string[];

  onSelectFiles: (files: string[]) => void;

}
 
const convertUserFileToFileItem = (userFile: UserFile): FileItem => ({

  id: userFile.id,

  name: userFile.filename,

  type: userFile.file_type,

  size: `${(userFile.file_size / (1024 * 1024)).toFixed(1)} MB`,

  uploadDate: new Date(userFile.uploaded_at).toISOString().split('T')[0],

});
 
export const FileManager: React.FC<FileManagerProps> = ({

  selectedFiles,

  onSelectFiles

}) => {

  const [searchQuery, setSearchQuery] = useState('');

  const [files, setFiles] = useState<FileItem[]>([]);

  const [isUploading, setIsUploading] = useState(false);

  const { toast } = useToast();
 
  useEffect(() => {

    loadFiles();

  }, []);
 
  const loadFiles = async () => {

    try {

      const userFiles = await filesApi.getUserFiles();

      const fileItems = userFiles.map(convertUserFileToFileItem);

      setFiles(fileItems);

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to load files",

        variant: "destructive",

      });

    }

  };
 
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (!file) return;
 
    setIsUploading(true);

    try {

      const uploadedFile = await filesApi.uploadFile(file);

      const newFileItem = convertUserFileToFileItem(uploadedFile);

      setFiles(prev => [newFileItem, ...prev]);

      toast({

        title: "Success",

        description: "File uploaded successfully",

      });

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to upload file",

        variant: "destructive",

      });

    } finally {

      setIsUploading(false);

      // Reset the input

      event.target.value = '';

    }

  };
 
  const handleDeleteFile = async (fileId: string) => {

    try {

      await filesApi.deleteFile(fileId);

      const deletedFile = files.find(f => f.id === fileId);

      setFiles(prev => prev.filter(f => f.id !== fileId));

      if (deletedFile) {

        onSelectFiles(selectedFiles.filter(name => name !== deletedFile.name));

      }

      toast({

        title: "Success",

        description: "File deleted successfully",

      });

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to delete file",

        variant: "destructive",

      });

    }

  };
 
  const getFileIcon = (type: string) => {

    if (type === 'image' || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(type.toLowerCase())) {

      return <Image className="h-4 w-4" />;

    }

    if (['pdf', 'doc', 'docx', 'txt', 'markdown', 'md'].includes(type.toLowerCase())) {

      return <FileText className="h-4 w-4" />;

    }

    return <File className="h-4 w-4" />;

  };
 
  const filteredFiles = files.filter(file =>

    file.name.toLowerCase().includes(searchQuery.toLowerCase())

  );
 
  const toggleFileSelection = (fileName: string) => {

    const isSelected = selectedFiles.includes(fileName);

    if (isSelected) {

      onSelectFiles(selectedFiles.filter(f => f !== fileName));

    } else {

      onSelectFiles([...selectedFiles, fileName]);

    }

  };
 
  return (
<div className="h-full flex flex-col">

      {/* Header */}
<div className="p-4 border-b border-border">
<div className="flex items-center justify-between mb-3">
<h3 className="font-semibold text-foreground">Files</h3>
<label htmlFor="file-upload">
<Button 

              size="sm" 

              variant="outline" 

              className="h-8 gap-2" 

              disabled={isUploading}

              asChild
>
<span>
<Upload className="h-3 w-3" />

                {isUploading ? 'Uploading...' : 'Upload'}
</span>
</Button>
<input

              id="file-upload"

              type="file"

              className="hidden"

              onChange={handleFileUpload}

              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.pptx,.md"

            />
</label>
</div>

        {/* Search */}
<div className="relative">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
<Input

            placeholder="Search files..."

            value={searchQuery}

            onChange={(e) => setSearchQuery(e.target.value)}

            className="pl-10 h-9"

          />
</div>
</div>
 
      {/* Selected Files Summary */}

      {selectedFiles.length > 0 && (
<div className="p-3 bg-primary/5 border-b border-border">
<div className="text-sm text-primary font-medium">

            {selectedFiles.length} file{selectedFiles.length === 1 ? '' : 's'} selected
</div>
</div>

      )}
 
      {/* Files List */}
<ScrollArea className="flex-1">
<div className="p-3 space-y-2">

          {filteredFiles.length === 0 ? (
<div className="text-center py-8">
<div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
<FileText className="h-6 w-6 text-muted-foreground" />
</div>
<p className="text-sm text-muted-foreground">

                {searchQuery ? 'No files found' : 'No files uploaded yet'}
</p>
</div>

          ) : (

            filteredFiles.map((file) => (
<Card

                key={file.id}

                className={`p-3 cursor-pointer transition-all duration-200 hover:shadow-sm ${

                  selectedFiles.includes(file.name)

                    ? 'bg-primary/10 border-primary'

                    : 'hover:bg-muted/50'

                }`}

                onClick={() => toggleFileSelection(file.name)}
>
<div className="space-y-2">
<div className="flex items-start justify-between">
<div className="flex items-center gap-2 min-w-0 flex-1">

                      {getFileIcon(file.type)}
<div className="min-w-0 flex-1">
<p className="text-sm font-medium text-foreground truncate">

                          {file.name}
</p>
<p className="text-xs text-muted-foreground">

                          {file.size}
</p>
</div>
</div>
<div className="flex items-center gap-1 ml-2">
<Button

                        variant="ghost"

                        size="sm"

                        className="h-6 w-6 p-0"

                        onClick={(e) => {

                          e.stopPropagation();

                          window.open(filesApi.getFilePreviewUrl(file.id), '_blank');

                        }}
>
<Eye className="h-3 w-3" />
</Button>
<Button

                        variant="ghost"

                        size="sm"

                        className="h-6 w-6 p-0 hover:bg-destructive/20"

                        onClick={(e) => {

                          e.stopPropagation();

                          handleDeleteFile(file.id);

                        }}
>
<Trash2 className="h-3 w-3" />
</Button>
</div>
</div>
 
                  <div className="flex items-center justify-between">
<div className="flex gap-1">
<Badge variant="outline" className="text-xs">

                        {file.type.toUpperCase()}
</Badge>

                      {file.pages && (
<Badge variant="outline" className="text-xs">

                          {file.pages} pages
</Badge>

                      )}
</div>
<span className="text-xs text-muted-foreground">

                      {new Date(file.uploadDate).toLocaleDateString()}
</span>
</div>
</div>
</Card>

            ))

          )}
</div>
</ScrollArea>
 
      {/* Upload Area */}
<div className="p-3 border-t border-border">
<label htmlFor="file-upload-area">
<div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-4 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer">
<Upload className="h-6 w-6 text-muted-foreground mx-auto mb-2" />
<p className="text-xs text-muted-foreground">

              Drop files here or click to upload
</p>
</div>
<input

            id="file-upload-area"

            type="file"

            className="hidden"

            onChange={handleFileUpload}

            accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.xlsx,.pptx,.md"

          />
</label>
</div>
</div>

  );

};
 