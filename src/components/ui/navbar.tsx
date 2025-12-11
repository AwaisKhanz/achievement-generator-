'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // Added useRouter
import { Command, Search, Menu, X, CommandIcon } from "lucide-react"; // Import CommandIcon explicitly to avoid conflict with Command component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

// Define tools list here for search (simulating a global config/context)
const tools = [
  { name: "Merge PDF", href: "/tools/pdf-merge", category: "PDF" },
  { name: "PDF to Word", href: "/tools/pdf-to-word", category: "PDF" },
  { name: "PDF Split", href: "/tools/pdf-split", category: "PDF" },
  { name: "PDF to Image", href: "/tools/pdf-to-image", category: "PDF" },
  { name: "Image Resizer", href: "/tools/image-resizer", category: "Image" },
  { name: "Photo Editor", href: "/tools/photo-editor", category: "Image" },
  { name: "JSON Formatter", href: "/tools/json-formatter", category: "Text" },
  { name: "Diff Checker", href: "/tools/diff-checker", category: "Text" },
  { name: "Markdown Preview", href: "/tools/markdown-preview", category: "Text" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter(); // Use router for navigation
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [open, setOpen] = useState(false);

  // Toggle command menu with Ctrl+K
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => void) => {
    setOpen(false);
    command();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2 font-bold text-xl">
             <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <CommandIcon className="h-5 w-5" />
             </div>
             <span>OmniTools</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
             <Link href="/" className={cn("transition-colors hover:text-foreground/80", pathname === "/" ? "text-foreground" : "text-foreground/60")}>
                All Tools
             </Link>
             <Link href="/about" className={cn("transition-colors hover:text-foreground/80", pathname === "/about" ? "text-foreground" : "text-foreground/60")}>
                About
             </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
            <Button
                variant="outline"
                className="relative h-9 w-9 p-0 xl:h-10 xl:w-60 xl:justify-start xl:px-3 xl:py-2"
                onClick={() => setOpen(true)}
            >
                <Search className="h-4 w-4 xl:mr-2" />
                <span className="hidden xl:inline-flex">Search tools...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 xl:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
          <div className="md:hidden border-t p-4 space-y-4 bg-background">
              <nav className="flex flex-col space-y-4">
                 <Link href="/" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>All Tools</Link>
                 <Link href="/about" className="text-sm font-medium" onClick={() => setIsMenuOpen(false)}>About</Link>
              </nav>
          </div>
      )}

      {/* Command Dialog for Search */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            {tools.map((tool) => (
                <CommandItem
                    key={tool.href}
                    value={tool.name}
                    onSelect={() => {
                        runCommand(() => router.push(tool.href));
                    }}
                >
                    <div className="mr-2 flex h-4 w-4 items-center justify-center">
                        <CommandIcon className="h-3 w-3" />
                    </div>
                    {tool.name}
                     <span className="ml-2 text-xs text-muted-foreground">in {tool.category}</span>
                </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>

    </header>
  );
}
