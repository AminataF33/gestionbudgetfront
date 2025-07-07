"use client"

import { useState, useEffect } from "react"
import apiClient from "@/lib/api"

interface Transaction {
  _id: string
  description: string
  amount: number
  date: string
  notes?: string
  tags?: string[]
  category: {
    _id: string
    name: string
    color: string
    icon: string
  }
  account: {
    _id: string
    name: string
    bank: string
    type: string
  }
  createdAt: string
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTransactions = async (filters?: {
    category?: string
    search?: string
    limit?: number
    offset?: number
    startDate?: string
    endDate?: string
    accountId?: string
    type?: string
  }) => {
    try {
      setLoading(true)
      const response = await apiClient.getTransactions(filters)

      if (response.success) {
        setTransactions(response.data)
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
        await fetchTransactions()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur ajout transaction:", error)
      return false
    }
  }

  const updateTransaction = async (id: string, transactionData: any) => {
    try {
      const response = await apiClient.updateTransaction(id, transactionData)

      if (response.success) {
        await fetchTransactions()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur mise à jour transaction:", error)
      return false
    }
  }

  const deleteTransaction = async (id: string) => {
    try {
      const response = await apiClient.deleteTransaction(id)

      if (response.success) {
        await fetchTransactions()
        return true
      } else {
        throw new Error(response.error)
      }
    } catch (error) {
      console.error("Erreur suppression transaction:", error)
      return false
    }
  }

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
