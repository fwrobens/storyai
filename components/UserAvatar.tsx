'use client'

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface UserAvatarProps {
  email: string | null
  className?: string
}

export function UserAvatar({ email, className }: UserAvatarProps) {
  if (!email) {
    return (
      <Avatar className={className}>
        <AvatarFallback className="bg-neutral-900">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    )
  }

  const initial = email[0].toUpperCase()
  const color = `hsl(${initial.charCodeAt(0) * 10}, 70%, 50%)`

  return (
    <Avatar className={className}>
      <AvatarFallback style={{ backgroundColor: color }} className="text-white">
        {initial}
      </AvatarFallback>
    </Avatar>
  )
}