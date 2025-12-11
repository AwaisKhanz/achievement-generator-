'use client';

import { useState } from 'react';
import { ToolLayout } from '@/components/ui/tool-layout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { diffChars, diffWords, diffLines, Change } from 'diff';
import { cn } from '@/lib/utils';
import { Settings } from 'lucide-react';

type DiffMode = 'chars' | 'words' | 'lines';

export default function DiffCheckerPage() {
  const [original, setOriginal] = useState('');
  const [modified, setModified] = useState('');
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [mode, setMode] = useState<DiffMode>('words');

  const compare = () => {
      let diff;
      switch (mode) {
          case 'chars': diff = diffChars(original, modified); break;
          case 'words': diff = diffWords(original, modified); break;
          case 'lines': diff = diffLines(original, modified); break;
          default: diff = diffWords(original, modified);
      }
      setDiffResult(diff);
  };

  return (
    <ToolLayout
      title="Diff Checker"
      description="Compare two text files and highlight the differences."
    >
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-muted/30 p-4 rounded-lg">
                 <div className="flex items-center space-x-4">
                     <span className="text-sm font-medium">Compare Mode:</span>
                     <div className="flex space-x-2">
                         <Button variant={mode === 'lines' ? 'default' : 'outline'} size="sm" onClick={() => setMode('lines')}>Lines</Button>
                         <Button variant={mode === 'words' ? 'default' : 'outline'} size="sm" onClick={() => setMode('words')}>Words</Button>
                         <Button variant={mode === 'chars' ? 'default' : 'outline'} size="sm" onClick={() => setMode('chars')}>Chars</Button>
                     </div>
                 </div>
                 <Button onClick={compare}>Compare Text</Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label>Original Text</Label>
                    <Textarea
                        className="h-64 font-mono text-sm"
                        placeholder="Paste original text here..."
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                    />
                </div>
                <div className="space-y-2">
                    <Label>Modified Text</Label>
                    <Textarea
                        className="h-64 font-mono text-sm"
                        placeholder="Paste modified text here..."
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                    />
                </div>
            </div>

            {diffResult.length > 0 && (
                <Card>
                    <CardContent className="pt-6">
                        <Label className="mb-2 block">Comparison Result</Label>
                        <div className="p-4 border rounded-md bg-background font-mono text-sm whitespace-pre-wrap">
                            {diffResult.map((part, index) => {
                                const color = part.added ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                                              part.removed ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 decoration-line-through' :
                                              'text-foreground';
                                return (
                                    <span key={index} className={cn(color, "px-0.5 rounded")}>
                                        {part.value}
                                    </span>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    </ToolLayout>
  );
}
