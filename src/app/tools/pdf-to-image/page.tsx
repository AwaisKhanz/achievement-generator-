'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { FileUploader } from '@/components/ui/file-uploader';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Image as ImageIcon, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Label } from '@/components/ui/label';

// Dynamically import pdfjs-dist to avoid SSR issues with canvas and DOMMatrix
const PdfToImageLogic = dynamic(() => import('./pdf-to-image-logic'), { ssr: false, loading: () => <p>Loading PDF engine...</p> });

export default function PdfToImagePage() {
    return (
        <ToolLayout
            title="PDF to Image Converter"
            description="Convert each page of your PDF into a high-quality PNG image."
        >
            <PdfToImageLogic />
        </ToolLayout>
    );
}
