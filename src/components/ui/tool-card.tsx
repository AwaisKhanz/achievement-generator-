import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tool } from "@/types/tools";
import { ArrowRight } from "lucide-react";

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = tool.icon;

  return (
    <Link href={tool.href} className="group block h-full">
      <Card className="h-full border-muted hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 ring-1 ring-inset ring-primary/20">
              <Icon className="h-6 w-6" />
            </div>
            <ArrowRight className="h-5 w-5 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </div>
          <CardTitle className="mt-4 text-xl group-hover:text-primary transition-colors">{tool.name}</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <CardDescription className="text-base leading-relaxed">{tool.description}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  );
}
