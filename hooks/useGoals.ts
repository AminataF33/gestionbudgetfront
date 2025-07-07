"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"

interface Goal {
  _id: string
  title: string
  description: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category: string
  priority: string
  isActive: boolean
  isCompleted: boolean
  completedAt?: string
  progressPercentage: number
  remainingAmount: number
  daysRemaining: number
  status: string
  createdAt: string
}

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoals = async (filters?: {
    isActive?: boolean
    category?: string
    status?: string
  }) => {
    try {
      setLoading(true)
      const response = await apiClient.getGoals(filters)

      if (response.success) {
        setGoals(response.data)
        setError(null)
      } else {
        throw new Error(response.error)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue")
    } finally {
      setLoading(false)
    }
  }

  const addGoal = async (goalData: any) => {
    try {
      const response = await apiClient.createGoal(goalData)

      if (response.success) {
        await fetchGoals()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur ajout objectif:", error)
      return false
    }
  }

  const updateGoal = async (id: string, goalData: any) => {
    try {
      const response = await apiClient.updateGoal(id, goalData)

      if (response.success) {
        await fetchGoals()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur mise à jour objectif:", error)
      return false
    }
  }

  const deleteGoal = async (id: string) => {
    try {
      const response = await apiClient.deleteGoal(id)

      if (response.success) {
        await fetchGoals()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur suppression objectif:", error)
      return false
    }
  }

  const addAmountToGoal = async (id: string, amount: number) => {
    try {
      const response = await apiClient.addAmountToGoal(id, amount)

      if (response.success) {
        await fetchGoals()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur ajout montant objectif:", error)
      return false
    }
  }

  useEffect(() => {
    fetchGoals()
  }, [])

  return {
    goals,
    loading,
    error,
    refetch: fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    addAmountToGoal,
  }
}
