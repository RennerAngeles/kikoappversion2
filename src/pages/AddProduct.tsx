import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';

interface AddProductFormData {
  name: string;
  category: string;
  price: string;
  description: string;
}

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { addProduct, updateProduct, getProductById } = useProducts();
  const [productImage, setProductImage] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSuccess, setShowSuccess] = React.useState(false);
  
  const searchParams = new URLSearchParams(location.search);
  const editProductId = searchParams.get('edit');
  const editProduct = editProductId ? getProductById(editProductId) : undefined;
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<AddProductFormData>();
  
  useEffect(() => {
    if (editProduct) {
      reset({
        name: editProduct.name,
        category: editProduct.category,
        price: editProduct.price.toString(),
        description: editProduct.description,
      });
      setProductImage(editProduct.image);
    }
  }, [editProduct, reset]);
  
  const onSubmit = async (data: AddProductFormData) => {
    if (!user?.id) return;
    setIsLoading(true);
    
    try {
      const productData = {
        sellerId: user.id,
        name: data.name,
        category: data.category as any,
        price: parseFloat(data.price),
        description: data.description,
        image: productImage || editProduct?.image || '',
      };
      
      let success;
      if (editProductId) {
        success = await updateProduct(editProductId, productData);
      } else {
        success = await addProduct(productData);
      }
      
      if (success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate('/seller/products');
        }, 1500);
      }
    } catch (error) {
      console.error('Failed to save product:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleImageChange = (_: File | null, base64: string | null) => {
    setProductImage(base64);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation title={editProductId ? "Edit Product" : "Add Product"} showBack />
      
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-4 right-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center"
        >
          <AlertCircle size={20} className="mr-2" />
          {editProductId ? "Product updated successfully!" : "Product added successfully!"}
        </motion.div>
      )}
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Product Image */}
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <ImageUpload
                label="Product Image"
                onChange={handleImageChange}
                value={editProduct?.image}
                error={errors.name?.message}
              />
            </div>
            
            {/* Product Details */}
            <div className="bg-white p-4 rounded-xl shadow-sm space-y-4">
              <Input
                label="Product Name"
                placeholder="Enter product name"
                error={errors.name?.message}
                {...register('name', { 
                  required: 'Product name is required' 
                })}
              />
              
              <Select
                label="Category"
                options={[
                  { value: 'vegetable', label: 'Vegetables' },
                  { value: 'fruit', label: 'Fruits' },
                  { value: 'seafood', label: 'Seafoods' },
                  { value: 'rice', label: 'Rice' }
                ]}
                error={errors.category?.message}
                {...register('category', { 
                  required: 'Category is required' 
                })}
              />
              
              <Input
                label="Price per Sack"
                type="text"
                placeholder="Enter price"
                error={errors.price?.message}
                {...register('price', { 
                  required: 'Price is required',
                  pattern: {
                    value: /^\d+(\.\d{0,2})?$/,
                    message: 'Please enter a valid price'
                  },
                  validate: (value) => 
                    parseFloat(value) > 0 || 'Price must be greater than 0'
                })}
              />
              
              <div>
                <label 
                  className="text-sm font-medium text-gray-700 block mb-1"
                >
                  Description
                </label>
                <textarea
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-200 focus:border-teal-500 transition-all duration-200 min-h-[120px]"
                  placeholder="Enter product description"
                  {...register('description', {
                    required: 'Description is required',
                    minLength: {
                      value: 10,
                      message: 'Description must be at least 10 characters'
                    }
                  })}
                />
                {errors.description?.message && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
            >
              {editProductId ? "Update Product" : "Save Product"}
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddProduct;