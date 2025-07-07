"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import apiClient from "@/lib/api"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  city: string
  profession: string
  fullName: string
  preferences: {
    currency: string
    language: string
    notifications: {
      email: boolean
      push: boolean
      budgetAlerts: boolean
    }
  }
  createdAt: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  signup: (userData: any) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
  updateProfile: (profileData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const response = await apiClient.getMe()
      if (response.success) {
        setUser(response.user)
      }
    } catch (error) {
      console.error("Erreur vérification auth:", error)
      // Si le token est invalide, le supprimer
      apiClient.removeToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await apiClient.login(email, password)

      if (response.success) {
        setUser(response.user)
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur connexion:", error)
      return false
    }
  }

  const signup = async (userData: any): Promise<boolean> => {
    try {
      const response = await apiClient.signup(userData)

      if (response.success) {
        setUser(response.user)
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur inscription:", error)
      return false
    }
  }

  const logout = async () => {
    try {
      await apiClient.logout()
    } catch (error) {
      console.error("Erreur déconnexion:", error)
    } finally {
      setUser(null)
    }
  }

  const updateProfile = async (profileData: any): Promise<boolean> => {
    try {
      const response = await apiClient.updateProfile(profileData)

      if (response.success) {
        setUser(response.data)
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur mise à jour profil:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
