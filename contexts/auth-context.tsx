'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

type EmployeeRole = 'admin' | 'accountant' | 'order_manager' | 'delivery_agent' | 'customer_support'

interface CustomerSession {
  name: string
  phone: string
}

interface EmployeeSession {
  id: string
  name: string
  phone: string
  role: EmployeeRole
}

interface AuthContextType {
  // Customer
  customer: CustomerSession | null
  loginCustomer: (name: string, phone: string) => void
  logoutCustomer: () => void
  isCustomerLoggedIn: boolean

  // Employee
  employee: EmployeeSession | null
  loginEmployee: (employee: EmployeeSession) => void
  logoutEmployee: () => void
  isEmployeeLoggedIn: boolean
  isAdmin: boolean

  // Helpers
  hasRole: (roles: EmployeeRole[]) => boolean
  isHydrated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const CUSTOMER_STORAGE_KEY = 'gwabo-customer-session'
const EMPLOYEE_STORAGE_KEY = 'gwabo-employee-session'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<CustomerSession | null>(null)
  const [employee, setEmployee] = useState<EmployeeSession | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const storedCustomer = localStorage.getItem(CUSTOMER_STORAGE_KEY)
      if (storedCustomer) {
        setCustomer(JSON.parse(storedCustomer))
      }

      const storedEmployee = localStorage.getItem(EMPLOYEE_STORAGE_KEY)
      if (storedEmployee) {
        setEmployee(JSON.parse(storedEmployee))
      }
    } catch (error) {
      console.error('Error loading auth sessions:', error)
    }
    setIsHydrated(true)
  }, [])

  // Customer auth
  const loginCustomer = useCallback((name: string, phone: string) => {
    const session: CustomerSession = { name, phone }
    setCustomer(session)
    localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(session))
  }, [])

  const logoutCustomer = useCallback(() => {
    setCustomer(null)
    localStorage.removeItem(CUSTOMER_STORAGE_KEY)
  }, [])

  // Employee auth
  const loginEmployee = useCallback((emp: EmployeeSession) => {
    setEmployee(emp)
    localStorage.setItem(EMPLOYEE_STORAGE_KEY, JSON.stringify(emp))
  }, [])

  const logoutEmployee = useCallback(() => {
    setEmployee(null)
    localStorage.removeItem(EMPLOYEE_STORAGE_KEY)
  }, [])

  // Helpers
  const hasRole = useCallback((roles: EmployeeRole[]) => {
    if (!employee) return false
    return roles.includes(employee.role)
  }, [employee])

  return (
    <AuthContext.Provider
      value={{
        customer,
        loginCustomer,
        logoutCustomer,
        isCustomerLoggedIn: !!customer,

        employee,
        loginEmployee,
        logoutEmployee,
        isEmployeeLoggedIn: !!employee,
        isAdmin: employee?.role === 'admin',

        hasRole,
        isHydrated,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
