import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StoreProvider } from './context/StoreContext';
import { ProductProvider } from './context/ProductContext';
import { OrderProvider } from './context/OrderContext';
import { NotificationProvider } from './context/NotificationContext';
import { MessageProvider } from './context/MessageContext';
import { AppProvider } from './context/AppContext';

// Import pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Main from './pages/Main';
import Profile from './pages/Profile';
import Store from './pages/Store';
import Products from './pages/Products';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import SellerProducts from './pages/SellerProducts';
import SellerProductsView from './pages/SellerProductsView';
import ProcessingOrders from './pages/ProcessingOrders';
import AddProduct from './pages/AddProduct';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';
import PaymentDetails from './pages/PaymentDetails';
import AdminDashboard from './pages/AdminDashboard';
import StoreVerificationRequests from './pages/StoreVerificationRequests';
import Notifications from './pages/Notifications';
import NotificationDetails from './pages/NotificationDetails';
import ProcessOrder from './pages/ProcessOrder';
import MyOrders from './pages/MyOrders';
import OrderDetails from './pages/OrderDetails';
import OrderStatus from './pages/OrderStatus';
import Shipping from './pages/Shipping';
import Delivered from './pages/Delivered';
import QRCode from './pages/QRCode';

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode; adminOnly?: boolean }> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (adminOnly && user?.email !== 'admin@gmail.com') {
    return <Navigate to="/main" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <StoreProvider>
            <ProductProvider>
              <OrderProvider>
                <NotificationProvider>
                  <MessageProvider>
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/qr" element={<QRCode />} />
                      
                      {/* Admin routes */}
                      <Route path="/admin" element={
                        <ProtectedRoute adminOnly>
                          <AdminDashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/verifications" element={
                        <ProtectedRoute adminOnly>
                          <StoreVerificationRequests />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin/seller-products/:sellerId" element={
                        <ProtectedRoute adminOnly>
                          <SellerProductsView />
                        </ProtectedRoute>
                      } />
                      <Route path="/seller/processing-orders/:sellerId" element={
                        <ProtectedRoute adminOnly>
                          <ProcessingOrders />
                        </ProtectedRoute>
                      } />
                      
                      {/* Protected routes */}
                      <Route path="/main" element={
                        <ProtectedRoute>
                          <Main />
                        </ProtectedRoute>
                      } />
                      <Route path="/profile" element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      } />
                      <Route path="/products" element={
                        <ProtectedRoute>
                          <Products />
                        </ProtectedRoute>
                      } />
                      <Route path="/messages" element={
                        <ProtectedRoute>
                          <Messages />
                        </ProtectedRoute>
                      } />
                      <Route path="/chat/:conversationId" element={
                        <ProtectedRoute>
                          <Chat />
                        </ProtectedRoute>
                      } />
                      <Route path="/category/:category" element={
                        <ProtectedRoute>
                          <CategoryProducts />
                        </ProtectedRoute>
                      } />
                      <Route path="/product/:productId" element={
                        <ProtectedRoute>
                          <ProductDetails />
                        </ProtectedRoute>
                      } />
                      <Route path="/payment" element={
                        <ProtectedRoute>
                          <PaymentDetails />
                        </ProtectedRoute>
                      } />
                      <Route path="/store" element={
                        <ProtectedRoute>
                          <Store />
                        </ProtectedRoute>
                      } />
                      <Route path="/seller/products" element={
                        <ProtectedRoute>
                          <SellerProducts />
                        </ProtectedRoute>
                      } />
                      <Route path="/seller/add-product" element={
                        <ProtectedRoute>
                          <AddProduct />
                        </ProtectedRoute>
                      } />
                      <Route path="/notifications" element={
                        <ProtectedRoute>
                          <Notifications />
                        </ProtectedRoute>
                      } />
                      <Route path="/notifications/:notificationId" element={
                        <ProtectedRoute>
                          <NotificationDetails />
                        </ProtectedRoute>
                      } />
                      <Route path="/process-order/:orderId" element={
                        <ProtectedRoute>
                          <ProcessOrder />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders" element={
                        <ProtectedRoute>
                          <MyOrders />
                        </ProtectedRoute>
                      } />
                      <Route path="/orders/:orderId" element={
                        <ProtectedRoute>
                          <OrderDetails />
                        </ProtectedRoute>
                      } />
                      <Route path="/order-status/:orderId" element={
                        <ProtectedRoute>
                          <OrderStatus />
                        </ProtectedRoute>
                      } />
                      <Route path="/shipping/:orderId" element={
                        <ProtectedRoute>
                          <Shipping />
                        </ProtectedRoute>
                      } />
                      <Route path="/delivered/:orderId" element={
                        <ProtectedRoute>
                          <Delivered />
                        </ProtectedRoute>
                      } />
                      
                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </MessageProvider>
                </NotificationProvider>
              </OrderProvider>
            </ProductProvider>
          </StoreProvider>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;