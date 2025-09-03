import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Minus, ShoppingCart, X } from 'lucide-react';
import { Product, Category } from '@/types/category';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatPrice, calculateTotal, addPrices } from '@/utils/priceUtils';

interface ProductExtra {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string; // 'extras' or 'bevande'
}

interface SelectedExtra extends ProductExtra {
  quantity: number;
}

interface ProductCustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product, quantity: number, extras: SelectedExtra[], specialRequests?: string) => void;
}

const ProductCustomizationModal: React.FC<ProductCustomizationModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart
}) => {
  const [availableExtras, setAvailableExtras] = useState<ProductExtra[]>([]);
  const [availableBeverages, setAvailableBeverages] = useState<ProductExtra[]>([]);
  const [selectedExtras, setSelectedExtras] = useState<SelectedExtra[]>([]);
  const [selectedBeverages, setSelectedBeverages] = useState<SelectedExtra[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [categorySupportsExtras, setCategorySupportsExtras] = useState(false);
  const { toast } = useToast();

  // Load available extras and beverages when modal opens
  useEffect(() => {
    if (isOpen && product) {
      loadExtrasAndBeverages();
      checkCategoryExtrasSupport();
      // Reset state when modal opens
      setSelectedExtras([]);
      setSelectedBeverages([]);
      setQuantity(1);
      setSpecialRequests('');
    }
  }, [isOpen, product]);

  const checkCategoryExtrasSupport = async () => {
    console.log('🔍 [ProductCustomizationModal] Checking category extras support for product:');
    console.log('   Product ID:', product?.id);
    console.log('   Product Name:', product?.name);
    console.log('   Category ID:', product?.category_id);

    if (!product?.category_id) {
      console.log('❌ [ProductCustomizationModal] No category_id found, disabling extras');
      setCategorySupportsExtras(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .select('extras_enabled')
        .eq('id', product.category_id)
        .single();

      if (error) throw error;

      const extrasEnabled = data?.extras_enabled || false;
      console.log('✅ [ProductCustomizationModal] Category extras support:');
      console.log('   Category ID:', product.category_id);
      console.log('   Extras Enabled:', extrasEnabled);
      console.log('   Raw data:', data);

      setCategorySupportsExtras(extrasEnabled);
    } catch (error) {
      console.error('❌ [ProductCustomizationModal] Error checking category extras support:', error);
      setCategorySupportsExtras(false);
    }
  };

  const loadExtrasAndBeverages = async () => {
    try {
      setIsLoading(true);

      // Get category IDs for extras and beverages
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('id, slug, name')
        .in('slug', ['extra', 'extras', 'bevande', 'vini']);

      if (categoriesError) throw categoriesError;

      const extrasCategoryIds = categoriesData
        .filter(cat => ['extra', 'extras'].includes(cat.slug))
        .map(cat => cat.id);
      
      const beveragesCategoryIds = categoriesData
        .filter(cat => ['bevande', 'vini'].includes(cat.slug))
        .map(cat => cat.id);

      // Load extras
      if (extrasCategoryIds.length > 0) {
        const { data: extrasData, error: extrasError } = await supabase
          .from('products')
          .select('id, name, price, description')
          .eq('is_active', true)
          .in('category_id', extrasCategoryIds)
          .order('name');

        if (extrasError) throw extrasError;

        const extras: ProductExtra[] = extrasData.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description || '',
          category: 'extras'
        }));

        setAvailableExtras(extras);
      }

      // Load beverages (always available)
      if (beveragesCategoryIds.length > 0) {
        const { data: beveragesData, error: beveragesError } = await supabase
          .from('products')
          .select('id, name, price, description')
          .eq('is_active', true)
          .in('category_id', beveragesCategoryIds)
          .order('name');

        if (beveragesError) throw beveragesError;

        const beverages: ProductExtra[] = beveragesData.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          description: item.description || '',
          category: 'bevande'
        }));

        setAvailableBeverages(beverages);
      }
    } catch (error) {
      console.error('Error loading extras and beverages:', error);
      toast({
        title: 'Errore',
        description: 'Impossibile caricare gli extra e le bevande disponibili.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addExtra = (extra: ProductExtra, isExtras: boolean) => {
    const setSelected = isExtras ? setSelectedExtras : setSelectedBeverages;
    const selected = isExtras ? selectedExtras : selectedBeverages;

    setSelected(prev => {
      const existing = prev.find(item => item.id === extra.id);
      if (existing) {
        return prev.map(item =>
          item.id === extra.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...extra, quantity: 1 }];
    });
  };

  const removeExtra = (extraId: string, isExtras: boolean) => {
    const setSelected = isExtras ? setSelectedExtras : setSelectedBeverages;
    setSelected(prev => prev.filter(item => item.id !== extraId));
  };

  const updateExtraQuantity = (extraId: string, newQuantity: number, isExtras: boolean) => {
    if (newQuantity <= 0) {
      removeExtra(extraId, isExtras);
      return;
    }
    const setSelected = isExtras ? setSelectedExtras : setSelectedBeverages;
    setSelected(prev =>
      prev.map(item =>
        item.id === extraId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotalPrice = () => {
    if (!product) return 0;

    const productPrice = calculateTotal(product.price, quantity);
    const extrasPrice = selectedExtras.reduce((total, extra) =>
      addPrices(total, calculateTotal(extra.price * extra.quantity, quantity)), 0
    );
    const beveragesPrice = selectedBeverages.reduce((total, beverage) =>
      addPrices(total, calculateTotal(beverage.price * beverage.quantity, quantity)), 0
    );

    return addPrices(addPrices(productPrice, extrasPrice), beveragesPrice);
  };

  const handleAddToCart = () => {
    if (!product) return;

    // Combine extras and beverages
    const allExtras = [...selectedExtras, ...selectedBeverages];

    onAddToCart(product, quantity, allExtras, specialRequests);
    onClose();

    const extrasCount = selectedExtras.length;
    const beveragesCount = selectedBeverages.length;
    const totalAddons = extrasCount + beveragesCount;

    toast({
      title: 'Prodotto aggiunto al carrello! 🛒',
      description: `${product.name} con ${totalAddons} aggiunte è stato aggiunto al carrello.`,
    });
  };

  if (!product) return null;

  const allSelected = [...selectedExtras, ...selectedBeverages];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            🍽️ Personalizza {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            {product.image_url && (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-gray-600">{product.description}</p>
              <p className="text-lg font-bold text-green-600">€{formatPrice(product.price)}</p>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center gap-4">
            <span className="font-medium">Quantità:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus size={16} />
              </Button>
              <span className="w-12 text-center font-semibold">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
              >
                <Plus size={16} />
              </Button>
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="text-center py-4">Caricamento opzioni...</div>
          )}

          {/* Debug Info - Remove in production */}
          {!isLoading && (
            <div className="bg-gray-100 p-3 rounded text-xs">
              <strong>Debug Info:</strong><br/>
              Category ID: {product?.category_id || 'N/A'}<br/>
              Category Supports Extras: {categorySupportsExtras ? 'Yes' : 'No'}<br/>
              Available Extras: {availableExtras.length}<br/>
              Available Beverages: {availableBeverages.length}
            </div>
          )}

          {/* Extras Section - Only show if category supports extras */}
          {!isLoading && categorySupportsExtras && availableExtras.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Aggiungi Extra:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableExtras.map(extra => {
                  const selectedExtra = selectedExtras.find(item => item.id === extra.id);
                  return (
                    <div
                      key={extra.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{extra.name}</h5>
                          <p className="text-xs text-gray-600">{extra.description}</p>
                          <p className="text-sm font-semibold text-green-600">+€{formatPrice(extra.price)}</p>
                        </div>
                        {!selectedExtra ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addExtra(extra, true)}
                            className="ml-2"
                          >
                            <Plus size={14} />
                          </Button>
                        ) : (
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateExtraQuantity(extra.id, selectedExtra.quantity - 1, true)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="text-xs w-6 text-center">{selectedExtra.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateExtraQuantity(extra.id, selectedExtra.quantity + 1, true)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus size={12} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeExtra(extra.id, true)}
                              className="h-6 w-6 p-0 ml-1 text-red-500 hover:text-red-700"
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Beverages Section - Always show */}
          {!isLoading && availableBeverages.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3">Aggiungi Bevande:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableBeverages.map(beverage => {
                  const selectedBeverage = selectedBeverages.find(item => item.id === beverage.id);
                  return (
                    <div
                      key={beverage.id}
                      className="border rounded-lg p-3 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h5 className="font-medium text-sm">{beverage.name}</h5>
                          <p className="text-xs text-gray-600">{beverage.description}</p>
                          <p className="text-sm font-semibold text-blue-600">+€{formatPrice(beverage.price)}</p>
                        </div>
                        {!selectedBeverage ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addExtra(beverage, false)}
                            className="ml-2"
                          >
                            <Plus size={14} />
                          </Button>
                        ) : (
                          <div className="flex items-center gap-1 ml-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateExtraQuantity(beverage.id, selectedBeverage.quantity - 1, false)}
                              className="h-6 w-6 p-0"
                            >
                              <Minus size={12} />
                            </Button>
                            <span className="text-xs w-6 text-center">{selectedBeverage.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateExtraQuantity(beverage.id, selectedBeverage.quantity + 1, false)}
                              className="h-6 w-6 p-0"
                            >
                              <Plus size={12} />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeExtra(beverage.id, false)}
                              className="h-6 w-6 p-0 ml-1 text-red-500 hover:text-red-700"
                            >
                              <X size={12} />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Special Requests */}
          <div>
            <h4 className="font-semibold mb-3">Richieste Speciali:</h4>
            <Textarea
              placeholder="Aggiungi note speciali per la preparazione..."
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Selected Items Summary */}
          {allSelected.length > 0 && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Aggiunte selezionate:</h4>
              <div className="space-y-1">
                {allSelected.map(item => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.name} x{item.quantity}</span>
                    <span>+€{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Total and Add to Cart */}
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">
              Totale: €{formatPrice(calculateTotalPrice())}
            </div>
            <Button
              onClick={handleAddToCart}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              <ShoppingCart size={16} className="mr-2" />
              Aggiungi al Carrello
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductCustomizationModal;
