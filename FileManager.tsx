import React, { useState, useEffect } from 'react';

import { Button } from "@/components/ui/button";

import { Card } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { Checkbox } from "@/components/ui/checkbox";

import { useToast } from "@/hooks/use-toast";

import { filesApi, UserFile } from "@/lib/api";

import { Upload, File, Trash2, Eye } from "lucide-react";
 
interface FileManagerProps {

  selectedFiles: UserFile[];

  onFilesChange: (files: UserFile[]) => void;

}
 
export const FileManager: React.FC<FileManagerProps> = ({ selectedFiles, onFilesChange }) => {

  const [files, setFiles] = useState<UserFile[]>([]);

  const [uploading, setUploading] = useState(false);

  const { toast } = useToast();
 
  useEffect(() => {

    loadFiles();

  }, []);
 
  const loadFiles = async () => {

    try {

      // Mock data for now since backend is not accessible

      const mockFiles: UserFile[] = [

        {

          id: '1',

          filename: 'document1.pdf',

          file_type: 'application/pdf',

          file_size: 1024000,

          uploaded_at: new Date().toISOString(),

        },

        {

          id: '2', 

          filename: 'spreadsheet.xlsx',

          file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',

          file_size: 512000,

          uploaded_at: new Date().toISOString(),

        }

      ];

      setFiles(mockFiles);

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to load files",

        variant: "destructive",

      });

    }

  };
 
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {

    const uploadedFiles = event.target.files;

    if (!uploadedFiles) return;
 
    setUploading(true);

    try {

      // Mock file upload for now

      const newFiles: UserFile[] = Array.from(uploadedFiles).map((file, index) => ({

        id: Date.now().toString() + index,

        filename: file.name,

        file_type: file.type,

        file_size: file.size,

        uploaded_at: new Date().toISOString(),

      }));

      setFiles(prev => [...prev, ...newFiles]);

      toast({

        title: "Success",

        description: `${newFiles.length} file(s) uploaded successfully`,

      });

    } catch (error) {

      toast({

        title: "Error",

        description: "Failed to upload files",

        variant: "destructive",

      });

    } finally {

      setUploading(false);

      event.target.value = '';

    }

  };
 
  const handleFileSelect = (file: UserFile, checked: boolean) => {

    if (checked) {

      onFilesChange([...selectedFiles, file]);

    } else {

      onFilesChange(selectedFiles.filter(f => f.id !== file.id));

    }

  };
 
  const handleDeleteFile = async (fileId: string) => {

    try {

      // Mock delete for now

      setFiles(prev => prev.filter(f => f.id !== fileId));

      onFilesChange(selectedFiles.filter(f => f.id !== fileId));

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
 
  const formatFileSize = (bytes: number) => {

    if (bytes === 0) return '0 Bytes';

    const k = 1024;

    const sizes = ['Bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];

  };
 
  return (
<div className="space-y-4">
<div className="flex items-center gap-2">
<input

          type="file"

          multiple

          onChange={handleFileUpload}

          className="hidden"

          id="file-upload"

          disabled={uploading}

        />
<Button

          variant="outline"

          size="sm"

          disabled={uploading}

          onClick={() => document.getElementById('file-upload')?.click()}
>
<Upload className="h-4 w-4 mr-2" />

          {uploading ? 'Uploading...' : 'Upload Files'}
</Button>
</div>
 
      {selectedFiles.length > 0 && (
<Card className="p-3">
<div className="text-sm font-medium mb-2">Selected Files ({selectedFiles.length})</div>
<div className="flex flex-wrap gap-1">

            {selectedFiles.map(file => (
<Badge key={file.id} variant="secondary" className="text-xs">

                {file.filename}
</Badge>

            ))}
</div>
</Card>

      )}
 
      <div className="space-y-2 max-h-96 overflow-y-auto">

        {files.map((file) => (
<Card key={file.id} className="p-3">
<div className="flex items-center gap-3">
<Checkbox

                checked={selectedFiles.some(f => f.id === file.id)}

                onCheckedChange={(checked) => handleFileSelect(file, checked as boolean)}

              />
<File className="h-4 w-4 text-muted-foreground" />
<div className="flex-1 min-w-0">
<div className="text-sm font-medium truncate">{file.filename}</div>
<div className="text-xs text-muted-foreground">

                  {formatFileSize(file.file_size)} • {file.file_type}
</div>
</div>
 
              <div className="flex items-center gap-1">
<Button

                  variant="ghost"

                  size="icon"

                  className="h-8 w-8"

                  onClick={() => toast({ title: "Info", description: "File preview not available in demo mode" })}
>
<Eye className="h-3 w-3" />
</Button>
<Button

                  variant="ghost"

                  size="icon"

                  className="h-8 w-8 text-destructive"

                  onClick={() => handleDeleteFile(file.id)}
>
<Trash2 className="h-3 w-3" />
</Button>
</div>
</div>
</Card>

        ))}
</div>
 
      {files.length === 0 && !uploading && (
<div className="text-center py-8 text-sm text-muted-foreground">

          No files uploaded yet. Upload some files to get started.
</div>

      )}
</div>

  );

};
 