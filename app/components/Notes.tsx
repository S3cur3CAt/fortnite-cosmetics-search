'use client'

import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Pencil, Save, Trash2, X } from 'lucide-react'

export function Notes() {
  const { activeAccount, notes, addNote, deleteNote, updateNote } = useAuth()
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editedNoteText, setEditedNoteText] = useState('')

  const handleAddNote = () => {
    if (newNote.trim() && activeAccount) {
      addNote(activeAccount.id, newNote.trim())
      setNewNote('')
    }
  }

  const handleStartEdit = (note: { id: string, text: string }) => {
    setEditingNoteId(note.id)
    setEditedNoteText(note.text)
  }

  const handleSaveEdit = (noteId: string) => {
    if (editedNoteText.trim()) {
      updateNote(noteId, editedNoteText.trim())
      setEditingNoteId(null)
      setEditedNoteText('')
    }
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditedNoteText('')
  }

  if (!activeAccount) {
    return null
  }

  const accountNotes = notes.filter(note => note.accountId === activeAccount.id)

  return (
    <Card className="mt-4 bg-gray-900 border-red-500">
      <CardHeader>
        <CardTitle className="text-white">Notas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="Escribe una nueva nota..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="min-h-[100px] bg-gray-800 text-white border-red-500"
          />
          <Button 
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="w-full bg-red-500 hover:bg-red-600"
          >
            Añadir Nota
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accountNotes.map((note) => (
            <Card key={note.id} className="bg-gray-800 border-red-500">
              <CardContent className="p-4">
                {editingNoteId === note.id ? (
                  <div className="space-y-2">
                    <Input
                      value={editedNoteText}
                      onChange={(e) => setEditedNoteText(e.target.value)}
                      className="w-full bg-gray-700 text-white border-red-500"
                    />
                    <div className="flex justify-end space-x-2">
                      <Button
                        onClick={() => handleSaveEdit(note.id)}
                        variant="ghost"
                        size="sm"
                        className="text-green-400 hover:text-green-300"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleCancelEdit}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-gray-300"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-white whitespace-pre-wrap min-h-[100px]">{note.text}</p>
                    <div className="flex justify-between items-center text-sm text-gray-400">
                      <span>{new Date(parseInt(note.id)).toLocaleDateString()}</span>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleStartEdit(note)}
                          variant="ghost"
                          size="sm"
                          className="text-blue-400 hover:text-blue-300"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => deleteNote(note.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

