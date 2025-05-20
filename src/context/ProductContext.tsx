import React, { createContext, useContext, useState } from 'react';
import { Product } from '../types';

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
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('kikoProducts');
    return saved ? JSON.parse(saved) : [];
  });

  const saveProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    localStorage.setItem('kikoProducts', JSON.stringify(newProducts));
  };

  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const newProduct: Product = {
        ...productData,
        id: Math.random().toString(36).substring(2, 11),
        createdAt: new Date(),
      };

      saveProducts([...products, newProduct]);
      return true;
    } catch (error) {
      console.error('Failed to add product:', error);
      return false;
    }
  };

  const updateProduct = async (productId: string, updates: Partial<Product>): Promise<boolean> => {
    try {
      const updatedProducts = products.map(product => 
        product.id === productId ? { ...product, ...updates } : product
      );
      saveProducts(updatedProducts);
      return true;
    } catch (error) {
      console.error('Failed to update product:', error);
      return false;
    }
  };

  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const updatedProducts = products.filter(product => product.id !== productId);
      saveProducts(updatedProducts);
      return true;
    } catch (error) {
      console.error('Failed to delete product:', error);
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