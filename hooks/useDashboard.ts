"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"

interface DashboardData {
  user: any
  accounts: any[]
  recentTransactions: any[]
  budgets: any[]
  goals: any[]
  stats: {
    totalBalance: number
    monthlyExpenses: number
    savings: number
  }
}

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchDashboard = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getDashboard()

      if (response.success) {
        setData(response.data)
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
  const addTransaction = async (transactionData: any) => {
    try {
      const response = await apiClient.createTransaction(transactionData)

      if (response.success) {
        await fetchDashboard() // Recharger le dashboard
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur ajout transaction:", error)
      return false
    }
  }

  useEffect(() => {
    fetchDashboard()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetchDashboard,
    addTransaction,
  }
}
