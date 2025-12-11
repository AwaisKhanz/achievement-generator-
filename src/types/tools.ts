export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  category: 'PDF' | 'Image' | 'Text' | 'Video';
}

export type FileType = 'image/png' | 'image/jpeg' | 'image/webp' | 'application/pdf' | 'application/json' | 'text/markdown';
