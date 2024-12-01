'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Navigation } from '../../components/Navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { translateToSpanish } from '../../utils/translations'

interface Cosmetic {
  id: string
  name: string
  description: string
  type: {
    value: string
    displayValue: string
  }
  rarity: {
    value: string
    displayValue: string
  }
  images: {
    smallIcon: string
    icon: string
  }
}

const getRarityColor = (rarity: string): string => {
  switch (rarity.toLowerCase()) {
    case 'rare':
      return 'bg-green-500'
    case 'epic':
      return 'bg-purple-500'
    case 'legendary':
      return 'bg-yellow-500'
    default:
      return 'bg-gray-200'
  }
}

export default function AccountItems() {
  const { accounts, favorites } = useAuth()
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([])
  const params = useParams()
  const accountId = params.id as string

  const account = accounts.find(acc => acc.id === accountId)

  useEffect(() => {
    const fetchFavorites = async () => {
      if (account && favorites[accountId]) {
        const allFavorites = Object.values(favorites[accountId]).flat()
        const fetchedCosmetics = await Promise.all(
          allFavorites.map(async (fav) => {
            const response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/${fav.id}`)
            const data = await response.json()
            return data.data
          })
        )
        setCosmetics(fetchedCosmetics.map(cosmetic => ({
          ...cosmetic,
          name: translateToSpanish(cosmetic.name)
        })))
      }
    }

    fetchFavorites()
  }, [account, favorites, accountId])

  if (!account) {
    return <div>Account not found.</div>
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{account.name}'s Favorites</h1>
          <Link href="/accounts">
            <Button className="bg-red-500 hover:bg-red-600">Back to Accounts</Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cosmetics.map((cosmetic) => (
            <Card key={cosmetic.id} className={`${getRarityColor(cosmetic.rarity.value)} overflow-hidden border-red-500`}>
              <CardHeader className="bg-black bg-opacity-50">
                <CardTitle className="text-white">{cosmetic.name}</CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-800 bg-opacity-75 p-4">
                <div className="relative w-full h-48 mb-2">
                  <Image
                    src={cosmetic.images.icon}
                    alt={cosmetic.name}
                    layout="fill"
                    objectFit="contain"
                  />
                </div>
                <p className="text-sm text-gray-300 mb-2">{cosmetic.description}</p>
                <p className="text-sm text-gray-300"><strong>Type:</strong> {cosmetic.type.displayValue}</p>
                <p className="text-sm text-gray-300"><strong>Rarity:</strong> {cosmetic.rarity.displayValue}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

