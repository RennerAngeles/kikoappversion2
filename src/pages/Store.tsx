import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Store as StoreIcon, ChevronRight, Upload, Camera, 
  CreditCard, AlertCircle, Phone, MapPin, Check, ShoppingBag
} from 'lucide-react';
import TopNavigation from '../components/TopNavigation';
import Button from '../components/Button';
import Input from '../components/Input';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useNavigate } from 'react-router-dom';

// State for store registration flow
type RegistrationStep = 'initial' | 'form' | 'verification' | 'submitted' | 'approved' | 'success';

const Store: React.FC = () => {
  const { user } = useAuth();
  const { submitVerification, getVerificationStatus } = useStore();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<RegistrationStep>('initial');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    shopName: '',
    contact: '',
    location: '',
  });
  const [idImage, setIdImage] = useState<string | null>(null);
  const [faceImage, setFaceImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check if user already has a verification request
  React.useEffect(() => {
    if (user) {
      const existingRequest = getVerificationStatus(user.id!);
      if (existingRequest) {
        if (existingRequest.status === 'pending') {
          setCurrentStep('submitted');
        } else if (existingRequest.status === 'approved') {
          setCurrentStep('success');
          setTimeout(() => {
            setCurrentStep('approved');
          }, 2000);
        }
      }
    }
  }, [user, getVerificationStatus]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNext = () => {
    if (currentStep === 'form') {
      // Validate form data
      if (!formData.shopName || !formData.contact || !formData.location) {
        setError('Please fill in all fields');
        return;
      }
      
      setError(null);
      setCurrentStep('verification');
    } else if (currentStep === 'verification') {
      if (!idImage || !faceImage) {
        setError('Please upload both ID and face verification images');
        return;
      }
      
      setError(null);
      handleSubmit();
    }
  };
  
  const handleSubmit = async () => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await submitVerification({
        user,
        shop: {
          name: formData.shopName,
          location: formData.location,
          contact: formData.contact,
        },
        verificationFiles: {
          idPhoto: idImage!,
          facePhoto: faceImage!,
        },
      });
      
      if (success) {
        setCurrentStep('submitted');
      } else {
        throw new Error('Failed to submit verification');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleIdImageChange = (_: File | null, base64: string | null) => {
    setIdImage(base64);
  };
  
  const handleFaceImageChange = (_: File | null, base64: string | null) => {
    setFaceImage(base64);
  };
  
  // Render content based on current step
  const renderContent = () => {
    switch (currentStep) {
      case 'success':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              You're a Seller Now!
            </h2>
            <p className="text-gray-600 mb-8 max-w-xs">
              Congratulations! Your store has been approved. You can now start posting products and selling on KikoApp.
            </p>
          </motion.div>
        );

      case 'approved':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Welcome, Seller!
            </h2>
            <p className="text-gray-600 mb-8 max-w-xs">
              Congratulations! You are now a verified seller on KikoApp.
              Start managing your store and adding products.
            </p>

            <Button 
              onClick={() => navigate('/seller/products')}
              className="w-full"
              icon={<ShoppingBag size={20} />}
            >
              Manage Products
            </Button>
          </motion.div>
        );

      case 'initial':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mb-6">
              <StoreIcon size={32} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Become a Seller
            </h2>
            <p className="text-gray-600 mb-8 max-w-xs">
              Start selling your products on KikoApp and reach thousands of customers
            </p>
            <Button 
              onClick={() => setCurrentStep('form')}
              className="w-full max-w-xs"
            >
              Start Selling
            </Button>
          </motion.div>
        );
        
      case 'form':
        return (
          <div className="px-4 py-6">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gray-800 mb-4"
            >
              Shop Information
            </motion.h2>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start">
                <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-4"
            >
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <Input
                  label="Shop Name"
                  name="shopName"
                  value={formData.shopName}
                  onChange={handleInputChange}
                  placeholder="Enter your shop name"
                  icon={<ShoppingBag size={18} />}
                  required
                  className="bg-white"
                />
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <Input
                  label="Contact Number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  placeholder="Enter your contact number"
                  icon={<Phone size={18} />}
                  required
                  className="bg-white"
                />
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <Input
                  label="Shop Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter your shop location"
                  icon={<MapPin size={18} />}
                  required
                  className="bg-white"
                />
              </div>
              
              <Button 
                onClick={handleNext}
                fullWidth
                className="mt-6"
              >
                Next
              </Button>
            </motion.div>
          </div>
        );
        
      case 'verification':
        return (
          <div className="px-4 py-6">
            <motion.h2 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl font-bold text-gray-800 mb-2"
            >
              Verification
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-600 mb-6"
            >
              Please upload the required documents for verification
            </motion.p>
            
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm flex items-start">
                <AlertCircle size={18} className="mr-2 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  ID Verification
                </label>
                <ImageUpload
                  onChange={handleIdImageChange}
                  label="Upload a valid government ID"
                />
              </div>
              
              <div className="bg-white p-4 rounded-xl border border-gray-200">
                <label className="text-sm font-medium text-gray-700 block mb-3">
                  Face Verification
                </label>
                <ImageUpload
                  onChange={handleFaceImageChange}
                  label="Take a selfie or upload a clear photo"
                />
              </div>
              
              <Button 
                onClick={handleNext}
                fullWidth
                isLoading={isLoading}
              >
                Submit Verification
              </Button>
            </motion.div>
          </div>
        );
        
      case 'submitted':
        return (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center px-6 py-12 text-center"
          >
            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-6">
              <StoreIcon size={32} className="text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Verification Submitted
            </h2>
            <p className="text-gray-600 mb-8 max-w-xs">
              Please wait for admin approval. This may take a while.
              We'll notify you once your shop is approved.
            </p>
            <Button 
              onClick={() => navigate('/main')}
              className="w-full max-w-xs"
            >
              Back to Home
            </Button>
          </motion.div>
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNavigation 
        title={currentStep === 'initial' ? 'Seller Center' : 'Become a Seller'} 
        showBack 
      />
      
      <div className="pt-16 pb-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Store;