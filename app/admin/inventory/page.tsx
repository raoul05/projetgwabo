'use client'

import { useState, useEffect } from 'react'
import { 
  Search, 
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useData } from '@/contexts/data-context'
import { Product } from '@/lib/types'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

function ReplenishDialog({ product, trigger }: { product: Product; trigger: React.ReactNode }) {
  const { updateProductStock } = useData()
  const [isOpen, setIsOpen] = useState(false)
  const [amount, setAmount] = useState<number>(0)

  useEffect(() => {
    if (isOpen) {
      setAmount(0)
    }
  }, [isOpen])

  const handleReplenish = () => {
    if (amount <= 0) return
    updateProductStock(product.id, product.stock + amount)
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Réapprovisionner - {product.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="flex justify-between items-center bg-muted/50 p-3 rounded-lg">
            <span className="text-sm text-muted-foreground">Stock actuel:</span>
            <span className="font-semibold text-foreground">{product.stock} {product.unit}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="replenish-amount">Quantité à ajouter ({product.unit}) *</Label>
            <Input
              id="replenish-amount"
              type="number"
              min="1"
              value={amount || ''}
              onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
              placeholder="Ex: 50"
            />
          </div>
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handleReplenish}
              disabled={amount <= 0}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Ajouter au stock
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function InventoryPage() {
  const { products, categories } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [stockFilter, setStockFilter] = useState<string>('all')

  const lowStockThreshold = 15
  const criticalStockThreshold = 5

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    
    let matchesStock = true
    if (stockFilter === 'low') {
      matchesStock = product.stock <= lowStockThreshold && product.stock > criticalStockThreshold
    } else if (stockFilter === 'critical') {
      matchesStock = product.stock <= criticalStockThreshold
    } else if (stockFilter === 'good') {
      matchesStock = product.stock > lowStockThreshold
    }
    
    return matchesSearch && matchesStock
  })

  const totalProducts = products.length
  const lowStockCount = products.filter(p => p.stock <= lowStockThreshold && p.stock > criticalStockThreshold).length
  const criticalStockCount = products.filter(p => p.stock <= criticalStockThreshold).length
  const totalStockValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0)

  const getStockStatus = (stock: number) => {
    if (stock <= criticalStockThreshold) return { label: 'Critique', color: 'destructive' as const, progressColor: 'bg-red-500' }
    if (stock <= lowStockThreshold) return { label: 'Bas', color: 'secondary' as const, progressColor: 'bg-yellow-500' }
    return { label: 'Bon', color: 'outline' as const, progressColor: 'bg-green-500' }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gestion de l&apos;inventaire</h1>
        <p className="text-muted-foreground mt-1">
          Surveillez et gérez les niveaux de stock
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{totalProducts}</p>
              <p className="text-xs text-muted-foreground">Produits totaux</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
                <TrendingDown className="h-5 w-5 text-yellow-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-yellow-600">{lowStockCount}</p>
              <p className="text-xs text-muted-foreground">Stock bas</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold text-red-600">{criticalStockCount}</p>
              <p className="text-xs text-muted-foreground">Stock critique</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
            </div>
            <div className="mt-3">
              <p className="text-2xl font-bold">{formatPrice(totalStockValue)}</p>
              <p className="text-xs text-muted-foreground">Valeur du stock (FCFA)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {criticalStockCount > 0 && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  {criticalStockCount} produit(s) en stock critique
                </p>
                <p className="text-sm text-red-600">
                  Ces produits nécessitent un réapprovisionnement urgent.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un produit..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={stockFilter} onValueChange={setStockFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Niveau de stock" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les stocks</SelectItem>
                <SelectItem value="good">Stock bon</SelectItem>
                <SelectItem value="low">Stock bas</SelectItem>
                <SelectItem value="critical">Stock critique</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Inventaire ({filteredProducts.length} produits)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Produit</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Catégorie</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Prix unitaire</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Stock</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Niveau</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Valeur</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const category = categories.find(c => c.slug === product.category)
                  const status = getStockStatus(product.stock)
                  const stockPercentage = Math.min((product.stock / 100) * 100, 100)

                  return (
                    <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded bg-muted flex items-center justify-center text-xl">
                            {category?.icon || '📦'}
                          </div>
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-sm text-muted-foreground">
                        {category?.name}
                      </td>
                      <td className="py-3 px-4 text-sm">
                        {formatPrice(product.price)} FCFA/{product.unit}
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <span className="text-sm font-medium">{product.stock} unités</span>
                          <Progress value={stockPercentage} className="h-2" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={status.color}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm font-medium">
                        {formatPrice(product.price * product.stock)} FCFA
                      </td>
                      <td className="py-3 px-4">
                        <ReplenishDialog 
                          product={product} 
                          trigger={
                            <Button variant="outline" size="sm">
                              Réapprovisionner
                            </Button>
                          }
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Aucun produit trouvé.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
