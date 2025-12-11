"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download, Share2, Sparkles, Loader2, Check } from "lucide-react"
import { AchievementCard } from "@/components/achievement-card"
import { CustomizationPanel } from "@/components/customization-panel"
import { motion } from "framer-motion"
import { toast } from "sonner"

export interface Tag {
  id: string
  text: string
  color: string
}

export interface AchievementData {
  backgroundImage: string
  profileImage: string
  congratsMessage: string
  tags: Tag[]
  additionalMessage: string
  showAdditionalMessage: boolean
}

export default function Home() {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [achievementData, setAchievementData] = useState<AchievementData>({
    backgroundImage: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2070&auto=format&fit=crop",
    profileImage: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1760&auto=format&fit=crop",
    congratsMessage: "Congrats Monkeyman3000!",
    tags: [
      { id: "1", text: "NEW", color: "#8B5CF6" },
      { id: "2", text: "Early Streamer", color: "#3B82F6" },
      { id: "3", text: "AUS", color: "#10B981" },
    ],
    additionalMessage:
      "You were the 23rd In AUS to Stream 'Teenage Dream' By Kidd G!\n\nKidd G Says: \"Get your fat ass off the couch!\"",
    showAdditionalMessage: true,
  })

  const handleDownload = async () => {
    if (!cardRef.current) return
    setIsGenerating(true)

    try {
      const { toPng } = await import("html-to-image")

      // Wait a bit for images to be fully rendered/animations to settle if any
      await new Promise(resolve => setTimeout(resolve, 1000))

      const dataUrl = await toPng(cardRef.current, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: "transparent",
        cacheBust: true,
      })

      const link = document.createElement("a")
      link.download = `achievement-${Date.now()}.png`
      link.href = dataUrl
      link.click()
      toast.success("Card downloaded successfully!")
    } catch (error) {
      console.error("Error generating image:", error)
      toast.error("Failed to download image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleShare = async () => {
    setIsSharing(true);
    try {
        // Fallback to clipboard if Web Share API is not available or for desktop
        await navigator.clipboard.writeText("Check out my achievement on Sidechayn!");
        toast.success("Link copied to clipboard!")

        // Simulating a share action delay
        await new Promise(resolve => setTimeout(resolve, 500))
    } catch (err) {
        console.error("Share failed:", err)
    } finally {
        setIsSharing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden relative selection:bg-cyan-500/30 selection:text-cyan-200">

      {/* Animated Background */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[120px] animate-blob" />
         <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-blob animation-delay-2000" />
         <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-blob animation-delay-4000" />
         {/* Replaced missing noise image with a subtle CSS pattern */}
         <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'radial-gradient(circle at center, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-md supports-[backdrop-filter]:bg-[#020617]/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
              S
            </div>
            <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Sidechayn
            </span>
          </div>
          <div className="flex items-center gap-4">
             <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-400 hover:text-white">
                How it works
             </Button>
             <Button
                variant="default"
                size="sm"
                className="bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-sm"
              >
                Sign In
             </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">

          <div className="text-center mb-16 space-y-4">
            <motion.div
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.6 }}
            >
               <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-4">
                 Craft Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Achievement</span>
               </h1>
               <p className="text-lg text-slate-400 max-w-2xl mx-auto">
                 Create stunning, personalized achievement cards to celebrate your community's milestones. Professional, fast, and free.
               </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Preview */}
            <div className="lg:col-span-7 flex flex-col items-center">
              <div className="sticky top-28 space-y-8 w-full flex flex-col items-center">
                 <div className="w-full max-w-[600px] aspect-[4/3] flex items-center justify-center relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                    <AchievementCard ref={cardRef} data={achievementData} />
                 </div>

                 <div className="flex gap-4">
                    <Button
                      onClick={handleDownload}
                      disabled={isGenerating}
                      size="lg"
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 border-0"
                    >
                      {isGenerating ? (
                        <>
                           <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                           Generating...
                        </>
                      ) : (
                        <>
                           <Download className="w-4 h-4 mr-2" />
                           Download Card
                        </>
                      )}
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={handleShare}
                        disabled={isSharing}
                        className="border-white/10 hover:bg-white/5 text-slate-300"
                    >
                       {isSharing ? (
                          <Check className="w-4 h-4 mr-2" />
                       ) : (
                          <Share2 className="w-4 h-4 mr-2" />
                       )}
                       {isSharing ? "Copied!" : "Share"}
                    </Button>
                 </div>
              </div>
            </div>

            {/* Right Column: Customization */}
            <motion.div
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.6, delay: 0.2 }}
               className="lg:col-span-5"
            >
              <div className="bg-[#0f172a]/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/5">
                <CustomizationPanel data={achievementData} onChange={setAchievementData} />
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <footer className="border-t border-white/5 bg-[#020617] mt-auto relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-xs text-white font-bold">
              S
            </div>
            <p className="text-slate-500 text-sm">
              © 2024 Sidechayn. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6 text-sm text-slate-500">
             <a href="#" className="hover:text-white transition-colors">Terms</a>
             <a href="#" className="hover:text-white transition-colors">Privacy</a>
             <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
