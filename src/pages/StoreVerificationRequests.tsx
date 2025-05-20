import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Check, X, ChevronRight, Package, ShoppingBag, ChevronLeft } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '../components/Button';
import { useStore } from '../context/StoreContext';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useNotifications } from '../context/NotificationContext';

const StoreVerificationRequests: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { verificationRequests, approveRequest, declineRequest, restrictSeller, unrestrictSeller } = useStore();
  const { getProductsBySeller } = useProducts();
  const { getOrdersBySeller } = useOrders();
  const { addNotification } = useNotifications();
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showRestrictionDialog, setShowRestrictionDialog] = useState(false);
  const [restrictionReason, setRestrictionReason] = useState('');
  
  const searchParams = new URLSearchParams(location.search);
  const showApproved = searchParams.get('tab') === 'approved';

  const pendingRequests = verificationRequests.filter(request => request.status === 'pending');
  const approvedRequests = verificationRequests.filter(request => request.status === 'approved');
  const selectedRequestData = selectedRequest ? verificationRequests.find(r => r.id === selectedRequest) : null;

  const handleApprove = async (id: string) => {
    setIsLoading(true);
    try {
      const request = verificationRequests.find(r => r.id === id);
      if (request) {
        await approveRequest(id);
        
        await addNotification({
          userId: request.user.id!,
          title: 'Store Registration Approved',
          message: `Congratulations! Your store "${request.shop.name}" has been approved. You can now start posting products and selling on KikoApp.`,
          type: 'system'
        });
      }
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to approve request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecline = async (id: string) => {
    setIsLoading(true);
    try {
      const request = verificationRequests.find(r => r.id === id);
      if (request) {
        await declineRequest(id);
        
        await addNotification({
          userId: request.user.id!,
          title: 'Store Registration Declined',
          message: 'Your store registration has been declined. Please ensure all submitted information and documents are correct and try again.',
          type: 'system'
        });
      }
      setSelectedRequest(null);
    } catch (error) {
      console.error('Failed to decline request:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestrict = async () => {
    if (!selectedRequest || !restrictionReason.trim()) return;
    
    setIsLoading(true);
    try {
      const request = verificationRequests.find(r => r.id === selectedRequest);
      if (request) {
        await restrictSeller(selectedRequest, restrictionReason);
        
        await addNotification({
          userId: request.user.id!,
          title: 'Account Restricted',
          message: `Your seller account has been restricted. Reason: ${restrictionReason}`,
          type: 'system'
        });
        
        setShowRestrictionDialog(false);
        setRestrictionReason('');
      }
    } catch (error) {
      console.error('Failed to restrict seller:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnrestrict = async (id: string) => {
    setIsLoading(true);
    try {
      const request = verificationRequests.find(r => r.id === id);
      if (request) {
        await unrestrictSeller(id);
        
        await addNotification({
          userId: request.user.id!,
          title: 'Account Unrestricted',
          message: 'Your seller account has been unrestricted. You can now resume normal operations.',
          type: 'system'
        });
      }
    } catch (error) {
      console.error('Failed to unrestrict seller:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <button 
              onClick={() => {
                if (selectedRequest) {
                  setSelectedRequest(null);
                } else {
                  navigate('/admin');
                }
              }}
              className="mr-3"
            >
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-800">
              {selectedRequest ? 'Store Details' : 'Store Requests'}
            </h1>
          </div>
          {selectedRequest && (
            <button
              onClick={() => {
                if (selectedRequestData?.restricted) {
                  handleUnrestrict(selectedRequest);
                } else {
                  setShowRestrictionDialog(true);
                }
              }}
              className={`text-sm font-medium ${selectedRequestData?.restricted ? 'text-green-500' : 'text-red-500'}`}
            >
              {selectedRequestData?.restricted ? 'Unrestrict' : 'Restrict'}
            </button>
          )}
        </div>
      </div>

      {/* Restriction Dialog */}
      {showRestrictionDialog && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-xl p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Restrict Seller Account
            </h3>
            <textarea
              value={restrictionReason}
              onChange={(e) => setRestrictionReason(e.target.value)}
              placeholder="Enter reason for restriction..."
              className="w-full h-32 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
            />
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRestrictionDialog(false);
                  setRestrictionReason('');
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleRestrict}
                isLoading={isLoading}
              >
                Restrict Account
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Content */}
      <div className="p-4">
        {selectedRequest ? (
          // Show store details
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            {verificationRequests.map(request => request.id === selectedRequest && (
              <div key={request.id}>
                {/* Restriction Banner */}
                {request.restricted && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-lg mb-4"
                  >
                    <h3 className="font-semibold mb-1">Account Restricted</h3>
                    <p className="text-sm">{request.restrictionReason}</p>
                  </motion.div>
                )}

                {/* User Profile */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                      <img 
                        src={request.user.profilePhoto} 
                        alt={`${request.user.firstName} ${request.user.lastName}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-gray-800">
                        {request.user.firstName} {request.user.lastName}
                      </h2>
                      <p className="text-sm text-gray-500">{request.user.email}</p>
                    </div>
                  </div>
                </div>

                {/* Shop Information */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Shop Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <Store size={18} className="text-teal-600 mr-3" />
                      <span className="text-gray-700">{request.shop.name}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin size={18} className="text-teal-600 mr-3" />
                      <span className="text-gray-700">{request.shop.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone size={18} className="text-teal-600 mr-3" />
                      <span className="text-gray-700">{request.shop.contact}</span>
                    </div>
                  </div>
                </div>

                {/* Verification Documents */}
                <div className="bg-white rounded-xl p-4 mb-4">
                  <h3 className="font-semibold text-gray-800 mb-4">Verification Documents</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-2">ID Verification</p>
                      <div className="aspect-[3/2] rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={request.verificationFiles.idPhoto} 
                          alt="ID Verification" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-2">Face Verification</p>
                      <div className="aspect-[3/2] rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={request.verificationFiles.facePhoto} 
                          alt="Face Verification" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Products Box */}
                {request.status === 'approved' && (
                  <>
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <h3 className="font-semibold text-gray-800 mb-4">Products</h3>
                      <button
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => navigate(`/admin/seller-products/${request.user.id}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mr-3">
                            <Package size={20} className="text-teal-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-800">View Products</h4>
                            <p className="text-sm text-gray-500">
                              {getProductsBySeller(request.user.id!).length} product(s)
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                      </button>
                    </div>

                    {/* Processing Orders Box */}
                    <div className="bg-white rounded-xl p-4 mb-4">
                      <h3 className="font-semibold text-gray-800 mb-4">Processing Orders</h3>
                      <button
                        className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        onClick={() => navigate(`/seller/processing-orders/${request.user.id}`)}
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mr-3">
                            <ShoppingBag size={20} className="text-orange-600" />
                          </div>
                          <div className="text-left">
                            <h4 className="font-medium text-gray-800">View Processing Orders</h4>
                            <p className="text-sm text-gray-500">
                              {getOrdersBySeller(request.user.id!).filter(order => order.status === 'accepted').length} order(s) processing
                            </p>
                          </div>
                        </div>
                        <ChevronRight size={20} className="text-gray-400" />
                      </button>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                {request.status === 'pending' && (
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleDecline(request.id)}
                      icon={<X size={18} />}
                      isLoading={isLoading}
                    >
                      Decline
                    </Button>
                    <Button
                      onClick={() => handleApprove(request.id)}
                      icon={<Check size={18} />}
                      isLoading={isLoading}
                    >
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </motion.div>
        ) : (
          // Show list of requests
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-4"
          >
            {showApproved ? (
              approvedRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Sellers Found</h3>
                  <p className="text-gray-500">There are no sellers yet.</p>
                </div>
              ) : (
                approvedRequests.map(request => (
                  <motion.div
                    key={request.id}
                    className="bg-white rounded-xl p-4 shadow-sm relative"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={request.user.profilePhoto} 
                          alt={`${request.user.firstName} ${request.user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {request.user.firstName} {request.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{request.shop.name}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </motion.div>
                ))
              )
            ) : (
              pendingRequests.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store size={24} className="text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">No Requests Found</h3>
                  <p className="text-gray-500">There are no store requests to review.</p>
                </div>
              ) : (
                pendingRequests.map(request => (
                  <motion.div
                    key={request.id}
                    className="bg-white rounded-xl p-4 shadow-sm relative"
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedRequest(request.id)}
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
                        <img 
                          src={request.user.profilePhoto} 
                          alt={`${request.user.firstName} ${request.user.lastName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800">
                          {request.user.firstName} {request.user.lastName}
                        </h3>
                        <p className="text-sm text-gray-500">{request.shop.name}</p>
                      </div>
                      <ChevronRight size={20} className="text-gray-400" />
                    </div>
                  </motion.div>
                ))
              )
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StoreVerificationRequests;