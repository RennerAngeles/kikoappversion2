import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, Mail, MapPin, Phone, Package, LogOut, 
  Camera, Check, X, ChevronRight, ShoppingBag, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TopNavigation from '../components/TopNavigation';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';
import Input from '../components/Input';
import ImageUpload from '../components/ImageUpload';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useOrders } from '../context/OrderContext';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();
  const { getVerificationStatus } = useStore();
  const { getOrdersBySeller } = useOrders();
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  
  // Check if user is an approved seller
  const verificationStatus = user ? getVerificationStatus(user.id!) : undefined;
  const isApprovedSeller = verificationStatus?.status === 'approved';

  // Set Renner's image if it's his account
  const isRenner = user?.email === 'renner@gmail.com';
  const rennerImage = 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2';
  
  const handleImageChange = async (file: File | null, base64: string | null) => {
    if (!user) return;
    
    setIsLoading(true);
    setProfileImage(file);
    
    try {
      const success = await updateProfile({
        profilePhoto: base64 || user.profilePhoto,
      });
      
      if (!success) {
        throw new Error('Failed to update profile photo');
      }
    } catch (error) {
      console.error('Failed to update profile photo:', error);
      setProfileImage(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="min-h-screen bg-gray-50 pb-20 pt-16">
      <TopNavigation 
        title="My Profile" 
        showBack 
        showNotifications
      />
      
      <div className="px-4 py-6">
        {/* Profile Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-sm p-6 mb-6"
        >
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-md">
                {isRenner ? (
                  <img 
                    src={rennerImage}
                    alt="Renner Angeles"
                    className="w-full h-full object-cover"
                  />
                ) : user.profilePhoto ? (
                  <img 
                    src={user.profilePhoto} 
                    alt={`${user.firstName} ${user.lastName}`} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-teal-100 text-teal-600">
                    <User size={32} />
                  </div>
                )}
              </div>
              {!isRenner && (
                <label 
                  className="absolute bottom-0 right-0 bg-teal-500 text-white rounded-full p-1.5 shadow-sm cursor-pointer"
                  htmlFor="profile-photo"
                >
                  <Camera size={14} />
                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = () => {
                          handleImageChange(file, reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    disabled={isLoading}
                  />
                </label>
              )}
            </div>
            
            <h2 className="mt-4 text-xl font-bold text-gray-800">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-gray-500 text-sm">{user.email}</p>
          </div>
          
          <div className="mt-6 space-y-3">
            <div className="flex items-center text-gray-700">
              <MapPin size={18} className="text-teal-600 mr-3" />
              <span>{user.location || 'No location set'}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone size={18} className="text-teal-600 mr-3" />
              <span>{user.contact || 'No contact set'}</span>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          initial="hidden"
          animate="show"
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          {isApprovedSeller ? (
            <>
              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}
                className="w-full py-4 px-6 border-b border-gray-100 flex items-center justify-between"
                onClick={() => navigate('/seller/products')}
              >
                <div className="flex items-center">
                  <ShoppingBag size={20} className="text-teal-600 mr-3" />
                  <div className="text-left">
                    <span className="text-gray-800">My Products</span>
                    <p className="text-xs text-gray-500 mt-0.5">Manage your product listings</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </motion.button>

              <motion.button
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 }
                }}
                className="w-full py-4 px-6 border-b border-gray-100 flex items-center justify-between"
                onClick={() => navigate('/notifications')}
              >
                <div className="flex items-center">
                  <Bell size={20} className="text-orange-500 mr-3" />
                  <div className="text-left">
                    <span className="text-gray-800">Order Requests</span>
                    <p className="text-xs text-gray-500 mt-0.5">View and manage incoming orders</p>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400" />
              </motion.button>
            </>
          ) : (
            <motion.button
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0 }
              }}
              className="w-full py-4 px-6 border-b border-gray-100 flex items-center justify-between"
              onClick={() => navigate('/orders')}
            >
              <div className="flex items-center">
                <Package size={20} className="text-teal-600 mr-3" />
                <span className="text-gray-800">My Orders</span>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </motion.button>
          )}
          
          <motion.button
            variants={{
              hidden: { opacity: 0, y: 10 },
              show: { opacity: 1, y: 0 }
            }}
            className="w-full py-4 px-6 flex items-center text-red-500"
            onClick={logout}
          >
            <LogOut size={20} className="mr-3" />
            <span>Logout</span>
          </motion.button>
        </motion.div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;