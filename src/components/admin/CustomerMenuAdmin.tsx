import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Search, 
  Eye, 
  EyeOff,
  Loader2,
  Pizza,
  DollarSign
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { ensureAdminAuth } from '@/utils/adminDatabaseUtils';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category_id: string;
  is_active: boolean;
  sort_order: number;
  slug: string;
  created_at: string;
  updated_at: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
  is_active: boolean;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  category_id: string;
  is_active: boolean;
}

const CustomerMenuAdmin: React.FC = () => {
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showInactive, setShowInactive] = useState(false);
  
  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    category_id: '',
    is_active: true
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await ensureAdminAuth();

      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (categoriesError) throw categoriesError;

      // Load products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .order('sort_order', { ascending: true });

      if (productsError) throw productsError;

      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare i dati del menu',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category_id: '',
      is_active: true
    });
    setIsFormOpen(true);
  };

  const openEditForm = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category_id: product.category_id,
      is_active: product.is_active
    });
    setIsFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price || !formData.category_id) {
      toast({
        title: 'Errore',
        description: 'Nome, prezzo e categoria sono obbligatori',
        variant: 'destructive'
      });
      return;
    }

    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      toast({
        title: 'Errore',
        description: 'Il prezzo deve essere un numero valido maggiore di 0',
        variant: 'destructive'
      });
      return;
    }

    try {
      setIsSubmitting(true);
      await ensureAdminAuth();

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update({
            name: formData.name,
            description: formData.description || null,
            price: price,
            category_id: formData.category_id,
            is_active: formData.is_active,
            slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            updated_at: new Date().toISOString()
          })
          .eq('id', editingProduct.id);

        if (error) throw error;

        toast({
          title: 'Successo',
          description: 'Prodotto aggiornato con successo'
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert({
            name: formData.name,
            description: formData.description || null,
            price: price,
            category_id: formData.category_id,
            is_active: formData.is_active,
            sort_order: 0,
            slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;

        toast({
          title: 'Successo',
          description: 'Prodotto creato con successo'
        });
      }

      setIsFormOpen(false);
      loadData();
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile salvare il prodotto',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm(`Sei sicuro di voler eliminare "${product.name}"?`)) {
      return;
    }

    try {
      await ensureAdminAuth();

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Successo',
        description: 'Prodotto eliminato con successo'
      });

      loadData();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile eliminare il prodotto',
        variant: 'destructive'
      });
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      await ensureAdminAuth();

      const { error } = await supabase
        .from('products')
        .update({
          is_active: !product.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', product.id);

      if (error) throw error;

      toast({
        title: 'Successo',
        description: `Prodotto ${!product.is_active ? 'attivato' : 'disattivato'} con successo`
      });

      loadData();
    } catch (error) {
      console.error('Error toggling product status:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile modificare lo stato del prodotto',
        variant: 'destructive'
      });
    }
  };

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
    const matchesActiveFilter = showInactive || product.is_active;

    return matchesSearch && matchesCategory && matchesActiveFilter;
  });

  // Group products by category
  const productsByCategory = categories.map(category => ({
    ...category,
    products: filteredProducts.filter(product => product.category_id === category.id)
  })).filter(category => category.products.length > 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p>Caricamento menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Pizza className="h-6 w-6 text-red-600" />
            Gestione Menu Cliente
          </h2>
          <p className="text-gray-600">Gestisci i prodotti che appaiono su /menu</p>
        </div>
        <Button onClick={openCreateForm} className="bg-green-600 hover:bg-green-700">
          <Plus className="w-4 h-4 mr-2" />
          Nuovo Prodotto
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Cerca prodotti..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Tutte le categorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tutte le categorie</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2">
              <Switch
                id="show-inactive"
                checked={showInactive}
                onCheckedChange={setShowInactive}
              />
              <Label htmlFor="show-inactive">Mostra inattivi</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prodotti Totali</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
              <Pizza className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Prodotti Attivi</p>
                <p className="text-2xl font-bold text-green-600">
                  {products.filter(p => p.is_active).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorie</p>
                <p className="text-2xl font-bold">{categories.length}</p>
              </div>
              <DollarSign className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Products by Category */}
      <div className="space-y-6" key={`products-${showInactive}`}>
        {productsByCategory.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Pizza className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Nessun prodotto trovato con i filtri selezionati.</p>
            </CardContent>
          </Card>
        ) : (
          productsByCategory.map((category) => (
            <Card key={category.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{category.name}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {category.products.length} prodotti
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.products.map((product) => (
                    <div
                      key={product.id}
                      className={`border rounded-lg p-4 ${
                        !product.is_active ? 'bg-gray-50 opacity-60' : 'bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-lg">{product.name}</h4>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditForm(product)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleToggleStatus(product)}
                            className={product.is_active ? 'text-orange-600' : 'text-green-600'}
                          >
                            {product.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(product)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description || 'Nessuna descrizione'}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="font-bold text-lg text-green-600">
                          €{product.price.toFixed(2)}
                        </span>
                        <div className="flex gap-1">
                          {!product.is_active && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded">
                              Inattivo
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Product Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingProduct ? 'Modifica Prodotto' : 'Nuovo Prodotto'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Nome del prodotto"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="description">Descrizione</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrizione del prodotto"
                  rows={3}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="price">Prezzo (€) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <Label htmlFor="category">Categoria *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  disabled={isSubmitting}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                  disabled={isSubmitting}
                />
                <Label htmlFor="is_active">Prodotto attivo</Label>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsFormOpen(false)}
                disabled={isSubmitting}
              >
                Annulla
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {editingProduct ? 'Aggiorna' : 'Crea'} Prodotto
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerMenuAdmin;
