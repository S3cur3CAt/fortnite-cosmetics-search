'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigation } from '../components/Navigation'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Notes } from '../components/Notes'

export default function Accounts() {
  const { accounts, addAccount, deleteAccount, activeAccount, setActiveAccount, updateAccount } = useAuth()
  const [newAccountName, setNewAccountName] = useState('')
  const [editingAccount, setEditingAccount] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const router = useRouter()

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault()
    if (newAccountName.trim()) {
      addAccount(newAccountName.trim())
      setNewAccountName('')
    }
  }

  const handleSetActiveAccount = (account: Account) => {
    setActiveAccount(account.id)
    router.push('/')
  }

  const handleStartEdit = (account: Account) => {
    setEditingAccount(account.id)
    setEditName(account.name)
  }

  const handleSaveEdit = (accountId: string) => {
    if (editName.trim()) {
      updateAccount(accountId, editName.trim())
      setEditingAccount(null)
      setEditName('')
    }
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <div className="container mx-auto p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Create New Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddAccount} className="flex gap-2">
              <Input
                type="text"
                value={newAccountName}
                onChange={(e) => setNewAccountName(e.target.value)}
                placeholder="Enter account name"
                className="flex-grow bg-gray-800 text-white border-red-500"
              />
              <Button type="submit" className="bg-red-500 hover:bg-red-600">Create Account</Button>
            </form>
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => (
            <Card key={account.id} className={`${activeAccount?.id === account.id ? 'border-red-500' : 'border-gray-700'}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                {editingAccount === account.id ? (
                  <Input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="bg-gray-800 text-white border-red-500"
                  />
                ) : (
                  <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
                )}
                <div className="flex space-x-2">
                  {editingAccount === account.id ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleSaveEdit(account.id)}
                      className="text-green-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleStartEdit(account)}
                      className="text-blue-500"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteAccount(account.id)}
                    className="text-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => handleSetActiveAccount(account)}
                  className={`w-full ${activeAccount?.id === account.id ? 'bg-red-500 hover:bg-red-600' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  {activeAccount?.id === account.id ? 'Current Account' : 'Set as Active'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        {accounts.length > 0 && <Notes />}
      </div>
    </div>
  )
}

