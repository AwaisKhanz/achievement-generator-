import { forwardRef } from "react"
import type { AchievementData } from "@/app/page"

interface AchievementCardProps {
  data: AchievementData
}

export const AchievementCard = forwardRef<HTMLDivElement, AchievementCardProps>(({ data }, ref) => {
  return (
    <div
      ref={ref}
      className="relative w-[540px] bg-[#0f0f0f] rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-3xl hover:scale-102"
    >
      {/* Gradient Background - top portion only */}
      <div className="h-68 relative rounded-t-3xl overflow-hidden p-4 rounded-lg">
        {/* Header - positioned in top-left corner */}
        <div className=" absolute left-[50%] top-12 -translate-[50%]  transition-all duration-300 hover:scale-105">
          <div className="bg-black/60 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-medium">
            Sidechayn Achievements
          </div>
        </div>
        <img
          src={data.backgroundImage || "/placeholder.svg"}
          alt="Background"
          className="w-full h-full rounded-lg object-cover transition-transform duration-500"
          crossOrigin="anonymous"
        />
      </div>

      {/* Profile Image - overlapping the gradient and black sections */}
      <div className="absolute top-50 left-1/2 transform -translate-x-1/2 transition-all duration-300 hover:scale-110 z-10">
        <div className="w-24 h-24 rounded-full bg-white p-1 shadow-lg">
          <img
            src={data.profileImage || "/placeholder.svg"}
            alt="Profile"
            className="w-full h-full rounded-full object-cover transition-transform duration-300"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {/* Content - positioned in black bottom section */}
      <div className="px-6 pb-6 text-center text-white" style={{ paddingTop: "60px" }}>
        {/* Congratulations Message */}
        <h2 className="text-xl font-bold mb-4 transition-all duration-300 hover:text-yellow-300">
          {data.congratsMessage}
        </h2>

        {/* Tags */}
        <div className="flex justify-center items-center mb-6" style={{ gap: "12px" }}>
          {data.tags.map((tag) => (
            <div
              key={tag.id}
              style={{
                backgroundColor: tag.color,
                borderRadius: "20px",
                height: "32px",
                paddingLeft: "16px",
                paddingRight: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: "600",
                color: "white",
                whiteSpace: "nowrap",
                minWidth: "fit-content",
              }}
            >
              {tag.text}
            </div>
          ))}
        </div>

        {data.showAdditionalMessage && data.additionalMessage && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {data.additionalMessage.split("\n\n").map((paragraph, index) => (
              <p key={index} className={index === 1 ? "text-base italic text-gray-300" : "text-sm text-gray-200"}>
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  )
})

AchievementCard.displayName = "AchievementCard"
