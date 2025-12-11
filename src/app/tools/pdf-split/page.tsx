'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { PDFDocument } from 'pdf-lib';
import { Download, Scissors, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function PdfSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitRange, setSplitRange] = useState<string>(''); // e.g., "1-2, 5"

  const handleFileSelected = async (files: File[]) => {
      if (files.length > 0) {
          const f = files[0];
          setFile(f);
          try {
             const arrayBuffer = await f.arrayBuffer();
             const pdfDoc = await PDFDocument.load(arrayBuffer);
             setPageCount(pdfDoc.getPageCount());
             setSplitRange(`1-${pdfDoc.getPageCount()}`);
          } catch (e) {
              toast.error("Failed to load PDF metadata");
          }
      } else {
          setFile(null);
          setPageCount(0);
      }
  };

  const splitPdf = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const totalPages = pdfDoc.getPageCount();

      // Parse range string (simple implementation: comma separated single pages or ranges)
      const pagesToKeep = new Set<number>();
      const parts = splitRange.split(',').map(p => p.trim());

      for (const part of parts) {
          if (part.includes('-')) {
              const [start, end] = part.split('-').map(Number);
              if (!isNaN(start) && !isNaN(end)) {
                  for (let i = start; i <= end; i++) {
                      if (i >= 1 && i <= totalPages) pagesToKeep.add(i - 1); // 0-indexed
                  }
              }
          } else {
              const num = Number(part);
              if (!isNaN(num) && num >= 1 && num <= totalPages) {
                  pagesToKeep.add(num - 1);
              }
          }
      }

      if (pagesToKeep.size === 0) {
          toast.error("Invalid page selection.");
          setIsProcessing(false);
          return;
      }

      const newPdf = await PDFDocument.create();
      const copiedPages = await newPdf.copyPages(pdfDoc, Array.from(pagesToKeep).sort((a, b) => a - b));
      copiedPages.forEach(page => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `split-${file.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success('PDF split successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to split PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract pages from your PDF document. Specify ranges or single pages."
    >
      <div className="grid grid-cols-1 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <FileUploader
                accept={{
                  'application/pdf': ['.pdf']
                }}
                onFilesSelected={handleFileSelected}
                title="Upload PDF to Split"
                description="Select a PDF file"
              />
            </CardContent>
          </Card>

          {file && (
            <Card>
                <CardContent className="pt-6 space-y-6">
                    <div className="flex items-center space-x-4 p-4 border rounded-lg bg-muted/50">
                        <FileText className="h-8 w-8 text-primary" />
                        <div>
                            <p className="font-medium">{file.name}</p>
                            <p className="text-sm text-muted-foreground">{pageCount} Pages</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="range">Page Range to Extract</Label>
                        <Input
                            id="range"
                            placeholder="e.g. 1-3, 5, 7-9"
                            value={splitRange}
                            onChange={(e) => setSplitRange(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Enter page numbers and/or ranges separated by commas.</p>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            onClick={splitPdf}
                            disabled={isProcessing}
                            size="lg"
                            className="w-full md:w-auto"
                        >
                            {isProcessing ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent"></div>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <Scissors className="mr-2 h-4 w-4" />
                                    Download Selected Pages
                                </>
                            )}
                        </Button>
                    </div>
                </CardContent>
            </Card>
          )}
      </div>
    </ToolLayout>
  );
}
