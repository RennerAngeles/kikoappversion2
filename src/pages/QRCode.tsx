import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { Smartphone } from 'lucide-react';
import TopNavigation from '../components/TopNavigation';

const QRCode: React.FC = () => {
  // Get the local IP address and port from the current URL
  const localUrl = window.location.href.replace('/qr', '');

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <TopNavigation title="Test on Mobile" showBack />
      
      <div className="p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl p-6 shadow-sm text-center"
        >
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center">
              <Smartphone size={32} className="text-teal-600" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Scan to Test on Mobile
          </h2>
          <p className="text-gray-600 mb-6">
            Use your phone's camera to scan the QR code below and test the app on your mobile device.
          </p>
          
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-xl shadow-md">
              <QRCodeSVG 
                value={localUrl}
                size={200}
                level="H"
                includeMargin
              />
            </div>
          </div>
          
          <p className="text-sm text-gray-500">
            Make sure your phone is connected to the same WiFi network as your computer.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default QRCode;