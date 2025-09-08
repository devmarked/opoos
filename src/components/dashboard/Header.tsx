'use client'

import { Bell, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface HeaderProps {
  user: {
    name: string
    email: string
    avatar?: string
    level: number
    points: number
  }
}

export function Header({ user }: HeaderProps) {
  return (
    <motion.div 
      className="flex flex-col gap-6 mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* User Profile & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.avatar} />
            <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white">
              {user.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-xl font-semibold">Welcome back, {user.name}!</h2>
            <p className="text-muted-foreground">Level {user.level} • {user.points} Points</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Link href="/profile">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard Banner */}
      <Card className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-teal-500 text-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-sm opacity-90">
              Welcome to your personalized dashboard. Here you can manage your account and view your activity.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/profile">
              <Button variant="secondary" className="text-purple-600 bg-white hover:bg-gray-100">
                View Profile
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
