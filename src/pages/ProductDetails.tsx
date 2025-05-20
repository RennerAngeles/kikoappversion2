import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import CategoryIcon from '../components/CategoryIcon';

const ProductDetails: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getProductById } = useProducts();
  const { getVerificationStatus } = useStore();
  const [sacks, setSacks] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  
  const product = productId ? getProductById(productId) : undefined;
  const sellerVerification = product ? getVerificationStatus(product.sellerId) : undefined;
  const seller = sellerVerification?.user;
  const shop = sellerVerification?.shop;
  
  // Check if current user is a seller
  const userVerification = user ? getVerificationStatus(user.id!) : undefined;
  const isSeller = userVerification?.status === 'approved';
  
  if (!product || !seller || !shop || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const totalAmount = product.price * sacks;

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      // Navigate to payment page with product details
      navigate('/payment', {
        state: {
          productId: product.id,
          sellerId: product.sellerId,
          quantity: sacks,
          price: product.price,
          productName: product.name,
          productImage: product.image,
        }
      });
    } catch (error) {
      console.error('Failed to process purchase:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Product Image */}
      <div className="relative h-[40vh]">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm p-2 rounded-full"
        >
          <ChevronLeft size={24} className="text-gray-800" />
        </button>
      </div>

      {/* Content */}
      <div className="relative -mt-6 bg-white rounded-t-3xl min-h-[60vh]">
        <div className="p-6">
          {/* Product Info */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <CategoryIcon type={product.category} size={20} />
              <span className="text-sm text-gray-600 capitalize">
                {product.category}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>
            <p className="text-3xl font-bold text-teal-600">
              ₱{product.price.toLocaleString()}/sack
            </p>
          </div>

          {/* Seller Info */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 mr-3">
                {seller.profilePhoto ? (
                  <img 
                    src={seller.profilePhoto} 
                    alt={`${seller.firstName} ${seller.lastName}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-100">
                    <User size={24} className="text-teal-600" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-semibold text-gray-800">
                  {shop.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {seller.firstName} {seller.lastName}
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <MapPin size={18} className="mr-2" />
                <span className="text-sm">{shop.location}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Phone size={18} className="mr-2" />
                <span className="text-sm">{shop.contact}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h3 className="font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantity in Sacks */}
          {!isSeller && (
            <div className="mb-8">
              <h3 className="font-semibold text-gray-800 mb-3">Number of Sacks</h3>
              <div className="flex items-center space-x-4">
                <button
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600"
                  onClick={() => setSacks(Math.max(1, sacks - 1))}
                >
                  -
                </button>
                <div className="flex flex-col items-center">
                  <span className="text-lg font-medium text-gray-800">{sacks}</span>
                  <span className="text-sm text-gray-500">sack{sacks > 1 ? 's' : ''}</span>
                </div>
                <button
                  className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-gray-600"
                  onClick={() => setSacks(sacks + 1)}
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Price Breakdown */}
          {!isSeller && (
            <div className="bg-gray-50 rounded-xl p-4 mb-24">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Price per sack</span>
                <span className="text-gray-800">₱{product.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Quantity</span>
                <span className="text-gray-800">{sacks} sack{sacks > 1 ? 's' : ''}</span>
              </div>
              <div className="border-t border-gray-200 my-2 pt-2">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-800">Total Amount</span>
                  <span className="font-bold text-teal-600">₱{totalAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Buy Button or Seller Message */}
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4">
            {isSeller ? (
              <div className="text-center text-gray-600">
                As a seller, you cannot purchase products
              </div>
            ) : (
              <Button
                fullWidth
                onClick={handlePurchase}
                icon={<ShoppingBag size={20} />}
                isLoading={isLoading}
              >
                Buy Now
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;