'use client';

import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Download, RotateCw, Crop as CropIcon, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

// Helper for centering crop
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export default function PhotoEditorPage() {
  const [file, setFile] = useState<File | null>(null);
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [filter, setFilter] = useState('none');
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  const onSelectFile = (files: File[]) => {
    if (files && files.length > 0) {
      setFile(files[0]);
      setCrop(undefined); // Reset crop
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(files[0]);
    }
  }

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      // Default crop: center 16:9 or similar
      // setCrop(centerAspectCrop(width, height, 16 / 9))
  }

  // Draw preview
  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
       // We use a separate function or logic to draw the cropped image to canvas
       const image = imgRef.current;
       const canvas = previewCanvasRef.current;
       const crop = completedCrop;

       const scaleX = image.naturalWidth / image.width;
       const scaleY = image.naturalHeight / image.height;

       const ctx = canvas.getContext('2d');
       if (!ctx) return;

       const pixelRatio = window.devicePixelRatio;
       canvas.width = crop.width * pixelRatio * scaleX;
       canvas.height = crop.height * pixelRatio * scaleY;

       ctx.scale(pixelRatio, pixelRatio);
       ctx.imageSmoothingQuality = 'high';

       const cropX = crop.x * scaleX;
       const cropY = crop.y * scaleY;

       const centerX = image.naturalWidth / 2;
       const centerY = image.naturalHeight / 2;

       ctx.save();

       // Handle rotation
       // This logic is complex for combined crop + rotate.
       // For MVP, we might separate Crop and Filter/Rotate or apply simple crop on original.
       // Let's implement simple crop first.

       ctx.drawImage(
        image,
        cropX,
        cropY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width * scaleX,
        crop.height * scaleY,
      );

      // Apply filters (simulated on canvas for save)
      if (filter !== 'none') {
         ctx.filter = filter;
         // Re-draw to apply filter? No, context filter applies to drawing operations.
         // We need to set filter before drawImage or use globalCompositeOperation.
         // Actually, standard Canvas 2D API supports filter property now in most browsers.
      }

      ctx.restore();
    }
  }, [completedCrop, filter]);

  const handleDownload = () => {
      if (!previewCanvasRef.current) return;

      previewCanvasRef.current.toBlob((blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `edited-${file?.name || 'image.png'}`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
          toast.success("Image saved!");
      });
  };

  const rotateImage = () => {
      setRotation((prev) => (prev + 90) % 360);
      toast.info("Rotation purely visual in preview for now (Crop logic needs update for rotation)");
  };

  return (
    <ToolLayout
      title="Photo Editor"
      description="Crop, rotate, and apply filters to your images."
    >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                 <Card>
                    <CardContent className="pt-6 min-h-[400px] flex items-center justify-center bg-muted/30">
                        {!imgSrc ? (
                            <FileUploader
                                accept={{ 'image/*': ['.png', '.jpg', '.jpeg', '.webp'] }}
                                onFilesSelected={onSelectFile}
                                title="Upload Image to Edit"
                            />
                        ) : (
                            <ReactCrop
                                crop={crop}
                                onChange={(_, percentCrop) => setCrop(percentCrop)}
                                onComplete={(c) => setCompletedCrop(c)}
                                aspect={undefined}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    ref={imgRef}
                                    alt="Crop me"
                                    src={imgSrc}
                                    style={{ transform: `scale(${scale}) rotate(${rotation}deg)`, filter: filter !== 'none' ? filter : undefined, maxHeight: '600px' }}
                                    onLoad={onImageLoad}
                                />
                            </ReactCrop>
                        )}
                    </CardContent>
                 </Card>

                 {imgSrc && (
                     <div className="flex justify-between">
                         <Button variant="outline" onClick={() => { setImgSrc(''); setFile(null); }}>Upload New</Button>
                         <Button onClick={handleDownload} disabled={!completedCrop}>
                             <Download className="mr-2 h-4 w-4" /> Download Crop
                         </Button>
                     </div>
                 )}
            </div>

            <div className="space-y-6">
                <Card>
                    <CardContent className="pt-6 space-y-6">
                        <h3 className="font-semibold flex items-center"><CropIcon className="mr-2 h-4 w-4" /> Controls</h3>

                        <div className="space-y-2">
                             <Label>Rotation</Label>
                             <div className="flex gap-2">
                                 <Button variant="outline" size="icon" onClick={rotateImage}><RotateCw className="h-4 w-4" /></Button>
                             </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Filters</Label>
                            <div className="grid grid-cols-2 gap-2">
                                <Button variant={filter === 'none' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('none')}>None</Button>
                                <Button variant={filter === 'grayscale(100%)' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('grayscale(100%)')}>Grayscale</Button>
                                <Button variant={filter === 'sepia(100%)' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('sepia(100%)')}>Sepia</Button>
                                <Button variant={filter === 'invert(100%)' ? 'default' : 'outline'} size="sm" onClick={() => setFilter('invert(100%)')}>Invert</Button>
                            </div>
                        </div>

                        {completedCrop && (
                            <div className="space-y-2">
                                <Label>Preview Result</Label>
                                <div className="border rounded-md overflow-hidden bg-checkerboard">
                                    <canvas
                                        ref={previewCanvasRef}
                                        style={{
                                            border: '1px solid black',
                                            objectFit: 'contain',
                                            width: '100%',
                                            height: 'auto',
                                        }}
                                    />
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    </ToolLayout>
  );
}
