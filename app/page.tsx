"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import { AchievementCard } from "@/components/achievement-card"
import { CustomizationPanel } from "@/components/customization-panel"

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
  const [achievementData, setAchievementData] = useState<AchievementData>({
    backgroundImage: "/colorful-gradient.png",
    profileImage: "/professional-headshot.png",
    congratsMessage: "Congrats Monkeyman3000!",
    tags: [
      { id: "1", text: "NEW", color: "#8B5CF6" },
      { id: "2", text: "Early Streamer", color: "#3B82F6" },
      { id: "3", text: "AUS", color: "#10B981" },
    ],
    additionalMessage:
      "You were the 23rd In AUS to Stream 'Teenage Dream' By Kidd G!\n\nKidd G Says: \"Get your fat ass off the couch!\"",
    showAdditionalMessage: false,
  })

  const handleDownload = async () => {
    if (!cardRef.current) return

    try {
      // Dynamic import to reduce bundle size
      const html2canvas = (await import("html2canvas")).default

      // Create a clone of the element to modify styles without affecting the original
      const clonedElement = cardRef.current.cloneNode(true) as HTMLElement
      document.body.appendChild(clonedElement)

      // Override all computed styles that might use modern color functions
      const overrideStyles = (element: HTMLElement) => {
        const computedStyle = window.getComputedStyle(element)

        // Force standard color formats for problematic properties
        element.style.color =
          computedStyle.color.includes("oklab") || computedStyle.color.includes("oklch")
            ? "#ffffff"
            : computedStyle.color
        element.style.backgroundColor =
          computedStyle.backgroundColor.includes("oklab") || computedStyle.backgroundColor.includes("oklch")
            ? "transparent"
            : computedStyle.backgroundColor
        element.style.borderColor =
          computedStyle.borderColor.includes("oklab") || computedStyle.borderColor.includes("oklch")
            ? "#666666"
            : computedStyle.borderColor

        // Recursively apply to all children
        Array.from(element.children).forEach((child) => {
          if (child instanceof HTMLElement) {
            overrideStyles(child)
          }
        })
      }

      overrideStyles(clonedElement)

      // Ensure tags are properly rendered
      const tagElements = clonedElement.querySelectorAll('[style*="display: flex"]')
      tagElements.forEach((tag) => {
        if (tag instanceof HTMLElement) {
          // Ensure flex properties are preserved
          tag.style.display = "flex"
          tag.style.alignItems = "center"
          tag.style.justifyContent = "center"
        }
      })

      const canvas = await html2canvas(clonedElement, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        removeContainer: true,
        logging: false,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
        onclone: (clonedDoc) => {
          // Additional safety: override any remaining problematic styles in the cloned document
          const allElements = clonedDoc.querySelectorAll("*")
          allElements.forEach((el) => {
            if (el instanceof HTMLElement) {
              const style = el.style
              // Replace any remaining modern color functions with safe defaults
              if (style.color && (style.color.includes("oklab") || style.color.includes("oklch"))) {
                style.color = "#ffffff"
              }
              if (
                style.backgroundColor &&
                (style.backgroundColor.includes("oklab") || style.backgroundColor.includes("oklch"))
              ) {
                style.backgroundColor = "transparent"
              }
            }
          })
        },
      })

      // Clean up the cloned element
      document.body.removeChild(clonedElement)

      const link = document.createElement("a")
      link.download = `achievement-card-${Date.now()}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Error generating image:", error)
      alert("Failed to download image. Please try again.")
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white">Achievement Card Generator</h1>
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-semibold text-white mb-2">Preview</h2>
                <p className="text-gray-400">See your achievement card in real-time</p>
              </div>
              <div className="flex justify-center lg:justify-start">
                <AchievementCard ref={cardRef} data={achievementData} />
              </div>
              <div className="flex justify-center lg:justify-start">
                <Button
                  onClick={handleDownload}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Card
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-semibold text-white mb-2">Customize</h2>
                <p className="text-gray-400">Personalize every aspect of your achievement card</p>
              </div>
              <div className="bg-gray-900 rounded-xl shadow-xl border border-gray-800">
                <CustomizationPanel data={achievementData} onChange={setAchievementData} />
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              © 2024 Achievement Card Generator. Built with Next.js and Tailwind CSS.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
