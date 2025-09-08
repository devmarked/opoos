'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Header() {
  const { user, signOut, loading } = useAuth()

  return (
    <header className="w-full bg-white/10 backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <Image
              src="/images/opoos_logo.svg"
              alt="Opoos Logo"
              width={120}
              height={30}
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            <Link href="/" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
              Home
            </Link>
            {user && (
              <>
                <Link href="/dashboard" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                  Dashboard
                </Link>
                <Link href="/projects" className="text-gray-700 hover:text-gray-900 transition-colors font-medium">
                  Projects
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="w-20 h-9 bg-gray-300 animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <Link href="/profile">
                  <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm">
                    Profile
                  </Button>
                </Link>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut}
                  className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <>
                <Link href="/auth">
                  <Button variant="outline" size="sm" className="border-gray-400 text-gray-700 hover:bg-gray-100/80 backdrop-blur-sm">
                    Log in
                  </Button>
                </Link>
                <Link href="/auth">
                  <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                    Get started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
