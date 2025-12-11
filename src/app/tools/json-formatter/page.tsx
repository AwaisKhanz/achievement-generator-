'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';
import { Copy, FileJson, CheckCircle, AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamic import for react-json-view to avoid SSR issues
const ReactJson = dynamic(() => import('react-json-view'), { ssr: false });

export default function JsonFormatterPage() {
  const [input, setInput] = useState('');
  const [jsonObject, setJsonObject] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFormat = () => {
    if (!input.trim()) {
        setJsonObject(null);
        setError(null);
        return;
    }

    try {
      const parsed = JSON.parse(input);
      setJsonObject(parsed);
      setError(null);
      toast.success('JSON formatted successfully');
    } catch (e) {
      setJsonObject(null);
      if (e instanceof Error) {
          setError(e.message);
      } else {
          setError('Invalid JSON');
      }
      toast.error('Invalid JSON');
    }
  };

  const handleCopy = () => {
      if (jsonObject) {
          navigator.clipboard.writeText(JSON.stringify(jsonObject, null, 2));
          toast.success('Copied to clipboard');
      }
  };

  const handleClear = () => {
      setInput('');
      setJsonObject(null);
      setError(null);
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, validate, and beautify your JSON data. Detect errors and view your JSON in a tree view."
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-[calc(100vh-300px)] min-h-[500px]">
        <div className="flex flex-col space-y-4 h-full">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Input JSON</h3>
                <div className="space-x-2">
                     <Button variant="outline" size="sm" onClick={handleClear} disabled={!input}>
                        <XCircle className="mr-2 h-4 w-4" />
                        Clear
                    </Button>
                    <Button size="sm" onClick={handleFormat}>
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Format & Validate
                    </Button>
                </div>
            </div>
            <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste your JSON here..."
                className={cn("flex-1 font-mono text-sm resize-none", error ? "border-red-500 focus-visible:ring-red-500" : "")}
            />
             {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm flex items-start">
                    <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                    <span className="break-all">{error}</span>
                </div>
            )}
        </div>

        <div className="flex flex-col space-y-4 h-full">
            <div className="flex justify-between items-center">
                <h3 className="font-semibold">Formatted Output</h3>
                 <Button variant="outline" size="sm" onClick={handleCopy} disabled={!jsonObject}>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                </Button>
            </div>
            <Card className="flex-1 overflow-hidden">
                <CardContent className="p-0 h-full overflow-auto bg-card">
                    {jsonObject ? (
                        <div className="p-4">
                            <ReactJson
                                src={jsonObject}
                                theme="rjv-default"
                                displayDataTypes={false}
                                style={{ backgroundColor: 'transparent', fontSize: '14px', fontFamily: 'monospace' }}
                            />
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <FileJson className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                <p>Formatted JSON will appear here</p>
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
