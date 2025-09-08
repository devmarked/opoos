import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="bg-background border-t border-neutral-200/50 py-12 px-6 mt-auto">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-3 mb-4">
              <Image
                src="/images/opoos_logo.svg"
                alt="Opoos Logo"
                width={120}
                height={30}
                className="h-8 w-auto"
              />
            </div>
            <p className="text-gray-900 text-sm">
              Streamline your proposal and quotation workflow for Website Development projects
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/dashboard" className="hover:text-gray-900 transition-colors">Dashboard</Link></li>
              <li><Link href="/projects" className="hover:text-gray-900 transition-colors">Projects</Link></li>
              <li><Link href="/auth" className="hover:text-gray-900 transition-colors">Authentication</Link></li>
              <li><Link href="#" className="hover:text-gray-900 transition-colors">API</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Community</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Status</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-xs text-gray-500 mb-4 md:mb-0">
            &copy; 2025 Opoos. All rights reserved.
          </p>
          <p className="text-xs text-gray-500">
            Proposal & Quotation Management Platform
          </p>
        </div>
      </div>
    </footer>
  )
}
