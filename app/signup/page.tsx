'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'sonner'

export default function SignupPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  })

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      )

      await updateProfile(userCredential.user, {
        displayName: formData.name
      })

      toast.success('Account created successfully!')
      router.push('/')
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)]"
        style={{ backgroundSize: '40px 40px' }}
      />
      
      <div className="absolute top-[20%] left-[15%] w-32 h-32 bg-purple-500/30 rounded-full blur-[80px]" />
      <div className="absolute top-[60%] right-[15%] w-32 h-32 bg-blue-500/30 rounded-full blur-[80px]" />

      <div className="relative z-10 w-full max-w-md px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gradient-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm rounded-lg p-8 border border-purple-500/20"
        >
          <div className="flex items-center gap-2 mb-8">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <span className="text-xl font-bold">StoryAI</span>
          </div>

          <h1 className="text-3xl font-bold mb-2">Create an account</h1>
          <p className="text-neutral-400 mb-6">Start creating amazing stories with AI</p>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-black/50 border-purple-500/20 text-white placeholder:text-neutral-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-black/50 border-purple-500/20 text-white placeholder:text-neutral-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="bg-black/50 border-purple-500/20 text-white placeholder:text-neutral-500"
                required
                minLength={6}
              />
            </div>
            <Button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
            >
              {isLoading ? 'Creating Account...' : (
                <>
                  Create Account <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="text-purple-400 hover:text-purple-300">
              Sign in
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  )
}