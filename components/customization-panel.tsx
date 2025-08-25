"use client"

import type React from "react"

import { useState } from "react"
import type { AchievementData, Tag } from "@/app/page"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, X, Upload } from "lucide-react"

interface CustomizationPanelProps {
  data: AchievementData
  onChange: (data: AchievementData) => void
}

export function CustomizationPanel({ data, onChange }: CustomizationPanelProps) {
  const [newTagText, setNewTagText] = useState("")
  const [newTagColor, setNewTagColor] = useState("#8B5CF6")

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
    <div className="p-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-foreground">Customize</h2>
        <p className="text-muted-foreground text-lg">Personalize every aspect of your achievement card</p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-card border border-border rounded-lg p-1">
          <TabsTrigger
            value="basic"
            className="text-muted-foreground data-[state=active]:text-primary-foreground data-[state=active]:bg-primary rounded-md transition-all duration-200 font-medium"
          >
            Basic
          </TabsTrigger>
          <TabsTrigger
            value="images"
            className="text-muted-foreground data-[state=active]:text-primary-foreground data-[state=active]:bg-primary rounded-md transition-all duration-200 font-medium"
          >
            Images
          </TabsTrigger>
          <TabsTrigger
            value="tags"
            className="text-muted-foreground data-[state=active]:text-primary-foreground data-[state=active]:bg-primary rounded-md transition-all duration-200 font-medium"
          >
            Tags
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6 mt-6">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                Messages
                <div className="h-1 w-8 bg-primary rounded-full"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label htmlFor="congrats" className="text-card-foreground font-medium text-sm">
                  Congratulations Message
                </Label>
                <Input
                  id="congrats"
                  value={data.congratsMessage}
                  onChange={(e) => onChange({ ...data, congratsMessage: e.target.value })}
                  placeholder="Congrats Username!"
                  className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-all duration-200"
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/20 rounded-lg">
                  <Switch
                    id="show-additional"
                    checked={data.showAdditionalMessage}
                    onCheckedChange={(checked) => onChange({ ...data, showAdditionalMessage: checked })}
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label htmlFor="show-additional" className="text-card-foreground font-medium cursor-pointer">
                    Show Additional Message
                  </Label>
                </div>

                {data.showAdditionalMessage && (
                  <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                    <Label className="text-card-foreground font-medium text-sm">Additional Message</Label>
                    <Textarea
                      value={data.additionalMessage}
                      onChange={(e) => onChange({ ...data, additionalMessage: e.target.value })}
                      placeholder="Add your custom message here..."
                      rows={4}
                      className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-all duration-200 resize-none"
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="images" className="space-y-6 mt-6">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                Background Image
                <div className="h-1 w-8 bg-secondary rounded-full"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="background-upload" className="text-card-foreground font-medium text-sm">
                  Upload Background
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="background-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("background", e)}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("background-upload")?.click()}
                    className="gap-2 bg-input border-border text-card-foreground hover:bg-muted hover:border-primary transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                  <span className="text-sm text-muted-foreground">PNG, JPG up to 10MB</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                Profile Image
                <div className="h-1 w-8 bg-secondary rounded-full"></div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label htmlFor="profile-upload" className="text-card-foreground font-medium text-sm">
                  Upload Profile Image
                </Label>
                <div className="flex items-center gap-3">
                  <Input
                    id="profile-upload"
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload("profile", e)}
                    className="hidden"
                  />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("profile-upload")?.click()}
                    className="gap-2 bg-input border-border text-card-foreground hover:bg-muted hover:border-primary transition-all duration-200"
                  >
                    <Upload className="w-4 h-4" />
                    Choose File
                  </Button>
                  <span className="text-sm text-muted-foreground">PNG, JPG up to 10MB</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tags" className="space-y-6 mt-6">
          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                Add New Tag
                <div className="h-1 w-8 bg-accent rounded-full"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-1 space-y-2">
                  <Label className="text-card-foreground font-medium text-sm">Tag Text</Label>
                  <Input
                    value={newTagText}
                    onChange={(e) => setNewTagText(e.target.value)}
                    placeholder="Enter tag text"
                    className="bg-input border-border text-card-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring transition-all duration-200"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-card-foreground font-medium text-sm">Color</Label>
                  <div className="flex gap-2">
                    <Input
                      type="color"
                      value={newTagColor}
                      onChange={(e) => setNewTagColor(e.target.value)}
                      className="w-16 h-10 bg-input border-border cursor-pointer"
                    />
                    <Button
                      onClick={addTag}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 shadow-md hover:shadow-lg"
                      disabled={!newTagText.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-card-foreground flex items-center gap-2">
                Current Tags
                <div className="h-1 w-8 bg-accent rounded-full"></div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.tags.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No tags added yet. Create your first tag above!</p>
                </div>
              ) : (
                data.tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center gap-3 p-4 border border-border rounded-lg bg-muted/10 hover:bg-muted/20 transition-all duration-200"
                  >
                    <div className="flex-1 space-y-2">
                      <Label className="text-card-foreground font-medium text-sm">Tag Text</Label>
                      <Input
                        value={tag.text}
                        onChange={(e) => updateTag(tag.id, { text: e.target.value })}
                        className="bg-input border-border text-card-foreground focus:ring-2 focus:ring-ring transition-all duration-200"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-card-foreground font-medium text-sm">Color</Label>
                      <div className="flex gap-2">
                        <Input
                          type="color"
                          value={tag.color}
                          onChange={(e) => updateTag(tag.id, { color: e.target.value })}
                          className="w-16 h-10 bg-input border-border cursor-pointer"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeTag(tag.id)}
                          className="bg-destructive/10 border-destructive/20 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
