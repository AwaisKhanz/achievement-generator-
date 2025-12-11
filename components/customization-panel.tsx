"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import type { AchievementData, Tag } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Upload, ImageIcon, MessageSquare, Tag as TagIcon, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomizationPanelProps {
  data: AchievementData
  onChange: (data: AchievementData) => void
}

export function CustomizationPanel({ data, onChange }: CustomizationPanelProps) {
  const [newTagText, setNewTagText] = useState("")
  const [newTagColor, setNewTagColor] = useState("#38bdf8")

  const handleImageUpload = (type: "background" | "profile", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        onChange({
          ...data,
          [type === "background" ? "backgroundImage" : "profileImage"]: result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const addTag = () => {
    if (newTagText.trim()) {
      const newTag: Tag = {
        id: Date.now().toString(),
        text: newTagText.trim(),
        color: newTagColor,
      }
      onChange({
        ...data,
        tags: [...data.tags, newTag],
      })
      setNewTagText("")
    }
  }

  const removeTag = (tagId: string) => {
    onChange({
      ...data,
      tags: data.tags.filter((tag) => tag.id !== tagId),
    })
  }

  const updateTag = (tagId: string, updates: Partial<Tag>) => {
    onChange({
      ...data,
      tags: data.tags.map((tag) => (tag.id === tagId ? { ...tag, ...updates } : tag)),
    })
  }

  return (
    <div className="p-6 md:p-8 space-y-8 text-slate-200">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-white tracking-tight">Customize</h2>
        <p className="text-slate-400">Design your perfect achievement card</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="w-full bg-slate-800/50 p-1 border border-white/5 rounded-xl grid grid-cols-3 gap-1">
          <TabTrigger value="basic" icon={<MessageSquare className="w-4 h-4" />} label="Messages" />
          <TabTrigger value="images" icon={<ImageIcon className="w-4 h-4" />} label="Images" />
          <TabTrigger value="tags" icon={<TagIcon className="w-4 h-4" />} label="Tags" />
        </TabsList>

        <div className="mt-8 relative min-h-[400px]">
           {/* Removing AnimatePresence wrapper for TabsContent to avoid conflicts with Radix Tabs */}
             <TabsContent value="basic" className="space-y-6 focus-visible:outline-none">
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3 }}
                   className="space-y-6"
                >
                  <div className="space-y-4">
                    <Label className="text-slate-300 font-medium">Congratulations Message</Label>
                    <Input
                      value={data.congratsMessage}
                      onChange={(e) => onChange({ ...data, congratsMessage: e.target.value })}
                      placeholder="e.g. Congrats Monkeyman3000!"
                      className="bg-slate-800/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50 focus:border-primary/50 transition-all"
                    />
                  </div>

                  <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5 space-y-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="show-additional" className="text-slate-300 font-medium cursor-pointer">
                        Show Additional Message
                      </Label>
                      <Switch
                        id="show-additional"
                        checked={data.showAdditionalMessage}
                        onCheckedChange={(checked) => onChange({ ...data, showAdditionalMessage: checked })}
                        className="data-[state=checked]:bg-primary"
                      />
                    </div>

                    <AnimatePresence>
                      {data.showAdditionalMessage && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2">
                             <Label className="text-slate-300 text-sm mb-2 block">Message Content</Label>
                             <Textarea
                                value={data.additionalMessage}
                                onChange={(e) => onChange({ ...data, additionalMessage: e.target.value })}
                                placeholder="Write something nice..."
                                rows={4}
                                className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50 focus:border-primary/50 resize-none"
                             />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
             </TabsContent>

             <TabsContent value="images" className="space-y-6 focus-visible:outline-none">
                 <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3 }}
                   className="space-y-6"
                >
                   <ImageUploadCard
                      title="Background Image"
                      color="bg-primary"
                      id="background-upload"
                      onUpload={(e) => handleImageUpload("background", e)}
                   />
                   <ImageUploadCard
                      title="Profile Image"
                      color="bg-purple-500"
                      id="profile-upload"
                      onUpload={(e) => handleImageUpload("profile", e)}
                   />
                </motion.div>
             </TabsContent>

             <TabsContent value="tags" className="space-y-6 focus-visible:outline-none">
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ duration: 0.3 }}
                   className="space-y-6"
                >
                  <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5 space-y-4">
                     <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Add New Tag</h3>
                     <div className="flex gap-3">
                        <div className="flex-1">
                           <Input
                              value={newTagText}
                              onChange={(e) => setNewTagText(e.target.value)}
                              placeholder="Tag name"
                              className="bg-slate-900/50 border-white/10 text-white placeholder:text-slate-500 focus:ring-primary/50 focus:border-primary/50"
                              onKeyDown={(e) => e.key === "Enter" && addTag()}
                           />
                        </div>
                        <div className="flex items-center gap-2 bg-slate-900/50 border border-white/10 rounded-md px-2">
                           <input
                              type="color"
                              value={newTagColor}
                              onChange={(e) => setNewTagColor(e.target.value)}
                              className="w-8 h-8 bg-transparent border-none cursor-pointer"
                           />
                        </div>
                        <Button
                           onClick={addTag}
                           disabled={!newTagText.trim()}
                           className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                           <Plus className="w-5 h-5" />
                        </Button>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider px-1">Active Tags</h3>
                     {data.tags.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-xl text-slate-500">
                           No tags yet
                        </div>
                     ) : (
                        <div className="grid gap-3">
                           {data.tags.map((tag) => (
                              <motion.div
                                 layout
                                 key={tag.id}
                                 initial={{ opacity: 0, scale: 0.9 }}
                                 animate={{ opacity: 1, scale: 1 }}
                                 exit={{ opacity: 0, scale: 0.9 }}
                                 className="flex items-center gap-3 p-3 bg-slate-800/30 border border-white/5 rounded-xl group hover:border-white/10 transition-all"
                              >
                                 <Input
                                    value={tag.text}
                                    onChange={(e) => updateTag(tag.id, { text: e.target.value })}
                                    className="bg-transparent border-transparent text-white focus:bg-slate-900/50 focus:border-white/10"
                                 />
                                 <div className="flex items-center gap-2">
                                    <input
                                       type="color"
                                       value={tag.color}
                                       onChange={(e) => updateTag(tag.id, { color: e.target.value })}
                                       className="w-8 h-8 bg-transparent border-none cursor-pointer rounded overflow-hidden"
                                    />
                                    <Button
                                       variant="ghost"
                                       size="icon"
                                       onClick={() => removeTag(tag.id)}
                                       className="text-slate-500 hover:text-red-400 hover:bg-red-400/10"
                                    >
                                       <Trash2 className="w-4 h-4" />
                                    </Button>
                                 </div>
                              </motion.div>
                           ))}
                        </div>
                     )}
                  </div>
                </motion.div>
             </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function TabTrigger({ value, icon, label }: { value: string; icon: React.ReactNode; label: string }) {
   return (
      <TabsTrigger
         value={value}
         className="flex items-center justify-center gap-2 data-[state=active]:bg-slate-700/50 data-[state=active]:text-white text-slate-400 py-2.5 rounded-lg transition-all"
      >
         {icon}
         <span>{label}</span>
      </TabsTrigger>
   )
}

function ImageUploadCard({ title, color, id, onUpload }: { title: string, color: string, id: string, onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
   return (
      <div className="bg-slate-800/30 rounded-xl p-5 border border-white/5 group hover:border-white/10 transition-all">
         <div className="flex items-center gap-3 mb-4">
            <div className={`w-1 h-6 rounded-full ${color}`} />
            <h3 className="font-medium text-slate-200">{title}</h3>
         </div>

         <div className="flex items-center gap-4">
            <Input
               id={id}
               type="file"
               accept="image/*"
               onChange={onUpload}
               className="hidden"
            />
            <Button
               variant="outline"
               onClick={() => document.getElementById(id)?.click()}
               className="w-full h-24 border-2 border-dashed border-white/10 hover:border-primary/50 hover:bg-primary/5 bg-transparent text-slate-400 flex flex-col gap-2 transition-all"
            >
               <Upload className="w-6 h-6" />
               <span>Click to upload image</span>
            </Button>
         </div>
      </div>
   )
}
