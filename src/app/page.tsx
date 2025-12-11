'use client';

import { Tool } from "@/types/tools";
import { ToolCard } from "@/components/ui/tool-card";
import { FileText, Image, Code, FileCode, Scissors, FileInput } from "lucide-react";

const tools: Tool[] = [
  {
    id: "pdf-merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into a single document efficiently.",
    icon: FileInput,
    href: "/tools/pdf-merge",
    category: "PDF"
  },
  {
    id: "pdf-to-word",
    name: "PDF to Word",
    description: "Convert PDF documents to editable Word files while preserving formatting.",
    icon: FileText,
    href: "/tools/pdf-to-word",
    category: "PDF"
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize and compress images directly in your browser.",
    icon: Image,
    href: "/tools/image-resizer",
    category: "Image"
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify your JSON data.",
    icon: Code,
    href: "/tools/json-formatter",
    category: "Text"
  },
  // Add more tools as we implement them
];

export default function Home() {
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className="container mx-auto px-4 py-16 max-w-7xl">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
          OmniTools Platform
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          A suite of free, private, and powerful online tools for your daily tasks.
          Process files directly in your browser securely.
        </p>
      </div>

      <div className="space-y-12">
        {categories.map(category => (
          <section key={category} className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight border-b pb-2">{category} Tools</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.filter(t => t.category === category).map(tool => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
