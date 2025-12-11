'use client';

import { Tool } from "@/types/tools";
import { ToolCard } from "@/components/ui/tool-card";
import { FileText, Image, Code, FileCode, Scissors, FileInput, Wand2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
    id: "pdf-split",
    name: "Split PDF",
    description: "Extract specific pages or ranges from your PDF documents.",
    icon: Scissors,
    href: "/tools/pdf-split",
    category: "PDF"
  },
  {
    id: "pdf-to-image",
    name: "PDF to Image",
    description: "Convert PDF pages into high-quality images (PNG/JPG).",
    icon: Image,
    href: "/tools/pdf-to-image",
    category: "PDF"
  },
  {
    id: "image-resizer",
    name: "Image Resizer",
    description: "Resize, compress, and convert images directly in your browser.",
    icon: Image,
    href: "/tools/image-resizer",
    category: "Image"
  },
  {
    id: "photo-editor",
    name: "Photo Editor",
    description: "Crop, rotate, and apply filters to your photos instantly.",
    icon: Wand2,
    href: "/tools/photo-editor",
    category: "Image"
  },
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format, validate, and beautify your JSON data with tree view.",
    icon: Code,
    href: "/tools/json-formatter",
    category: "Text"
  },
  {
    id: "diff-checker",
    name: "Diff Checker",
    description: "Compare text files side-by-side to spot differences.",
    icon: FileCode,
    href: "/tools/diff-checker",
    category: "Text"
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview",
    description: "Write markdown and see the HTML preview in real-time.",
    icon: FileText,
    href: "/tools/markdown-preview",
    category: "Text"
  },
];

export default function Home() {
  const categories = Array.from(new Set(tools.map(t => t.category)));

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-primary/20 blur-[120px] rounded-full pointer-events-none opacity-50 dark:opacity-20" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 px-4 text-center space-y-8 max-w-5xl mx-auto">
        <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-muted/50 backdrop-blur-sm">
           <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
           v1.0 Now Available
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
          Your All-in-One <br className="hidden md:block" />
          <span className="text-gradient">Digital Workspace</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          A powerful suite of free, private, and secure online tools.
          Process PDFs, images, and text directly in your browser with no file uploads for most tools.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
           <Button size="lg" className="h-12 px-8 text-base shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-full">
              Explore Tools <ArrowRight className="ml-2 h-4 w-4" />
           </Button>
           <Button size="lg" variant="outline" className="h-12 px-8 text-base rounded-full backdrop-blur-sm bg-background/50">
              Read Documentation
           </Button>
        </div>
      </section>

      {/* Tools Grid */}
      <div className="container mx-auto px-4 py-16 max-w-7xl relative z-10">
        <div className="space-y-20">
          {categories.map(category => (
            <section key={category} className="space-y-8">
              <div className="flex items-center space-x-4">
                 <h2 className="text-3xl font-bold tracking-tight">{category} Tools</h2>
                 <div className="h-px flex-1 bg-border" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {tools.filter(t => t.category === category).map(tool => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

       {/* Feature Highlights / Stats */}
       <section className="border-t bg-muted/30 py-24 mt-20">
           <div className="container mx-auto px-4 text-center">
               <h2 className="text-3xl font-bold mb-12">Why use OmniTools?</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                   <div className="p-6 bg-background rounded-2xl border shadow-sm">
                       <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                           <FileText className="h-6 w-6" />
                       </div>
                       <h3 className="font-semibold text-xl mb-2">Privacy First</h3>
                       <p className="text-muted-foreground">Files are processed in your browser. We don't store your sensitive data.</p>
                   </div>
                   <div className="p-6 bg-background rounded-2xl border shadow-sm">
                       <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                           <Wand2 className="h-6 w-6" />
                       </div>
                       <h3 className="font-semibold text-xl mb-2">Lightning Fast</h3>
                       <p className="text-muted-foreground">Powered by WebAssembly for near-native performance without server latency.</p>
                   </div>
                   <div className="p-6 bg-background rounded-2xl border shadow-sm">
                       <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4 text-primary">
                           <Code className="h-6 w-6" />
                       </div>
                       <h3 className="font-semibold text-xl mb-2">Open Source</h3>
                       <p className="text-muted-foreground">Built with modern tech stack. Transparent and extensible.</p>
                   </div>
               </div>
           </div>
       </section>
    </div>
  );
}
