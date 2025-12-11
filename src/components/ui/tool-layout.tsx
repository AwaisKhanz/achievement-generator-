import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
  breadcrumbs?: { label: string; href: string }[];
}

export function ToolLayout({
  title,
  description,
  children,
  className,
  breadcrumbs = [],
}: ToolLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <ChevronRight className="h-4 w-4" />
        <Link href="/" className="hover:text-primary transition-colors">Tools</Link>
        {breadcrumbs.map((crumb, index) => (
            <div key={index} className="flex items-center space-x-2">
                <ChevronRight className="h-4 w-4" />
                <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
            </div>
        ))}
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground font-medium">{title}</span>
      </div>

      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-lg text-muted-foreground">{description}</p>
      </div>

      <div className={cn("grid gap-8", className)}>
        {children}
      </div>
    </div>
  );
}
