'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Book, RefreshCcw } from "lucide-react"
import Link from 'next/link'
import { useAuth } from '../providers'
import { getUserStories } from '@/lib/db'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

interface Story {
  id: string
  character: string
  setting: string
  plotTwist: string
  content: string
  createdAt: string
  timestamp: number
}

export default function GeneratedStories() {
  const { user } = useAuth()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchStories = async () => {
    if (!user) return;
    
    try {
      setRefreshing(true)
      const userStories = await getUserStories(user.uid)
      setStories(userStories as Story[])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching stories:', error)
      toast.error('Failed to load stories. Please try again.')
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    if (!user) {
      router.push('/login')
      return
    }

    fetchStories()
  }, [user, router])

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)]"
        style={{ backgroundSize: '40px 40px' }}
      />
      
      <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-purple-500/30 rounded-full blur-[80px]" />
      <div className="absolute top-[60%] right-[15%] w-32 h-32 bg-blue-500/30 rounded-full blur-[80px]" />

      <div className="relative z-10 container mx-auto min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text flex items-center gap-2">
              <Book className="w-8 h-8" />
              Generated Stories
            </h1>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                onClick={fetchStories}
                disabled={refreshing}
                className="bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300"
              >
                <RefreshCcw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Link href="/story">
                <Button 
                  variant="outline" 
                  className="bg-purple-500/10 border-purple-500/20 text-purple-400 hover:bg-purple-500/20 hover:text-purple-300 transition-colors"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back to Storyteller
                </Button>
              </Link>
            </div>
          </div>

          <ScrollArea className="h-[calc(100vh-200px)]">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
              </div>
            ) : stories.length === 0 ? (
              <Card className="bg-black/40 backdrop-blur-xl border-neutral-800">
                <CardContent className="p-6 text-center">
                  <p className="text-neutral-400">No stories generated yet. Start creating your first story!</p>
                  <Link href="/story">
                    <Button 
                      className="mt-4 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      Create Your First Story
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              stories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="mb-6"
                >
                  <Card className="bg-black/40 backdrop-blur-xl border-neutral-800 hover:border-purple-500/20 transition-colors">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h2 className="text-2xl font-semibold text-purple-400">Story #{story.id.slice(0, 4)}</h2>
                        <span className="text-sm text-neutral-500">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-2 py-1 rounded-full bg-purple-500/10 text-purple-400 text-sm">
                          {story.character}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                          {story.setting}
                        </span>
                        <span className="px-2 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-sm">
                          {story.plotTwist}
                        </span>
                      </div>
                      <p className="text-neutral-200 leading-relaxed">{story.content}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </ScrollArea>
        </motion.div>
      </div>
    </div>
  )
}