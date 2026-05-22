'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Product, Category, Order, Employee, Customer, OrderStatus, ProductUnit } from '@/lib/types'
import { 
  products as initialProducts, 
  categories as initialCategories, 
  demoOrders as initialOrders, 
  demoEmployees as initialEmployees 
} from '@/lib/data'
import { isSupabaseConfigured, createClient } from '@/lib/supabase/client'
import { 
  getProducts, 
  createProduct as dbCreateProduct, 
  updateProduct as dbUpdateProduct, 
  deleteProduct as dbDeleteProduct, 
  updateStock as dbUpdateStock 
} from '@/services/products'
import { getCategories, createCategory as dbCreateCategory } from '@/services/categories'
import { getOrders, updateOrderStatus as dbUpdateOrderStatus } from '@/services/orders'
import { getEmployees, createEmployee as dbCreateEmployee, updateEmployee as dbUpdateEmployee } from '@/services/employees'
import { getCustomers, createCustomer as dbCreateCustomer, updateCustomer as dbUpdateCustomer } from '@/services/customers'

interface DataContextType {
  products: Product[]
  categories: Category[]
  orders: Order[]
  employees: Employee[]
  customers: Customer[]
  isHydrated: boolean

  // Product operations
  addProduct: (product: Omit<Product, 'id'>) => Product
  updateProduct: (id: string, updates: Partial<Product>) => void
  deleteProduct: (id: string) => void
  updateProductStock: (id: string, newStock: number) => void

  // Category operations
  addCategory: (category: Omit<Category, 'id'>) => Category

  // Order operations
  addOrder: (orderData: {
    customerName: string
    customerPhone: string
    district: string
    address: string
    notes?: string
    gpsLocation?: string
    items: { product: Product; quantity: number }[]
    subtotal: number
    deliveryFee: number
    total: number
    paymentMethod: Order['paymentMethod']
  }) => Order
  updateOrderStatus: (id: string, status: OrderStatus) => void

  // Employee operations
  addEmployee: (employee: Omit<Employee, 'id' | 'createdAt'>) => Employee
  updateEmployee: (id: string, updates: Partial<Employee>) => void

  // Customer operations
  addCustomer: (customer: Omit<Customer, 'id' | 'createdAt'>) => Customer
  updateCustomer: (id: string, updates: Partial<Customer>) => void
}

const DataContext = createContext<DataContextType | undefined>(undefined)

const STORAGE_KEYS = {
  PRODUCTS: 'gwabo-products',
  CATEGORIES: 'gwabo-categories',
  ORDERS: 'gwabo-orders',
  EMPLOYEES: 'gwabo-employees',
  CUSTOMERS: 'gwabo-customers',
}

// Map database categories to frontend
const mapCategoryToFE = (cat: any): Category => ({
  id: cat.id,
  name: cat.name,
  slug: cat.slug,
  icon: cat.icon || '📦',
})

// Map database products to frontend
const mapProductToFE = (prod: any): Product => ({
  id: prod.id,
  name: prod.name,
  price: Number(prod.price),
  unit: (prod.unit || 'kg') as ProductUnit,
  image: prod.image || (prod.images && prod.images[0]) || '/products/tomatoes.jpg',
  category: prod.category?.slug || 'fruits-legumes',
  description: prod.description || '',
  stock: prod.stock || 0,
  isActive: prod.is_available ?? true,
})

// Map database customers to frontend
const mapCustomerToFE = (cust: any): Customer => ({
  id: cust.id,
  name: cust.name,
  phone: cust.phone,
  address: cust.address || '',
  district: cust.district || '',
  gpsLocation: cust.gps_location || '',
  createdAt: new Date(cust.created_at || Date.now()),
})

// Map database orders to frontend
const mapOrderToFE = (ord: any): Order => ({
  id: ord.order_number || ord.id,
  customer: {
    id: ord.customer_id || '',
    name: ord.customer_name,
    phone: ord.customer_phone,
    address: ord.address || '',
    district: ord.district || '',
    gpsLocation: ord.gps_location || '',
    createdAt: new Date(ord.created_at || Date.now()),
  },
  items: (ord.items || []).map((item: any) => ({
    product: {
      id: item.product_id || '',
      name: item.product_name,
      price: Number(item.unit_price),
      unit: 'piece',
      image: '/products/tomatoes.jpg',
      category: 'fruits-legumes',
      stock: 0,
      isActive: true,
    },
    quantity: Number(item.quantity),
  })),
  subtotal: Number(ord.subtotal),
  deliveryFee: Number(ord.delivery_fee),
  total: Number(ord.total),
  paymentMethod: ord.payment_method as any,
  status: ord.status as any,
  notes: ord.notes || '',
  createdAt: new Date(ord.created_at || Date.now()),
})

// Map database employees to frontend
const mapEmployeeToFE = (emp: any): Employee => ({
  id: emp.id,
  name: emp.name,
  email: emp.email || '',
  phone: emp.phone,
  role: emp.role as any,
  isActive: emp.is_active,
  createdAt: new Date(emp.created_at || Date.now()),
})

export function DataProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [isHydrated, setIsHydrated] = useState(false)

  // Load data on mount (Dynamic: Supabase or LocalStorageFallback)
  useEffect(() => {
    if (typeof window === 'undefined') return

    async function loadData() {
      try {
        if (isSupabaseConfigured()) {
          console.log('[GWABO] Running in Supabase-Connected Mode')
          const dbCats = await getCategories()
          setCategories(dbCats.map(mapCategoryToFE))

          const dbProds = await getProducts({ onlyAvailable: false })
          setProducts(dbProds.map(mapProductToFE))

          const dbEmps = await getEmployees()
          setEmployees(dbEmps.map(mapEmployeeToFE))

          const dbOrders = await getOrders()
          setOrders(dbOrders.map(mapOrderToFE))

          const dbCustomers = await getCustomers()
          setCustomers(dbCustomers.map(mapCustomerToFE))
        } else {
          console.log('[GWABO] Running in Local Storage Fallback Mode')
          // 1. Categories
          const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES)
          let parsedCategories = initialCategories
          if (storedCategories) {
            parsedCategories = JSON.parse(storedCategories)
          } else {
            localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(initialCategories))
          }
          setCategories(parsedCategories)

          // 2. Products
          const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS)
          let parsedProducts = initialProducts
          if (storedProducts) {
            parsedProducts = JSON.parse(storedProducts)
          } else {
            localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts))
          }
          setProducts(parsedProducts)

          // 3. Employees
          const storedEmployees = localStorage.getItem(STORAGE_KEYS.EMPLOYEES)
          let parsedEmployees = initialEmployees
          if (storedEmployees) {
            const temp = JSON.parse(storedEmployees)
            parsedEmployees = temp.map((emp: any) => ({
              ...emp,
              createdAt: new Date(emp.createdAt),
            }))
          } else {
            localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(initialEmployees))
          }
          setEmployees(parsedEmployees)

          // 4. Orders
          const storedOrders = localStorage.getItem(STORAGE_KEYS.ORDERS)
          let parsedOrders = initialOrders
          if (storedOrders) {
            const temp = JSON.parse(storedOrders)
            parsedOrders = temp.map((order: any) => ({
              ...order,
              createdAt: new Date(order.createdAt),
              customer: {
                ...order.customer,
                createdAt: new Date(order.customer.createdAt),
              },
            }))
          } else {
            localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initialOrders))
          }
          setOrders(parsedOrders)

          // 5. Customers
          const storedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS)
          let parsedCustomers: Customer[] = []
          if (storedCustomers) {
            const temp = JSON.parse(storedCustomers)
            parsedCustomers = temp.map((c: any) => ({
              ...c,
              createdAt: new Date(c.createdAt),
            }))
          } else {
            const customerMap = new Map<string, Customer>()
            parsedOrders.forEach(order => {
              if (!customerMap.has(order.customer.phone)) {
                customerMap.set(order.customer.phone, order.customer)
              }
            })
            parsedCustomers = Array.from(customerMap.values())
            localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(parsedCustomers))
          }
          setCustomers(parsedCustomers)
        }
      } catch (error) {
        console.error('Error hydrating data context:', error)
      } finally {
        setIsHydrated(true)
      }
    }

    loadData()
  }, [])

  // Product Operations
  const addProduct = useCallback((productData: Omit<Product, 'id'>) => {
    const newProduct: Product = {
      ...productData,
      id: `p-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    }

    setProducts(prev => {
      const updated = [newProduct, ...prev]
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      (async () => {
        const supabase = createClient()
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', productData.category)
          .single()

        const dbProd = await dbCreateProduct({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          unit: productData.unit,
          category_id: cat?.id || null,
          stock: productData.stock,
          is_available: productData.isActive,
          images: [productData.image],
        })

        if (dbProd) {
          const feProd = mapProductToFE(dbProd)
          setProducts(prev => prev.map(p => p.id === newProduct.id ? feProd : p))
        }
      })()
    }

    return newProduct
  }, [])

  const updateProduct = useCallback((id: string, updates: Partial<Product>) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, ...updates } : p)
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      (async () => {
        const supabase = createClient()
        let category_id: string | undefined = undefined
        if (updates.category) {
          const { data: cat } = await supabase
            .from('categories')
            .select('id')
            .eq('slug', updates.category)
            .single()
          if (cat) category_id = cat.id
        }

        await dbUpdateProduct(id, {
          name: updates.name,
          description: updates.description,
          price: updates.price,
          unit: updates.unit,
          category_id,
          stock: updates.stock,
          is_available: updates.isActive,
          images: updates.image ? [updates.image] : undefined,
        })
      })()
    }
  }, [])

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, isActive: false } : p)
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      dbDeleteProduct(id)
    }
  }, [])

  const updateProductStock = useCallback((id: string, newStock: number) => {
    setProducts(prev => {
      const updated = prev.map(p => p.id === id ? { ...p, stock: Math.max(0, newStock) } : p)
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      dbUpdateStock(id, newStock)
    }
  }, [])

  // Category Operations
  const addCategory = useCallback((categoryData: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...categoryData,
      id: `cat-${Date.now()}`,
    }
    setCategories(prev => {
      const updated = [...prev, newCategory]
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      (async () => {
        const dbCat = await dbCreateCategory({
          name: categoryData.name,
          slug: categoryData.slug,
          icon: categoryData.icon,
        })
        if (dbCat) {
          const feCat = mapCategoryToFE(dbCat)
          setCategories(prev => prev.map(c => c.id === newCategory.id ? feCat : c))
        }
      })()
    }

    return newCategory
  }, [])

  // Customer Operations
  const addCustomer = useCallback((custData: Omit<Customer, 'id' | 'createdAt'>) => {
    const newCustomer: Customer = {
      ...custData,
      id: `c-${Date.now()}`,
      createdAt: new Date(),
    }
    setCustomers(prev => {
      const updated = [...prev, newCustomer]
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      (async () => {
        const dbCust = await dbCreateCustomer({
          name: custData.name,
          phone: custData.phone,
          district: custData.district,
          address: custData.address,
          gps_location: custData.gpsLocation,
        })
        if (dbCust) {
          const feCust = mapCustomerToFE(dbCust)
          setCustomers(prev => prev.map(c => c.id === newCustomer.id ? feCust : c))
        }
      })()
    }

    return newCustomer
  }, [])

  const updateCustomer = useCallback((id: string, updates: Partial<Customer>) => {
    setCustomers(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...updates } : c)
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      dbUpdateCustomer(id, {
        name: updates.name,
        phone: updates.phone,
        district: updates.district,
        address: updates.address,
        gps_location: updates.gpsLocation,
      })
    }
  }, [])

  // Order Operations
  const addOrder = useCallback((orderData: {
    customerName: string
    customerPhone: string
    district: string
    address: string
    notes?: string
    gpsLocation?: string
    items: { product: Product; quantity: number }[]
    subtotal: number
    deliveryFee: number
    total: number
    paymentMethod: Order['paymentMethod']
  }) => {
    let customerObj = customers.find(c => c.phone === orderData.customerPhone)

    if (!customerObj) {
      customerObj = {
        id: `c-${Date.now()}`,
        name: orderData.customerName,
        phone: orderData.customerPhone,
        address: orderData.address,
        district: orderData.district,
        gpsLocation: orderData.gpsLocation,
        createdAt: new Date(),
      }
      setCustomers(prev => {
        const updated = [...prev, customerObj!]
        if (!isSupabaseConfigured()) {
          localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(updated))
        }
        return updated
      })
    } else {
      updateCustomer(customerObj.id, {
        name: orderData.customerName,
        address: orderData.address,
        district: orderData.district,
        gpsLocation: orderData.gpsLocation || customerObj.gpsLocation,
      })
    }

    const orderNumber = `GW${new Date().getFullYear().toString().slice(-2)}${(new Date().getMonth() + 1).toString().padStart(2, '0')}${new Date().getDate().toString().padStart(2, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
    const newOrder: Order = {
      id: orderNumber,
      customer: customerObj,
      items: orderData.items,
      subtotal: orderData.subtotal,
      deliveryFee: orderData.deliveryFee,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      status: 'pending',
      notes: orderData.notes,
      createdAt: new Date(),
    }

    orderData.items.forEach(item => {
      updateProductStock(item.product.id, item.product.stock - item.quantity)
    })

    setOrders(prev => {
      const updated = [newOrder, ...prev]
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      (async () => {
        try {
          const response = await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              customer_name: orderData.customerName,
              customer_phone: orderData.customerPhone,
              district: orderData.district,
              address: orderData.address,
              gps_location: orderData.gpsLocation,
              subtotal: orderData.subtotal,
              delivery_fee: orderData.deliveryFee,
              total: orderData.total,
              payment_method: orderData.paymentMethod,
              notes: orderData.notes,
              items: orderData.items.map(item => ({
                product_id: item.product.id.startsWith('p-') ? null : item.product.id,
                product_name: item.product.name,
                quantity: item.quantity,
                unit_price: item.product.price,
              })),
            }),
          })
          const resData = await response.json()
          if (resData.success && resData.order) {
            const feOrder = mapOrderToFE(resData.order)
            setOrders(prev => prev.map(o => o.id === orderNumber ? feOrder : o))
          }
        } catch (err) {
          console.error('Error syncing order to Supabase:', err)
        }
      })()
    }

    return newOrder
  }, [customers, updateCustomer, updateProductStock, updateCustomer])

  const updateOrderStatus = useCallback((id: string, status: OrderStatus) => {
    setOrders(prev => {
      const updated = prev.map(o => o.id === id ? { ...o, status } : o)
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      dbUpdateOrderStatus(id, status as any)
    }
  }, [])

  // Employee Operations
  const addEmployee = useCallback((empData: Omit<Employee, 'id' | 'createdAt'>) => {
    const newEmployee: Employee = {
      ...empData,
      id: `e-${Date.now()}`,
      createdAt: new Date(),
    }
    setEmployees(prev => {
      const updated = [...prev, newEmployee]
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      (async () => {
        const dbEmp = await dbCreateEmployee({
          name: empData.name,
          phone: empData.phone,
          role: empData.role as any,
          email: empData.email,
          pin: '123456',
        })
        if (dbEmp) {
          const feEmp = mapEmployeeToFE(dbEmp)
          setEmployees(prev => prev.map(e => e.id === newEmployee.id ? feEmp : e))
        }
      })()
    }

    return newEmployee
  }, [])

  const updateEmployee = useCallback((id: string, updates: Partial<Employee>) => {
    setEmployees(prev => {
      const updated = prev.map(e => e.id === id ? { ...e, ...updates } : e)
      if (!isSupabaseConfigured()) {
        localStorage.setItem(STORAGE_KEYS.EMPLOYEES, JSON.stringify(updated))
      }
      return updated
    })

    if (isSupabaseConfigured()) {
      dbUpdateEmployee(id, {
        name: updates.name,
        phone: updates.phone,
        email: updates.email,
        role: updates.role as any,
        is_active: updates.isActive,
      })
    }
  }, [])

  return (
    <DataContext.Provider
      value={{
        products,
        categories,
        orders,
        employees,
        customers,
        isHydrated,

        addProduct,
        updateProduct,
        deleteProduct,
        updateProductStock,

        addCategory,

        addOrder,
        updateOrderStatus,

        addEmployee,
        updateEmployee,

        addCustomer,
        updateCustomer,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
