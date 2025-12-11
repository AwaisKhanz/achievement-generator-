import { forwardRef } from "react"
import { motion } from "framer-motion"
import type { AchievementData } from "@/app/page"
import { cn } from "@/lib/utils"

interface AchievementCardProps {
  data: AchievementData
}

export const AchievementCard = forwardRef<HTMLDivElement, AchievementCardProps>(({ data }, ref) => {
  return (
    <div ref={ref} className="relative group perspective-1000">
      <motion.div
        initial={{ opacity: 0, y: 20, rotateX: 10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative w-[540px] overflow-hidden rounded-[2rem] bg-[#0a0a0a] shadow-2xl ring-1 ring-white/10"
      >
        {/* Glow Effects */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none" />

        {/* Header / Background Area */}
        <div className="relative h-72 w-full overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0a0a] z-10" />

          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5 }}
            className="w-full h-full"
          >
             {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.backgroundImage || "/placeholder.svg"}
              alt="Background"
              className="w-full h-full object-cover object-center"
              crossOrigin="anonymous"
            />
          </motion.div>

          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20">
            <div className="px-4 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-xs font-medium tracking-wider text-white/90 uppercase">
              Sidechayn Achievements
            </div>
          </div>
        </div>

        {/* Profile Image */}
        <div className="absolute top-52 left-1/2 -translate-x-1/2 z-30">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="relative"
          >
            <div className="w-28 h-28 rounded-full p-1.5 bg-[#0a0a0a] ring-2 ring-white/10 shadow-2xl">
              <div className="w-full h-full rounded-full overflow-hidden border border-white/10">
                 {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={data.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Area */}
        <div className="pt-16 pb-10 px-8 text-center relative z-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2 tracking-tight text-glow">
              {data.congratsMessage}
            </h2>
          </motion.div>

          {/* Tags */}
          <div className="flex flex-wrap justify-center gap-3 my-6">
            {data.tags.map((tag, i) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + (i * 0.1) }}
                className="px-4 py-1.5 rounded-full text-sm font-semibold text-white shadow-lg border border-white/10"
                style={{
                  backgroundColor: tag.color,
                  boxShadow: `0 4px 12px ${tag.color}40`
                }}
              >
                {tag.text}
              </motion.div>
            ))}
          </div>

          {/* Additional Message */}
          {data.showAdditionalMessage && data.additionalMessage && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              transition={{ delay: 0.6 }}
              className="mt-6 pt-6 border-t border-white/5 space-y-3"
            >
              {data.additionalMessage.split("\n\n").map((paragraph, index) => (
                <p
                  key={index}
                  className={cn(
                    "leading-relaxed",
                    index === 1 ? "text-sm text-gray-400 italic" : "text-sm text-gray-300"
                  )}
                >
                  {paragraph}
                </p>
              ))}
            </motion.div>
          )}

          <div className="mt-8 flex justify-center opacity-40">
            <div className="h-1 w-16 rounded-full bg-white/20" />
          </div>
        </div>
      </motion.div>
    </div>
  )
})

AchievementCard.displayName = "AchievementCard"
