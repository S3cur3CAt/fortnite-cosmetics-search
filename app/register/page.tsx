'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    try {
      register(username, password)
      router.push('/')
    } catch (error) {
      console.error('Registration failed:', error)
    }
  }

  return (
    <div className="container mx-auto mt-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">Register</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

