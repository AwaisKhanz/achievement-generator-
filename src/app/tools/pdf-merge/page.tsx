'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { Merge } from 'lucide-react';
import { toast } from 'sonner';

export default function PdfMergePage() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge.');
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const file of files) {
        const fileBuffer = await file.arrayBuffer();
        const pdf = await PDFDocument.load(fileBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `merged-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDFs merged successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to merge PDFs. One or more files might be encrypted or corrupted.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document."
    >
      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <FileUploader
                accept={{
                  'application/pdf': ['.pdf']
                }}
                onFilesSelected={setFiles}
                maxFiles={20}
                title="Upload PDFs"
                description="Select multiple PDF files to merge"
              />
            </CardContent>
          </Card>

          <div className="flex justify-end">
             <Button
                onClick={mergePdfs}
                disabled={files.length < 2 || isProcessing}
                size="lg"
                className="w-full md:w-auto"
            >
                {isProcessing ? (
                    <>
                         <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                        Merging...
                    </>
                ) : (
                    <>
                        <Merge className="mr-2 h-4 w-4" />
                        Merge {files.length} PDFs
                    </>
                )}
            </Button>
          </div>
      </div>
    </ToolLayout>
  );
}
