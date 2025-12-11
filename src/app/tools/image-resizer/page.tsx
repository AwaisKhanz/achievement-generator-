'use client';

import { useState, useEffect, useMemo } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent } from '@/components/ui/card';
import imageCompression from 'browser-image-compression';
import { Download, RefreshCw, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function ImageResizerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressedFile, setCompressedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [quality, setQuality] = useState(0.8);
  const [maxWidth, setMaxWidth] = useState(1920);

  // Manage object URLs to avoid memory leaks
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [compressedFileUrl, setCompressedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setFileUrl(null);
    }
  }, [file]);

  useEffect(() => {
    if (compressedFile) {
      const url = URL.createObjectURL(compressedFile);
      setCompressedFileUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setCompressedFileUrl(null);
    }
  }, [compressedFile]);


  const handleFileSelect = (files: File[]) => {
    if (files.length > 0) {
      setFile(files[0]);
      setCompressedFile(null);
    } else {
      setFile(null);
      setCompressedFile(null);
    }
  };

  const processImage = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      const options = {
        maxSizeMB: 10, // Basically unlimited, we control by width/quality
        maxWidthOrHeight: maxWidth,
        useWebWorker: true,
        initialQuality: quality,
      };

      const compressedBlob = await imageCompression(file, options);
      // Create a new File object from the blob to keep the name and other properties
      const processedFile = new File([compressedBlob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      setCompressedFile(processedFile);
      toast.success('Image processed successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Failed to process image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadImage = () => {
    if (!compressedFile) return;
    // use the existing URL if available, otherwise create one temporarily (though we maintain one in state)
    // Actually we can just use URL.createObjectURL just for the download action if we didn't have it,
    // but since we have `compressedFileUrl` for preview, we can reuse it?
    // Wait, `a.href` works with the blob url.

    const url = compressedFileUrl || URL.createObjectURL(compressedFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = `processed-${compressedFile.name}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    if (!compressedFileUrl) URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Image Resizer & Compressor"
      description="Resize and compress your images directly in the browser without uploading them to a server."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <FileUploader
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg', '.webp']
                }}
                onFilesSelected={handleFileSelect}
                title="Upload Image"
                description="Drag & drop an image here, or click to select"
              />
            </CardContent>
          </Card>

          {file && (
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Quality: {Math.round(quality * 100)}%</Label>
                        </div>
                        <Slider
                            value={[quality]}
                            min={0.1}
                            max={1.0}
                            step={0.1}
                            onValueChange={(vals) => setQuality(vals[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <Label>Max Width: {maxWidth}px</Label>
                        </div>
                         <Slider
                            value={[maxWidth]}
                            min={100}
                            max={4000}
                            step={100}
                            onValueChange={(vals) => setMaxWidth(vals[0])}
                        />
                    </div>
                </div>

                <Button
                    onClick={processImage}
                    disabled={isProcessing}
                    className="w-full"
                >
                    {isProcessing ? (
                        <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Processing...
                        </>
                    ) : (
                        <>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            Process Image
                        </>
                    )}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
            {file && (
                <Card className="h-full">
                     <CardContent className="pt-6 h-full flex flex-col">
                        <h3 className="text-lg font-semibold mb-4">Preview</h3>
                        <div className="flex-1 flex items-center justify-center bg-muted/30 rounded-lg p-4 min-h-[300px]">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={compressedFileUrl || fileUrl || ''}
                                alt="Preview"
                                className="max-w-full max-h-[500px] object-contain"
                            />
                        </div>
                        {compressedFile && (
                             <div className="mt-6 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span>Original Size: {(file.size / 1024).toFixed(2)} KB</span>
                                    <span className="font-semibold text-primary">Compressed: {(compressedFile.size / 1024).toFixed(2)} KB</span>
                                </div>
                                <Button onClick={downloadImage} className="w-full" variant="secondary">
                                    <Download className="mr-2 h-4 w-4" />
                                    Download Processed Image
                                </Button>
                             </div>
                        )}
                     </CardContent>
                </Card>
            )}
             {!file && (
                <div className="h-full flex items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl p-12">
                    <div className="text-center">
                        <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-20" />
                        <p>Upload an image to see options and preview</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </ToolLayout>
  );
}
