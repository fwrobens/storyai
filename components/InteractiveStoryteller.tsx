'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { Sparkles, Coins, LogOut, CreditCard, BookOpen } from "lucide-react"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { generateStoryWithGemini } from '@/lib/gemini'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/providers'
import { getUserTokens, updateUserTokens, saveStory } from '@/lib/db'
import { UserAvatar } from './UserAvatar'
import Link from 'next/link'

export default function InteractiveStoryteller() {
  const router = useRouter()
  const { user } = useAuth()
  const [character, setCharacter] = useState('')
  const [setting, setSetting] = useState('')
  const [plotTwist, setPlotTwist] = useState('')
  const [story, setStory] = useState('')
  const [tokens, setTokens] = useState(0)
  const [isGenerating, setIsGenerating] = useState(false)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  
  const springConfig = { damping: 25, stiffness: 700 }
  const cursorXSpring = useSpring(cursorX, springConfig)
  const cursorYSpring = useSpring(cursorY, springConfig)

  useEffect(() => {
    if (user) {
      getUserTokens(user.uid).then(setTokens)
    }
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      toast.success('Logged out successfully')
      router.push('/')
    } catch (error) {
      toast.error('Error logging out')
    }
  }

  const generateStory = async () => {
    if (tokens < 50) {
      toast.error("Insufficient tokens! You need 50 tokens to generate a story.")
      return
    }

    try {
      setIsGenerating(true)
      const generatedStory = await generateStoryWithGemini(character, setting, plotTwist)
      setStory(generatedStory)
      const newTokens = tokens - 50
      setTokens(newTokens)
      if (user) {
        await updateUserTokens(user.uid, newTokens)
        await saveStory(user.uid, {
          character,
          setting,
          plotTwist,
          content: generatedStory
        })
      }
      toast.success("Story generated and saved! -50 tokens")
    } catch (error) {
      toast.error("Failed to generate story. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleBuyTokens = async () => {
    try {
      const newTokens = tokens + 100
      setTokens(newTokens)
      if (user) {
        await updateUserTokens(user.uid, newTokens)
      }
      toast.success("100 tokens added to your account!")
    } catch (error) {
      toast.error("Failed to add tokens")
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)]"
        style={{ backgroundSize: '40px 40px' }}
      />
      
      <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-purple-500/30 rounded-full blur-[80px]" />
      <div className="absolute top-[60%] right-[15%] w-32 h-32 bg-blue-500/30 rounded-full blur-[80px]" />
      
      <motion.div
        className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full fixed top-0 left-0 pointer-events-none blur-[2px]"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
        }}
      />

      <div className="fixed top-4 right-4 z-50">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <UserAvatar 
                email={user?.email} 
                className="h-10 w-10 rounded-full ring-2 ring-purple-500/20" 
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" sideOffset={5}>
            <DropdownMenuItem onClick={handleBuyTokens} className="cursor-pointer">
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Buy Tokens</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-10 container mx-auto min-h-screen flex items-center justify-center p-8">
        <Card className="w-full max-w-7xl bg-black/40 backdrop-blur-xl border-neutral-800">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="flex-1">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-4xl font-bold text-center lg:text-left bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text flex items-center gap-2">
                      <Sparkles className="w-8 h-8" />
                      Interactive Storyteller
                    </h1>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 bg-neutral-900/50 px-4 py-2 rounded-full border border-neutral-800"
                    >
                      <Coins className="w-4 h-4 text-yellow-500" />
                      <span className="font-mono text-yellow-500">{tokens}</span>
                      <span className="text-neutral-400 text-sm">tokens</span>
                    </motion.div>
                  </div>
                </motion.div>

                <div className="grid gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Label htmlFor="character" className="text-purple-400 font-medium">Character</Label>
                    <Input
                      id="character"
                      placeholder="e.g., a brave knight, a curious child"
                      value={character}
                      onChange={(e) => setCharacter(e.target.value)}
                      className="bg-neutral-900/50 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <Label htmlFor="setting" className="text-blue-400 font-medium">Setting</Label>
                    <Input
                      id="setting"
                      placeholder="e.g., enchanted forest, futuristic city"
                      value={setting}
                      onChange={(e) => setSetting(e.target.value)}
                      className="bg-neutral-900/50 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    <Label htmlFor="plotTwist" className="text-cyan-400 font-medium">Plot Twist</Label>
                    <Input
                      id="plotTwist"
                      placeholder="e.g., a dragon appeared, time stopped"
                      value={plotTwist}
                      onChange={(e) => setPlotTwist(e.target.value)}
                      className="bg-neutral-900/50 border-neutral-800 text-neutral-200 placeholder:text-neutral-500"
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="space-y-4"
                  >
                    <Button 
                      className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white border-0 relative overflow-hidden group"
                      onClick={generateStory}
                      disabled={!character || !setting || !plotTwist || tokens < 50 || isGenerating}
                    >
                      <span className="relative z-10">
                        {isGenerating ? 'Generating...' : 'Generate Story'}
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Button>

                    <Link href="/stories" className="block">
                      <Button
                        variant="ghost"
                        className="w-full border border-purple-500/20 hover:bg-purple-500/10 text-purple-400"
                      >
                        <BookOpen className="w-4 h-4 mr-2" />
                        View Generated Stories
                      </Button>
                    </Link>

                    {tokens < 50 && (
                      <p className="text-red-400 text-sm mt-2 text-center">
                        Insufficient tokens! You need 50 tokens to generate a story.
                      </p>
                    )}
                  </motion.div>
                </div>
              </div>

              <div className="flex-1 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="h-full"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-[50px]" />
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px]" />
                  
                  <div className="relative h-full">
                    <Label className="text-indigo-400 font-medium">Generated Story</Label>
                    <Textarea
                      className="w-full h-[calc(100%-2rem)] min-h-[300px] p-4 bg-neutral-900/50 border-neutral-800 text-neutral-200 resize-none"
                      value={story}
                      readOnly
                      placeholder="Your story will appear here..."
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}