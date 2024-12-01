'use client'

import Link from 'next/link'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Home, User } from 'lucide-react'
import { usePathname } from 'next/navigation'

export function Navigation() {
  const { activeAccount, accounts } = useAuth();
  const pathname = usePathname()

  return (
    <nav className="bg-gray-900 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-red-500">
          {/* Empty link for logo area */}
        </Link>
        <div className="flex items-center space-x-4">
          {activeAccount && (
            <span className="mr-4">Account: {activeAccount.name}</span>
          )}
          {pathname !== '/' && (
            <Link href="/">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                <Home className="mr-2 h-4 w-4" />
                Home
              </Button>
            </Link>
          )}
          {activeAccount && pathname !== '/favorites' && (
            <Link href="/favorites">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                Cosmetics
              </Button>
            </Link>
          )}
          {pathname !== '/accounts' && (
            <Link href="/accounts">
              <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white">
                <User className="mr-2 h-4 w-4" />
                {accounts.length === 0 ? 'Create Account' : 'Accounts'}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

