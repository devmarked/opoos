'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Image from 'next/image'
import { PulsatingButton } from '@/components/magicui/pulsating-button'
import { DisclaimerModal, useFirstVisitModal } from '@/components/ui/disclaimer-modal'
import Link from 'next/link'

export default function Home() {
  const { isModalOpen, closeModal } = useFirstVisitModal()

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-center md:text-left">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Welcome to<br />
                <span className="text-primary">Opoos</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Streamline your proposal and quotation workflow for Website Development projects
              </p>
              <div className="flex justify-center md:justify-start space-x-4">
              <Link href="/auth">
                <Button size="lg">
                  Get Started
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  View Dashboard
                </Button> 
              </Link>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/1.jpg"
                  alt="Opoos Proposal Management Platform"
                  width={600}
                  height={400}
                  className="rounded-2xl shadow-2xl object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute top-2 right-2">
                  <PulsatingButton 
                    className="bg-primary hover:bg-primary/90 text-white text-xs px-2 py-1 rounded-md"
                    pulseColor="#f97316"
                    duration="2s"
                  >
                    Internal Tool
                  </PulsatingButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              Proposal Management Dashboard
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Track, filter, and manage proposals & quotes<br />
              Streamline your sales workflow with automation
            </p>
            <Link href="/dashboard">
              <Button className="mb-8" size="lg">
               Access Dashboard
              </Button>
            </Link>
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src="/images/opoos_screen.png"
                  alt="Opoos Dashboard Interface"
                  width={1000}
                  height={600}
                  className="rounded-2xl shadow-2xl object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 bg-background">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful<br />Proposal Management Features
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to streamline your proposal and quotation workflow.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-blue-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Proposal Workflow</h3>
              <p className="text-sm text-gray-600 mb-4">Intake form to capture client and project requirements efficiently</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-green-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Internal Dashboard</h3>
              <p className="text-sm text-gray-600 mb-4">Track, filter, and manage proposals & quotes in one place</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-500 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Automation Ready</h3>
              <p className="text-sm text-gray-600 mb-4">Integrates with n8n to auto-generate proposals and estimates</p>
            </Card>

            <Card className="p-6 text-center hover:shadow-lg transition-shadow">
              <div className="w-16 h-16 bg-primary hover:bg-primary/90 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <div className="w-8 h-8 bg-primary hover:bg-primary/90 rounded"></div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Role-Based Access</h3>
              <p className="text-sm text-gray-600 mb-4">Secure authentication with role-based permissions for teams</p>
            </Card>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-900 rounded-3xl text-white">
            <div className="grid md:grid-cols-2 items-center">
              <div className="p-8 md:p-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to streamline your proposals?
                </h2>
                <p className="text-lg opacity-90 mb-6">
                  Join your team and start managing proposals more efficiently today.
                </p>
                
                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                  <Link href="/auth">
                    <Button size="lg" className="w-full sm:w-auto">
                      Get Started
                    </Button>
                  </Link>
                  <Link href="/dashboard">
                    <Button size="lg" variant="outline" className="border-white text-black hover:bg-white hover:text-gray-900 w-full sm:w-auto">
                      View Dashboard
                    </Button>
                  </Link>
                </div>
                
                {/* Workflow Steps */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 opacity-90">Simple Workflow</h3>
                  <div className="space-y-2 text-sm opacity-80">
                    <div>1. Capture client requirements</div>
                    <div>2. Generate estimates automatically</div>
                    <div>3. Review and approve proposals</div>
                    <div>4. Track proposal status</div>
                  </div>
                </div>
              </div>
              <div className="h-full">
                <div className="relative h-full min-h-[300px]">
                  <Image
                    src="/images/2.jpg"
                    alt="Opoos Proposal Management"
                    fill
                    className="rounded-r-2xl object-cover"
                    unoptimized
                  />
                  <div className="absolute top-2 right-2">
                    <PulsatingButton 
                      className="bg-primary hover:bg-primary/90 text-white text-xs px-2 py-1 rounded-md"
                      pulseColor="#f97316"
                      duration="2s"
                    >
                      Internal Tool
                    </PulsatingButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
