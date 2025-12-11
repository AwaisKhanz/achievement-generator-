'use client';

import { useState } from 'react';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, Download } from 'lucide-react';
import { toast } from 'sonner';

// PDF.js worker setup
import * as pdfjsLib from 'pdfjs-dist';

// We need to set the worker source.
if (typeof window !== 'undefined' && 'Worker' in window) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}

export default function PdfToImageLogic() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [images, setImages] = useState<string[]>([]);

  const handleFileSelected = (files: File[]) => {
      setFile(files[0] || null);
      setImages([]);
  };

  const convertToImages = async () => {
    if (!file) return;

    setIsProcessing(true);
    setImages([]);

    try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const totalPages = pdf.numPages;

        const newImages: string[] = [];

        for (let i = 1; i <= totalPages; i++) {
            const page = await pdf.getPage(i);
            const scale = 2.0; // High resolution
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            if (context) {
                await page.render({ canvasContext: context, viewport }).promise;
                newImages.push(canvas.toDataURL('image/png'));
            }
        }

        setImages(newImages);
        toast.success(`Converted ${totalPages} pages to images!`);
    } catch (error) {
        console.error(error);
        toast.error('Failed to convert PDF to Image.');
    } finally {
        setIsProcessing(false);
    }
  };

  const downloadImage = (dataUrl: string, index: number) => {
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${file?.name.replace('.pdf', '')}-page-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
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
                    onClick={convertToImages}
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
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Convert to Images
                        </>
                    )}
                </Button>
            </div>
          )}

          {images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((img, index) => (
                      <Card key={index} className="overflow-hidden group">
                          <CardContent className="p-2">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={img} alt={`Page ${index + 1}`} className="w-full h-auto border rounded" />
                              <div className="mt-2 flex items-center justify-between">
                                  <span className="text-sm font-medium">Page {index + 1}</span>
                                  <Button variant="ghost" size="sm" onClick={() => downloadImage(img, index)}>
                                      <Download className="h-4 w-4" />
                                  </Button>
                              </div>
                          </CardContent>
                      </Card>
                  ))}
              </div>
          )}
      </div>
  );
}
