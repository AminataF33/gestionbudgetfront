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
    console.log("Envoi des données:", transactionData)
    const response = await apiClient.post("/transactions", transactionData)
    
    // Recharger les données du dashboard
    await fetchDashboard()
    return true
  } catch (error) {
    if (error && typeof error === "object" && "response" in error) {
      // @ts-ignore
      console.error("Erreur détaillée:", error.response?.data)
      // @ts-ignore
      if (error.response?.data?.errors) {
        // @ts-ignore
        error.response.data.errors.forEach((err: any) => {
          console.error(`Erreur ${err.field}: ${err.message}`)
        })
      }
    } else {
      console.error("Erreur détaillée:", error)
    }
    
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
