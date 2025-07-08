const API_BASE_URL = "https://gestionbudgetback-1.onrender.com/api/"

class ApiClient {
  get(arg0: string) {
    throw new Error("Method not implemented.")
  }
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Récupérer le token depuis localStorage au démarrage
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth-token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth-token", token)
    }
  }

  removeToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-token")
    }
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API Request failed:", error)
      throw error
    }
  }

  // Méthodes d'authentification
  async signup(userData: any) {
    const response = await this.request("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    })

    if (response.success && response.token) {
      this.setToken(response.token)
    }

    return response
  }

  async login(email: string, password: string) {
    const response = await this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    if (response.success && response.token) {
      this.setToken(response.token)
    }

    return response
  }

  async logout() {
    try {
      await this.request("/auth/logout", { method: "POST" })
    } finally {
      this.removeToken()
    }
  }

  async getMe() {
    return this.request("/auth/me")
  }

  // Méthodes pour les transactions
  async getTransactions(params: any = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/transactions${queryString ? `?${queryString}` : ""}`)
  }

  async createTransaction(transactionData: any) {
    return this.request("/transactions", {
      method: "POST",
      body: JSON.stringify(transactionData),
    })
  }

  async updateTransaction(id: string, transactionData: any) {
    return this.request(`/transactions/${id}`, {
      method: "PUT",
      body: JSON.stringify(transactionData),
    })
  }

  async deleteTransaction(id: string) {
    return this.request(`/transactions/${id}`, {
      method: "DELETE",
    })
  }

  // Méthodes pour les budgets
  async getBudgets(params: any = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/budgets${queryString ? `?${queryString}` : ""}`)
  }

  async createBudget(budgetData: any) {
    return this.request("/budgets", {
      method: "POST",
      body: JSON.stringify(budgetData),
    })
  }

  async updateBudget(id: string, budgetData: any) {
    return this.request(`/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(budgetData),
    })
  }

  async deleteBudget(id: string) {
    return this.request(`/budgets/${id}`, {
      method: "DELETE",
    })
  }

  // Méthodes pour les objectifs
  async getGoals(params: any = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/goals${queryString ? `?${queryString}` : ""}`)
  }

  async createGoal(goalData: any) {
    return this.request("/goals", {
      method: "POST",
      body: JSON.stringify(goalData),
    })
  }

  async updateGoal(id: string, goalData: any) {
    return this.request(`/goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(goalData),
    })
  }

  async deleteGoal(id: string) {
    return this.request(`/goals/${id}`, {
      method: "DELETE",
    })
  }

  async addAmountToGoal(id: string, amount: number) {
    return this.request(`/goals/${id}/add-amount`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    })
  }

  // Méthodes pour les comptes
  async getAccounts(params: any = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/accounts${queryString ? `?${queryString}` : ""}`)
  }

  async createAccount(accountData: any) {
    return this.request("/accounts", {
      method: "POST",
      body: JSON.stringify(accountData),
    })
  }

  // Méthodes pour les catégories
  async getCategories(params: any = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/categories${queryString ? `?${queryString}` : ""}`)
  }

  async createCategory(categoryData: any) {
    return this.request("/categories", {
      method: "POST",
      body: JSON.stringify(categoryData),
    })
  }

  // Méthodes pour le tableau de bord
  async getDashboard() {
    return this.request("/dashboard")
  }

  async getQuickStats(period = "30") {
    return this.request(`/dashboard/quick-stats?period=${period}`)
  }

  // Méthodes pour les analyses
  async getAnalytics(period = "6months") {
    return this.request(`/analytics?period=${period}`)
  }

  // Méthodes pour le profil utilisateur
  async getProfile() {
    return this.request("/users/profile")
  }

  async updateProfile(profileData: any) {
    return this.request("/users/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient
