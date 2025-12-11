'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone'; // I need to install react-dropzone
import { UploadCloud, File as FileIcon, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  accept: Record<string, string[]>;
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  className?: string;
  title?: string;
  description?: string;
}

export function FileUploader({
  accept,
  onFilesSelected,
  maxFiles = 1,
  className,
  title = "Upload files",
  description = "Drag & drop files here, or click to select files"
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = maxFiles === 1 ? [acceptedFiles[0]] : [...files, ...acceptedFiles];
    setFiles(newFiles);
    onFilesSelected(newFiles);
  }, [files, maxFiles, onFilesSelected]);

  const removeFile = (fileToRemove: File) => {
    const newFiles = files.filter(f => f !== fileToRemove);
    setFiles(newFiles);
    onFilesSelected(newFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles
  });

  return (
    <div className={cn("w-full space-y-4", className)}>
      {files.length === 0 || maxFiles > 1 ? (
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors hover:bg-muted/50",
            isDragActive ? "border-primary bg-muted" : "border-muted-foreground/25"
          )}
        >
          <input {...getInputProps()} />
          <UploadCloud className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-2">{description}</p>
        </div>
      ) : null}

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, i) => (
            <div key={i} className="flex items-center justify-between p-3 border rounded-md bg-background">
              <div className="flex items-center space-x-3">
                <FileIcon className="h-6 w-6 text-primary" />
                <div className="text-sm">
                  <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeFile(file)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
