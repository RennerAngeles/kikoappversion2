import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { supabase, handleSupabaseError } from '../lib/supabase';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<boolean>;
  deleteProduct: (productId: string) => Promise<boolean>;
  updateProduct: (productId: string, updates: Partial<Product>) => Promise<boolean>;
  getProductsByCategory: (category: string) => Product[];
  getProductsBySeller: (sellerId: string) => Product[];
  getProductById: (productId: string) => Product | undefined;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');

        if (error) throw error;

        setProducts(data.map(product => ({
          id: product.id,
          sellerId: product.seller_id,
          name: product.name,
          category: product.category as any,
          price: product.price,
          description: product.description,
          image: product.image,
          createdAt: new Date(product.created_at),
        })));
      } catch (error) {
        handleSupabaseError(error);
      }
    };

    fetchProducts();

    // Subscribe to changes
    const productsSubscription = supabase
      .channel('products_channel')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'products' }, 
        async () => {
          await fetchProducts();
        }
      )
      .subscribe();

    return () => {
      productsSubscription.unsubscribe();
    };
  }, []);

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          seller_id: productData.sellerId,
          name: productData.name,
          category: productData.category,
          price: productData.price,
          description: productData.description,
          image: productData.image,
        }])
        .select()
        .single();

      if (error) throw error;
      if (!data) return false;

      setProducts(prev => [...prev, {
        id: data.id,
        sellerId: data.seller_id,
        name: data.name,
        category: data.category,
        price: data.price,
        description: data.description,
        image: data.image,
        createdAt: new Date(data.created_at),
      }]);

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: updates.name,
          category: updates.category,
          price: updates.price,
          description: updates.description,
          image: updates.image,
        })
        .eq('id', productId)
        .select()
        .single();

      if (error) throw error;
      if (!data) return false;

      setProducts(prev => prev.map(product => 
        product.id === productId ? {
          id: data.id,
          sellerId: data.seller_id,
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description,
          image: data.image,
          createdAt: new Date(data.created_at),
        } : product
      ));

      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) throw error;

      setProducts(prev => prev.filter(product => product.id !== productId));
      return true;
    } catch (error) {
      handleSupabaseError(error);
      return false;
    }
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => product.category === category);
  };

  const getProductsBySeller = (sellerId: string) => {
    return products.filter(product => product.sellerId === sellerId);
  };

  const getProductById = (productId: string) => {
    return products.find(product => product.id === productId);
  };

  return (
    <ProductContext.Provider value={{
      products,
      addProduct,
      deleteProduct,
      updateProduct,
      getProductsByCategory,
      getProductsBySeller,
      getProductById,
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};