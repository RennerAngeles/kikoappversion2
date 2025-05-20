import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Users, Store, ChevronRight, Image as ImageIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { useApp } from '../context/AppContext';
import ImageUpload from '../components/ImageUpload';
import Button from '../components/Button';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { logout, getRegisteredUsers } = useAuth();
  const { verificationRequests } = useStore();
  const { welcomeImage, updateWelcomeImage } = useApp();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Get actual counts
  const totalUsers = getRegisteredUsers().length;
  const totalSellers = verificationRequests.filter(req => req.status === 'approved').length;
  const pendingRequests = verificationRequests.filter(req => req.status === 'pending').length;

  const handleImageChange = async (_: File | null, base64: string | null) => {
    if (!base64) return;
    
    setIsUpdating(true);
    try {
      await updateWelcomeImage(base64);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setShowImageUpload(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to update welcome image:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-teal-600">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed top-20 left-4 right-4 bg-green-50 border border-green-100 text-green-700 px-4 py-3 rounded-lg shadow-lg z-50 flex items-center justify-center"
        >
          Welcome image updated successfully!
        </motion.div>
      )}

      {/* Content */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Total Users Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Users size={20} className="text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">Total Users</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{totalUsers}</h2>
          </motion.div>

          {/* Total Sellers Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Store size={20} className="text-orange-600" />
              </div>
              <span className="text-sm text-gray-500">Total Sellers</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800">{totalSellers}</h2>
          </motion.div>
        </div>

        {/* Welcome Image Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Welcome Image</h3>
          </div>
          
          {showImageUpload ? (
            <div className="p-4">
              <ImageUpload
                onChange={handleImageChange}
                value={welcomeImage}
                label="Upload new welcome image"
              />
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => setShowImageUpload(false)}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button
                  isLoading={isUpdating}
                  onClick={() => setShowImageUpload(false)}
                >
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <button
              className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              onClick={() => setShowImageUpload(true)}
            >
              <div className="flex items-center">
                <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                  <ImageIcon size={20} className="text-teal-600" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-800">Update Welcome Image</h4>
                  <p className="text-sm text-gray-500">Change the welcome banner image</p>
                </div>
              </div>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          )}
        </motion.div>

        {/* Verification Requests Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Verification Requests</h3>
          </div>
          <button
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/admin/verifications')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                <Store size={20} className="text-teal-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">New Store Requests</h4>
                <p className="text-sm text-gray-500">{pendingRequests} pending verification{pendingRequests !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </motion.div>

        {/* Accepted Sellers Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm overflow-hidden"
        >
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800">Accepted Sellers</h3>
          </div>
          <button
            className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            onClick={() => navigate('/admin/verifications?tab=approved')}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                <Store size={20} className="text-green-600" />
              </div>
              <div className="text-left">
                <h4 className="font-medium text-gray-800">View Accepted Sellers</h4>
                <p className="text-sm text-gray-500">{totalSellers} verified seller{totalSellers !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;