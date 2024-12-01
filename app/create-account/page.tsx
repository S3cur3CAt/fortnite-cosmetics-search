'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Navigation } from '../components/Navigation'

export default function CreateAccount() {
  const [accountName, setAccountName] = useState('')
  const { addAccount } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (accountName.trim()) {
      addAccount(accountName.trim())
      router.push('/accounts')
    }
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation />
      <div className="container mx-auto mt-8">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Crear Nueva Cuenta</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Nombre de la cuenta"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                required
                className="bg-gray-800 text-white border-red-500"
              />
              <Button type="submit" className="w-full bg-red-500 hover:bg-red-600">
                Crear Cuenta
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

