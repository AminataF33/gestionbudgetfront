"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"

interface Budget {
  _id: string
  amount: number
  spent: number
  period: string
  startDate: string
  endDate: string
  isActive: boolean
  alertThreshold: number
  notes?: string
  category: {
    _id: string
    name: string
    color: string
    icon: string
  }
  createdAt: string
}

export function useBudgets() {
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchBudgets = async (filters?: {
    period?: string
    isActive?: boolean
  }) => {
    try {
      setLoading(true)
      const response = await apiClient.getBudgets(filters)

      if (response.success) {
        setBudgets(response.data)
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

  const addBudget = async (budgetData: any) => {
    try {
      const response = await apiClient.createBudget(budgetData)

      if (response.success) {
        await fetchBudgets()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur ajout budget:", error)
      return false
    }
  }

  const updateBudget = async (id: string, budgetData: any) => {
    try {
      const response = await apiClient.updateBudget(id, budgetData)

      if (response.success) {
        await fetchBudgets()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur mise à jour budget:", error)
      return false
    }
  }

  const deleteBudget = async (id: string) => {
    try {
      const response = await apiClient.deleteBudget(id)

      if (response.success) {
        await fetchBudgets()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur suppression budget:", error)
      return false
    }
  }

  useEffect(() => {
    fetchBudgets()
  }, [])

  return {
    budgets,
    loading,
    error,
    refetch: fetchBudgets,
    addBudget,
    updateBudget,
    deleteBudget,
  }
}
