'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import { Navigation } from '../../components/Navigation'
import { Trash2, Home } from 'lucide-react'
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

export default function CategoryFavorites() {
  const { activeAccount, favorites, removeFavoriteByCategory } = useAuth()
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([])
  const params = useParams()
  const category = params.category as string

  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeAccount && favorites[activeAccount.id]?.[category]) {
        const fetchedCosmetics = await Promise.all(
          favorites[activeAccount.id][category].map(async (fav) => {
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
  }, [activeAccount, favorites, category])

  const handleDeleteFavorite = (cosmeticId: string) => {
    if (activeAccount) {
      removeFavoriteByCategory(activeAccount.id, category, cosmeticId)
      // Update the local state to reflect the change
      setCosmetics(prev => prev.filter(item => item.id !== cosmeticId))
    }
  }

  if (!activeAccount) {
    return <div>Please select an account to view favorites.</div>
  }

  return (
    <div className="bg-black text-white min-h-screen">
      <Navigation />
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold uppercase">{category} Favorites</h1>
          <Link href="/favorites" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded inline-flex items-center">
            <Home className="mr-2" />
            Back to Categories
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {cosmetics.map((cosmetic) => (
            <Card key={cosmetic.id} className={`${getRarityColor(cosmetic.rarity.value)} overflow-hidden border-red-500 relative`}>
              <CardHeader className="bg-black bg-opacity-50 flex justify-between items-center">
                <CardTitle className="text-white text-sm line-clamp-2 h-10">
                  {cosmetic.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="bg-gray-800 bg-opacity-75 p-4">
                <div className="relative w-full h-40 mb-2">
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute bottom-2 right-2 text-red-500 hover:text-red-600"
                  onClick={() => handleDeleteFavorite(cosmetic.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

