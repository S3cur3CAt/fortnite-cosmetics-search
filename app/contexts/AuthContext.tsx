'use client'

import { createContext, useContext } from 'react';
import { useState, useEffect } from 'react';

interface Account {
  id: string;
  name: string;
}

interface Favorite {
  id: string;
  accountId: string;
  name?: string; // Added name as optional
}

interface Note {
  id: string;
  accountId: string;
  text: string;
}

interface AuthContextType {
  accounts: Account[];
  activeAccount: Account | null;
  favorites: Favorite[];
  notes: Note[];
  addAccount: (name: string) => void;
  deleteAccount: (id: string) => void;
  setActiveAccount: (id: string | null) => void;
  addFavorite: (accountId: string, cosmeticId: string) => void;
  removeFavorite: (cosmeticId: string) => void;
  addComment: (noteId: string, text: string) => void;
  addNote: (accountId: string, text: string) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, text: string) => void;
  updateAccount: (id: string, name: string) => void;
  removeFavoriteByCategory: (accountId: string, category: string, cosmeticId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const useAccounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const storedAccounts = localStorage.getItem('accounts');
    if (storedAccounts) {
      setAccounts(JSON.parse(storedAccounts));
    }

    const storedActiveAccount = localStorage.getItem('activeAccount');
    if (storedActiveAccount) {
      setActiveAccount(JSON.parse(storedActiveAccount));
    }

    const storedFavorites = localStorage.getItem('favorites');
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
    }

    const storedNotes = localStorage.getItem('notes');
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
  }, []);

  const addAccount = (name: string) => {
    const newAccount: Account = { id: Date.now().toString(), name };
    const updatedAccounts = [...accounts, newAccount];
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    setActiveAccount(newAccount);
    localStorage.setItem('activeAccount', JSON.stringify(newAccount));
  };

  const deleteAccount = (id: string) => {
    const updatedAccounts = accounts.filter((account) => account.id !== id);
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    if (activeAccount?.id === id) {
      setActiveAccount(null);
      localStorage.removeItem('activeAccount');
    }
    //Remove favorites and notes associated with the deleted account.
    const updatedFavorites = favorites.filter(fav => fav.accountId !== id);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    const updatedNotes = notes.filter(note => note.accountId !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));

  };


  const setActiveAccountWrapper = (id: string | null) => {
    if (id) {
      const account = accounts.find(account => account.id === id);
      setActiveAccount(account);
      localStorage.setItem('activeAccount', JSON.stringify(account));
    } else {
      setActiveAccount(null);
      localStorage.removeItem('activeAccount');
    }
  }

  const addFavorite = (accountId: string, cosmeticId: string) => {
    const newFavorite: Favorite = { id: cosmeticId, accountId };
    const updatedFavorites = [...favorites, newFavorite];
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const removeFavorite = (cosmeticId: string) => {
    const updatedFavorites = favorites.filter((favorite) => favorite.id !== cosmeticId);
    setFavorites(updatedFavorites);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
  };

  const addNote = (accountId: string, text: string) => {
    const newNote: Note = { id: Date.now().toString(), accountId, text };
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const deleteNote = (id: string) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const updateNote = (id: string, text: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === id ? { ...note, text } : note
    );
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const addComment = (noteId: string, text: string) => {
    //Implementation for adding comments to notes.  This is a placeholder.
    console.log("Adding comment to note", noteId, "with text:", text);
  };

  const updateAccount = (id: string, name: string) => {
    const updatedAccounts = accounts.map(account =>
      account.id === id ? { ...account, name } : account
    );
    setAccounts(updatedAccounts);
    localStorage.setItem('accounts', JSON.stringify(updatedAccounts));
    if (activeAccount?.id === id) {
      const updatedActiveAccount = { ...activeAccount, name };
      setActiveAccount(updatedActiveAccount);
      localStorage.setItem('activeAccount', JSON.stringify(updatedActiveAccount));
    }
  };

  const removeFavoriteByCategory = (accountId: string, category: string, cosmeticId: string) => {
    const updatedFavorites = { ...favorites };
    if (updatedFavorites[accountId] && updatedFavorites[accountId][category]) {
      updatedFavorites[accountId][category] = updatedFavorites[accountId][category].filter(
        (fav) => fav.id !== cosmeticId
      );
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    }
  };

  return { accounts, activeAccount, favorites, notes, addAccount, deleteAccount, setActiveAccount: setActiveAccountWrapper, addFavorite, removeFavorite, addComment, addNote, deleteNote, updateNote, updateAccount, removeFavoriteByCategory };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { accounts, activeAccount, favorites, notes, addAccount, deleteAccount, setActiveAccount: setActiveAccountWrapper, addFavorite, removeFavorite, addComment, addNote, deleteNote, updateNote, updateAccount, removeFavoriteByCategory } = useAccounts();

  return (
    <AuthContext.Provider value={{ 
      accounts, 
      activeAccount, 
      favorites, 
      notes,
      addAccount, 
      deleteAccount, 
      setActiveAccount: setActiveAccountWrapper, 
      addFavorite, 
      removeFavorite, 
      addComment,
      addNote,
      deleteNote,
      updateNote,
      updateAccount,
      removeFavoriteByCategory
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export default useAccounts;

