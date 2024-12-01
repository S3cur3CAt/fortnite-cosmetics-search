'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import html2canvas from 'html2canvas'
import { Trash2 } from 'lucide-react'

interface Cosmetic {
  id: string
  name: string
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

interface FavoritesByCategory {
  [category: string]: Cosmetic[]
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

export default function Favorites() {
  const { accounts, activeAccount, setActiveAccount, favorites, removeFavoriteByCategory } = useAuth()
  const [favoritesByCategory, setFavoritesByCategory] = useState<FavoritesByCategory>({})
  const [captureBackground, setCaptureBackground] = useState<'transparent' | 'black'>('transparent')

  useEffect(() => {
    const fetchFavorites = async () => {
      if (activeAccount) {
        const categorizedFavorites: FavoritesByCategory = {}
        for (const favorite of favorites.filter(f => f.accountId === activeAccount.id)) {
          const response = await fetch(`https://fortnite-api.com/v2/cosmetics/br/${favorite.id}`)
          const data = await response.json()
          if (data.data) {
            const category = data.data.type.value
            if (!categorizedFavorites[category]) {
              categorizedFavorites[category] = []
            }
            categorizedFavorites[category].push(data.data)
          }
        }
        setFavoritesByCategory(categorizedFavorites)
      }
    }
    fetchFavorites()
  }, [activeAccount, favorites])

  const handleDeleteFavorite = (category: string, cosmeticId: string) => {
    if (activeAccount) {
      removeFavoriteByCategory(activeAccount.id, category, cosmeticId)
      // Update the local state to reflect the change
      setFavoritesByCategory(prev => {
        const updatedCategory = prev[category].filter(item => item.id !== cosmeticId)
        if (updatedCategory.length === 0) {
          // If no items left in the category, remove the category
          const { [category]: _, ...rest } = prev
          return rest
        }
        return {
          ...prev,
          [category]: updatedCategory
        }
      })
    }
  }

  const captureScreenshot = async () => {
    if (activeAccount) {
      const element = document.getElementById('favorites-content')
      if (element) {
        const canvas = await html2canvas(element, {
          backgroundColor: captureBackground === 'transparent' ? null : 'black',
          useCORS: true,
          allowTaint: true,
          scale: 4,
          logging: true,
          onclone: (clonedDoc) => {
            Array.from(clonedDoc.images).forEach((img: HTMLImageElement) => {
              img.crossOrigin = "Anonymous"
            })
            // Adjust styles for capture
            const cards = clonedDoc.querySelectorAll('.cosmetic-card')
            cards.forEach((card: HTMLElement) => {
              card.style.margin = '8px'
              card.style.width = '150px'
              card.style.display = 'inline-block'
            })
            const titles = clonedDoc.querySelectorAll('.card-title')
            titles.forEach((title: HTMLElement) => {
              title.style.fontSize = '14px'
              title.style.lineHeight = '1.2'
              title.style.fontWeight = '600'
              title.style.color = 'white'
              title.style.textShadow = '2px 2px 4px rgba(0,0,0,1)'
              title.style.padding = '4px'
              title.style.backgroundColor = 'transparent'
            })

            const rarityTexts = clonedDoc.querySelectorAll('.rarity-text')
            rarityTexts.forEach((text: HTMLElement) => {
              text.style.fontSize = '12px'
              text.style.lineHeight = '1.2'
              text.style.fontWeight = '500'
              text.style.color = 'white'
              text.style.textShadow = '2px 2px 4px rgba(0,0,0,1)'
              text.style.padding = '4px'
              text.style.backgroundColor = 'transparent'
              text.style.position = 'relative'
              text.style.top = '-8px'  // Move text up
              text.style.marginBottom = '-8px'  // Compensate for the upward movement
            })
            const categories = clonedDoc.querySelectorAll('.category-title')
            categories.forEach((category: HTMLElement) => {
              category.style.fontSize = '28px'
              category.style.lineHeight = '1.6'
              category.style.fontWeight = 'bold'
              category.style.marginBottom = '20px'
              category.style.color = 'white'
              category.style.textShadow = '2px 2px 4px rgba(0,0,0,1), -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000'
              category.style.padding = '4px 8px'
              category.style.marginTop = '-25px'  // Increased from -20px to -25px
              category.style.position = 'relative'  // Added position relative
              category.style.top = '-15px'  // Changed from -10px to -15px
              category.style.backgroundColor = 'transparent'
              category.style.display = 'inline-block'
            })
          }
        })
        const dataUrl = canvas.toDataURL('image/png', 1.0)
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `${activeAccount.name}_cosmetics.png`
        link.click()
      }
    }
  }

  if (!activeAccount) {
    return (
      <div className="container mx-auto p-4">
        <p>Please select an account to view cosmetics.</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <span className="text-white">Account Select:</span>
          <Select
            value={activeAccount.id}
            onValueChange={(value) => setActiveAccount(value)}
          >
            <SelectTrigger className="w-[200px] bg-gray-800 text-white border-red-500 rounded-lg">
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 text-white border-red-500">
              {accounts.map((account) => (
                <SelectItem
                  key={account.id}
                  value={account.id}
                  className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer"
                >
                  {account.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="background-select" className="text-white">
              Select Background
            </Label>
            <Select
              value={captureBackground}
              onValueChange={(value: 'transparent' | 'black') => setCaptureBackground(value)}
            >
              <SelectTrigger id="background-select" className="w-[200px] bg-gray-800 text-white border-red-500 rounded-lg">
                <SelectValue placeholder="Select background" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white border-red-500">
                <SelectItem value="transparent" className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">Transparent</SelectItem>
                <SelectItem value="black" className="hover:bg-gray-700 focus:bg-gray-700 cursor-pointer">Black</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={captureScreenshot} className="bg-red-500 hover:bg-red-600 mt-6">
            Capture Cosmetics
          </Button>
        </div>
      </div>
      <div id="favorites-content" className="space-y-8">
        {Object.entries(favoritesByCategory).map(([category, items]) => (
          <div key={category} className="cosmetic-category space-y-4">
            <h3 className="category-title text-xl font-semibold uppercase">{category}</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3">
              {items.map((item) => (
                <Card key={item.id} className={`cosmetic-card ${getRarityColor(item.rarity.value)} overflow-hidden border-red-500 relative h-[250px]`}>
                  <CardHeader className="bg-black bg-opacity-50 p-2">
                    <CardTitle className="card-title text-white text-sm line-clamp-2 h-8">
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="relative w-full h-[170px]">
                      <Image
                        src={item.images.icon}
                        alt={item.name}
                        layout="fill"
                        objectFit="contain"
                        crossOrigin="anonymous"
                        className="absolute top-0 left-0 w-full h-full"
                        quality={100}
                        priority={true}
                      />
                    </div>
                    <div className="flex justify-between items-center px-2 pt-1 -mt-2 bg-black bg-opacity-50">
                      <p className="rarity-text text-xs text-gray-300">{item.rarity.displayValue}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteFavorite(category, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

