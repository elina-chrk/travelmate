import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userId, setUserId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("");
  

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        console.log("✅ JWT payload on load:", payload); 
        setUserId(payload.sub)
        setUsername(payload.username);
        setIsAuthenticated(true)
      } catch (error) {
        console.error('Невірний токен:', error)
        localStorage.removeItem('token')
      }
    }
    setIsLoading(false)
  }, [])

  const login = (token) => {
    localStorage.setItem('token', token)
    const payload = JSON.parse(atob(token.split('.')[1]))
    console.log("✅ JWT payload on login:", payload); 
    setUserId(payload.sub)
    setUsername(payload.username);
    setIsAuthenticated(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUserId(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, username, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
