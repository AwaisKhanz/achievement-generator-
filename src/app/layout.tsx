import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Navbar } from '@/components/ui/navbar'
import { Toaster } from 'sonner'
import './globals.css'

export const metadata: Metadata = {
  title: 'OmniTools Platform',
  description: 'Free, private, and powerful online tools for PDF, Image, and Text processing.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: 'GeistSans', 'GeistSans Fallback', sans-serif;
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="min-h-screen flex flex-col bg-background font-sans antialiased">
        <Navbar />
        <main className="flex-1">
            {children}
        </main>
        <footer className="border-t py-6 md:py-0">
          <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row text-sm text-muted-foreground">
             <p>© 2025 OmniTools Platform. All rights reserved.</p>
             <p>Processed securely in your browser.</p>
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  )
}
