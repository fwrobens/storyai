'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../providers'
import InteractiveStoryteller from '@/components/InteractiveStoryteller'

export default function StoryPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return <InteractiveStoryteller />
}