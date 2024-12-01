import { AuthProvider } from './contexts/AuthContext'
import { Navigation } from './components/Navigation'
import React from 'react';
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-fredoka bg-black text-white">
        <AuthProvider>
          <Navigation />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

