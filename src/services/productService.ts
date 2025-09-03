import { supabase } from '@/integrations/supabase/client';
import { Product, ProductsByCategory, ProductsContent } from '@/types/category';

// Default products removed to prevent automatic recreation after deletion
const defaultProducts: Product[] = [
  // No default products - they were causing automatic recreation after deletion
];

const defaultContent: ProductsContent = {
  products: {},
  heading: "I Nostri Prodotti",
  subheading: "Scopri la nostra selezione di fiori e composizioni per ogni occasione"
};

class ProductService {
  private cachedContent: ProductsContent | null = null;
  private isFetching = false;

  // Organize products by category
  private organizeProductsByCategory(products: Product[]): ProductsByCategory {
    const organized: ProductsByCategory = {};

    products.forEach(product => {
      const categorySlug = product.category_slug || 'unknown';
      if (!organized[categorySlug]) {
        organized[categorySlug] = [];
      }
      organized[categorySlug].push(product);
    });

    return organized;
  }

  // Fetch products from database
  async fetchProducts(): Promise<Product[]> {
    try {
      console.log('[ProductService] Fetching products from Supabase...');

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('is_active', true)
        .order('sort_order', { ascending: true })
        .order('is_featured', { ascending: false })
        .order('name', { ascending: true });

      if (error) {
        console.error('[ProductService] Error fetching products:', error);
        console.log('[ProductService] Returning empty array due to error');
        return [];
      }

      if (!data || data.length === 0) {
        console.log('[ProductService] No products found in database, returning empty array');
        return [];
      }

      console.log('[ProductService] Successfully fetched products from database:', data);

      // Transform database products to match frontend interface
      const transformedProducts: Product[] = data.map(product => ({
        ...product,
        // Ensure price is a number (database returns string for DECIMAL)
        price: typeof product.price === 'string' ? parseFloat(product.price) : (product.price || 0),
        // Add computed fields for frontend compatibility
        category: (product as any).categories?.name || 'Unknown',
        category_slug: (product as any).categories?.slug || 'unknown',
        is_available: product.is_active && (product.stock_quantity === null || product.stock_quantity > 0),
        images: product.image_url ? [product.image_url] : [],
        // Ensure required fields have defaults
        description: product.description || '',
        image_url: product.image_url || '',
        slug: product.slug || '',
        is_active: product.is_active ?? true,
        is_featured: product.is_featured ?? false,
        is_vegetarian: product.is_vegetarian ?? false,
        is_vegan: product.is_vegan ?? false,
        is_gluten_free: product.is_gluten_free ?? false,
        stock_quantity: product.stock_quantity ?? 0,
        compare_price: typeof product.compare_price === 'string' ? parseFloat(product.compare_price) : (product.compare_price ?? 0),
        sort_order: product.sort_order ?? 0,
        preparation_time: product.preparation_time ?? 15,
        calories: product.calories ?? null,
        meta_title: product.meta_title || '',
        meta_description: product.meta_description || '',
        labels: Array.isArray(product.labels) ? product.labels : [],
        ingredients: Array.isArray(product.ingredients) ? product.ingredients : [],
        allergens: Array.isArray(product.allergens) ? product.allergens : []
      }));

      return transformedProducts;
    } catch (error) {
      console.error('[ProductService] Error in fetchProducts:', error);
      return [];
    }
  }

  // Fetch content including products organized by category
  async fetchContent(): Promise<ProductsContent> {
    if (this.isFetching) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!this.isFetching && this.cachedContent) {
            clearInterval(checkInterval);
            resolve(this.cachedContent);
          }
        }, 100);
      });
    }

    this.isFetching = true;
    
    try {
      // Fetch products
      const products = await this.fetchProducts();
      const organizedProducts = this.organizeProductsByCategory(products);
      
      // Fetch content settings from site_content table
      const { data: contentData, error: contentError } = await supabase
        .from('site_content')
        .select('title, subtitle')
        .eq('section', 'products')
        .single();

      let heading = defaultContent.heading;
      let subheading = defaultContent.subheading;

      if (!contentError && contentData) {
        heading = contentData.title || heading;
        subheading = contentData.subtitle || subheading;
      }

      this.cachedContent = {
        products: organizedProducts,
        heading,
        subheading
      };

      return this.cachedContent;
    } catch (error) {
      console.error('[ProductService] Error fetching content:', error);
      return {
        ...defaultContent,
        products: {}
      };
    } finally {
      this.isFetching = false;
    }
  }

  // Get featured products across all categories
  async getFeaturedProducts(): Promise<Product[]> {
    const products = await this.fetchProducts();
    return products.filter(product => product.is_featured);
  }

  // Get products by category
  async getProductsByCategory(categorySlug: string): Promise<Product[]> {
    const products = await this.fetchProducts();
    return products.filter(product => product.category_slug === categorySlug);
  }

  // Clear cache
  clearCache(): void {
    console.log('[ProductService] Clearing cache');
    this.cachedContent = null;
    this.isFetching = false; // Reset fetching state
  }

  // Create product (for admin use)
  async createProduct(productData: Partial<Product>): Promise<{ success: boolean; product?: Product; error?: string }> {
    try {
      console.log('[ProductService] Creating product:', productData);

      // Ensure required fields
      if (!productData.name || !productData.price || !productData.category_id) {
        return { success: false, error: 'Missing required fields: name, price, category_id' };
      }

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description || '',
          price: productData.price,
          category_id: productData.category_id,
          image_url: productData.image_url || null,
          slug: productData.slug || productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          is_active: productData.is_active ?? true,
          is_featured: productData.is_featured ?? false,
          sort_order: productData.sort_order ?? 0,
          stock_quantity: productData.stock_quantity ?? null,
          preparation_time: productData.preparation_time ?? 15,
          ingredients: productData.ingredients || null,
          allergens: productData.allergens || null,
          is_vegetarian: productData.is_vegetarian ?? false,
          is_vegan: productData.is_vegan ?? false,
          is_gluten_free: productData.is_gluten_free ?? false,
          compare_price: productData.compare_price || null,
          calories: productData.calories || null,
          meta_title: productData.meta_title || null,
          meta_description: productData.meta_description || null,
          labels: productData.labels || null
        })
        .select()
        .single();

      if (error) {
        console.error('[ProductService] Error creating product:', error);
        return { success: false, error: error.message };
      }

      // Clear cache to force refresh
      this.clearCache();

      console.log('[ProductService] Product created successfully:', data);
      return { success: true, product: data };
    } catch (error) {
      console.error('[ProductService] Error in createProduct:', error);
      return { success: false, error: error.message };
    }
  }

  // Update product (for admin use)
  async updateProduct(id: string, productData: Partial<Product>): Promise<{ success: boolean; product?: Product; error?: string }> {
    try {
      console.log('[ProductService] Updating product:', id, productData);

      const updateData: any = {};

      // Only include fields that are provided
      if (productData.name !== undefined) updateData.name = productData.name;
      if (productData.description !== undefined) updateData.description = productData.description;
      if (productData.price !== undefined) updateData.price = productData.price;
      if (productData.category_id !== undefined) updateData.category_id = productData.category_id;
      if (productData.image_url !== undefined) updateData.image_url = productData.image_url;
      if (productData.slug !== undefined) updateData.slug = productData.slug;
      if (productData.is_active !== undefined) updateData.is_active = productData.is_active;
      if (productData.is_featured !== undefined) updateData.is_featured = productData.is_featured;
      if (productData.sort_order !== undefined) updateData.sort_order = productData.sort_order;
      if (productData.stock_quantity !== undefined) updateData.stock_quantity = productData.stock_quantity;
      if (productData.preparation_time !== undefined) updateData.preparation_time = productData.preparation_time;
      if (productData.ingredients !== undefined) updateData.ingredients = productData.ingredients;
      if (productData.allergens !== undefined) updateData.allergens = productData.allergens;
      if (productData.is_vegetarian !== undefined) updateData.is_vegetarian = productData.is_vegetarian;
      if (productData.is_vegan !== undefined) updateData.is_vegan = productData.is_vegan;
      if (productData.is_gluten_free !== undefined) updateData.is_gluten_free = productData.is_gluten_free;
      if (productData.compare_price !== undefined) updateData.compare_price = productData.compare_price;
      if (productData.calories !== undefined) updateData.calories = productData.calories;
      if (productData.meta_title !== undefined) updateData.meta_title = productData.meta_title;
      if (productData.meta_description !== undefined) updateData.meta_description = productData.meta_description;
      if (productData.labels !== undefined) updateData.labels = productData.labels;

      // Always update the updated_at timestamp
      updateData.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('[ProductService] Error updating product:', error);
        return { success: false, error: error.message };
      }

      // Clear cache to force refresh
      this.clearCache();

      console.log('[ProductService] Product updated successfully:', data);
      return { success: true, product: data };
    } catch (error) {
      console.error('[ProductService] Error in updateProduct:', error);
      return { success: false, error: error.message };
    }
  }

  // Delete product (for admin use)
  async deleteProduct(id: string): Promise<boolean> {
    try {
      console.log('[ProductService] Deleting product:', id);

      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('[ProductService] Error deleting product:', error);
        throw error;
      }

      // Clear cache to force refresh
      this.clearCache();

      console.log('[ProductService] Product deleted successfully');
      return true;
    } catch (error) {
      console.error('[ProductService] Error in deleteProduct:', error);
      return false;
    }
  }

  // Get product by ID
  async getProductById(id: string): Promise<Product | null> {
    try {
      console.log('[ProductService] Fetching product by ID:', id);

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories (
            id,
            name,
            slug
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('[ProductService] Error fetching product by ID:', error);
        return null;
      }

      if (!data) {
        console.log('[ProductService] Product not found:', id);
        return null;
      }

      // Transform database product to match frontend interface
      const transformedProduct: Product = {
        ...data,
        price: typeof data.price === 'string' ? parseFloat(data.price) : (data.price || 0),
        category: (data as any).categories?.name || 'Unknown',
        category_slug: (data as any).categories?.slug || 'unknown',
        is_available: data.is_active && (data.stock_quantity === null || data.stock_quantity > 0),
        images: data.image_url ? [data.image_url] : [],
        description: data.description || '',
        image_url: data.image_url || '',
        slug: data.slug || '',
        is_active: data.is_active ?? true,
        is_featured: data.is_featured ?? false,
        is_vegetarian: data.is_vegetarian ?? false,
        is_vegan: data.is_vegan ?? false,
        is_gluten_free: data.is_gluten_free ?? false,
        stock_quantity: data.stock_quantity ?? 0,
        compare_price: typeof data.compare_price === 'string' ? parseFloat(data.compare_price) : (data.compare_price ?? 0),
        sort_order: data.sort_order ?? 0,
        preparation_time: data.preparation_time ?? 15,
        calories: data.calories ?? null,
        meta_title: data.meta_title || '',
        meta_description: data.meta_description || '',
        labels: Array.isArray(data.labels) ? data.labels : [],
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : [],
        allergens: Array.isArray(data.allergens) ? data.allergens : []
      };

      return transformedProduct;
    } catch (error) {
      console.error('[ProductService] Error in getProductById:', error);
      return null;
    }
  }
}

export const productService = new ProductService();
export default productService;
