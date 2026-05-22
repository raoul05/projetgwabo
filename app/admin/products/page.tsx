'use client'

import { useState } from 'react'
import { 
  Search, 
  Plus,
  Edit2,
  Trash2,
  Package,
  Filter
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { useEffect } from 'react'
import { useData } from '@/contexts/data-context'
import { Product, ProductUnit } from '@/lib/types'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('fr-FR').format(price)
}

const unitLabels: Record<ProductUnit, string> = {
  kg: 'Kilogramme',
  g: 'Gramme',
  L: 'Litre',
  cl: 'Centilitre',
  ml: 'Millilitre',
  piece: 'Pièce',
  sachet: 'Sachet',
  plateau: 'Plateau',
  botte: 'Botte',
}

function ProductFormDialog({ product, trigger }: { product?: Product, trigger: React.ReactNode }) {
  const { addProduct, updateProduct, categories } = useData()
  const [isOpen, setIsOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    unit: product?.unit || 'kg',
    category: product?.category || 'fruits-legumes',
    description: product?.description || '',
    stock: product?.stock || 0,
    isActive: product?.isActive ?? true,
  })

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: product?.name || '',
        price: product?.price || 0,
        unit: product?.unit || 'kg',
        category: product?.category || 'fruits-legumes',
        description: product?.description || '',
        stock: product?.stock || 0,
        isActive: product?.isActive ?? true,
      })
    }
  }, [isOpen, product])

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.category) return

    const productData = {
      name: formData.name,
      price: formData.price,
      unit: formData.unit as ProductUnit,
      category: formData.category,
      description: formData.description,
      stock: formData.stock,
      isActive: formData.isActive,
      image: product?.image || '/products/tomatoes.jpg',
    }

    if (product) {
      updateProduct(product.id, productData)
    } else {
      addProduct(productData)
    }
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{product ? 'Modifier le produit' : 'Ajouter un produit'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du produit *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ex: Tomates fraîches"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Prix (FCFA) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unité</Label>
              <Select value={formData.unit} onValueChange={(v) => setFormData({ ...formData, unit: v as ProductUnit })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(unitLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Catégorie *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Description du produit..."
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="active">Produit actif</Label>
            <Switch
              id="active"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSubmit} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              {product ? 'Enregistrer' : 'Ajouter'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function ProductsPage() {
  const { products, categories, deleteProduct } = useData()
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Voulez-vous vraiment désactiver/supprimer le produit "${name}" ?`)) {
      deleteProduct(id)
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Gestion des produits</h1>
          <p className="text-muted-foreground mt-1">
            Ajoutez, modifiez et gérez vos produits
          </p>
        </div>
        <ProductFormDialog 
          trigger={
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un produit
            </Button>
          }
        />
      </div>

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
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => {
          const category = categories.find(c => c.slug === product.category)
          return (
            <Card key={product.id} className={!product.isActive ? 'opacity-60' : ''}>
              <CardContent className="p-4">
                <div className="aspect-square rounded-lg bg-muted flex items-center justify-center mb-4">
                  <span className="text-5xl">
                    {category?.icon || '📦'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium line-clamp-2">{product.name}</h3>
                    {!product.isActive && (
                      <Badge variant="secondary" className="ml-2">Inactif</Badge>
                    )}
                  </div>

                  <p className="text-lg font-bold text-primary">
                    {formatPrice(product.price)} FCFA
                    <span className="text-sm font-normal text-muted-foreground">/{product.unit}</span>
                  </p>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock:</span>
                    <Badge variant={product.stock < 10 ? 'destructive' : 'outline'}>
                      {product.stock} unités
                    </Badge>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <ProductFormDialog
                      product={product}
                      trigger={
                        <Button variant="outline" size="sm" className="flex-1">
                          <Edit2 className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                      }
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-destructive hover:text-destructive"
                      disabled={!product.isActive}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Aucun produit trouvé.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
