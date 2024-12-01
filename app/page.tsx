'use client'

import { useState } from 'react'
import { useAuth } from './contexts/AuthContext'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { translateToEnglish } from './utils/translations'
import Link from 'next/link'

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

export default function CosmeticSearch() {
  const [searchTerm, setSearchTerm] = useState('')
  const [cosmetics, setCosmetics] = useState<Cosmetic[]>([])
  const [loading, setLoading] = useState(false)
  const { activeAccount, favorites, addFavorite, removeFavorite } = useAuth()

  const handleSearch = async () => {
    setLoading(true)
    try {
      const englishSearchTerm = translateToEnglish(searchTerm)
      const response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/search/all?name=${englishSearchTerm}&matchMethod=contains`)
      const data = await response.json()
      if (data.status === 200) {
        setCosmetics(data.data)
      } else {
        setCosmetics([])
      }
    } catch (error) {
      console.error('Error fetching cosmetics:', error)
      setCosmetics([])
    }
    setLoading(false)
  }

  const toggleFavorite = (cosmetic: Cosmetic) => {
    if (activeAccount) {
      if (isFavorite(cosmetic)) {
        removeFavorite(cosmetic.id)
      } else {
        addFavorite(activeAccount.id, cosmetic.id)
      }
    }
  }

  const isFavorite = (cosmetic: Cosmetic) => {
    return activeAccount && favorites.some(fav => fav.accountId === activeAccount.id && fav.id === cosmetic.id)
  }

  if (!activeAccount) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to Cosmetics Search</h1>
        <p className="mb-4">Please create or select an account to start searching for cosmetics.</p>
        <Link href="/accounts">
          <Button className="bg-red-500 hover:bg-red-600">Go to Accounts</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col gap-4">
        <Label htmlFor="search-cosmetics" className="text-white">
          Search cosmetics
        </Label>
        <div className="flex gap-2">
          <Input
            id="search-cosmetics"
            type="text"
            placeholder="Search cosmetics..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow bg-gray-800 text-white border-red-500"
          />
          <Button onClick={handleSearch} disabled={loading} className="bg-red-500 hover:bg-red-600">
            {loading ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
        {cosmetics.map((cosmetic) => (
          <Card key={cosmetic.id} className={`${getRarityColor(cosmetic.rarity.value)} overflow-hidden border-red-500`}>
            <CardHeader className="bg-black bg-opacity-50 p-2">
              <CardTitle className="text-white text-sm">{cosmetic.name}</CardTitle>
            </CardHeader>
            <CardContent className="bg-gray-800 bg-opacity-75 p-2">
              <div className="relative w-full h-24 mb-2">
                {cosmetic.images.smallIcon ? (
                  <Image
                    src={cosmetic.images.smallIcon}
                    alt={cosmetic.name}
                    layout="fill"
                    objectFit="contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No image
                  </div>
                )}
              </div>
              <p className="text-xs text-gray-300 mb-1 truncate">{cosmetic.type.displayValue}</p>
              <p className="text-xs text-gray-300 truncate">{cosmetic.rarity.displayValue}</p>
              <Button
                variant="ghost"
                size="sm"
                className={`mt-2 w-full ${isFavorite(cosmetic) ? "text-red-500" : "text-white hover:text-red-500"}`}
                onClick={() => toggleFavorite(cosmetic)}
              >
                <Heart className="h-4 w-4 mr-1" fill={isFavorite(cosmetic) ? "currentColor" : "none"} />
                {isFavorite(cosmetic) ? 'Remove from cosmetics' : 'Add to cosmetics'}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

