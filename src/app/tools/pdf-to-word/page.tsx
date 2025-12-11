'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function PdfToWordPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileSelected = (files: File[]) => {
      setFile(files[0] || null);
  };

  const convertToWord = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/convert/pdf-to-word', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 501 && data.code === 'DEPENDENCY_MISSING') {
            toast.error('Server configuration required: LibreOffice is missing in this environment.');
            return;
        }
        throw new Error(data.error || 'Conversion failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, '.docx');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Converted successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to convert PDF. Please try again later.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="PDF to Word Converter"
      description="Convert your PDF documents to editable Word (DOCX) files."
    >
      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <FileUploader
                accept={{
                  'application/pdf': ['.pdf']
                }}
                onFilesSelected={handleFileSelected}
                title="Upload PDF"
                description="Select a PDF file to convert"
              />
            </CardContent>
          </Card>

          {file && (
            <div className="flex justify-end">
                <Button
                    onClick={convertToWord}
                    disabled={isProcessing}
                    size="lg"
                    className="w-full md:w-auto"
                >
                    {isProcessing ? (
                        <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                            Converting...
                        </>
                    ) : (
                        <>
                            <FileText className="mr-2 h-4 w-4" />
                            Convert to Word
                        </>
                    )}
                </Button>
            </div>
          )}
      </div>
    </ToolLayout>
  );
}
