'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import ReactMarkdown from 'react-markdown';
import { FileCode, Eye } from 'lucide-react';

export default function MarkdownPreviewPage() {
  const [markdown, setMarkdown] = useState('# Hello World\n\nWrite your markdown here...');

  return (
    <ToolLayout
      title="Markdown Preview"
      description="Real-time Markdown to HTML preview."
    >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-300px)] min-h-[500px]">
            <div className="flex flex-col space-y-2 h-full">
                <div className="flex items-center space-x-2 font-medium">
                    <FileCode className="h-4 w-4" />
                    <span>Markdown Input</span>
                </div>
                <Textarea
                    className="flex-1 font-mono text-sm resize-none p-4"
                    value={markdown}
                    onChange={(e) => setMarkdown(e.target.value)}
                />
            </div>

            <div className="flex flex-col space-y-2 h-full">
                 <div className="flex items-center space-x-2 font-medium">
                    <Eye className="h-4 w-4" />
                    <span>Live Preview</span>
                </div>
                <Card className="flex-1 overflow-hidden">
                    <CardContent className="h-full overflow-auto p-6 prose dark:prose-invert max-w-none">
                        <ReactMarkdown>{markdown}</ReactMarkdown>
                    </CardContent>
                </Card>
            </div>
        </div>
    </ToolLayout>
  );
}
