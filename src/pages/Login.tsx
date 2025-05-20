import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const success = await login(data.email, data.password);
      if (success) {
        if (data.email === 'admin@gmail.com') {
          navigate('/admin');
        } else {
          navigate('/main');
        }
      } else {
        setError('No account found with these credentials.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col justify-center px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <motion.h1 
          className="text-3xl font-bold text-teal-600 mb-2"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          Welcome to KikoApp
        </motion.h1>
        <p className="text-gray-600">Fresh groceries delivered to your doorstep</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white px-6 py-8 rounded-2xl shadow-lg max-w-md mx-auto w-full"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
            <AlertCircle size={18} className="text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="Enter your email"
            error={errors.email?.message}
            {...register('email', { 
              required: 'Email is required', 
              pattern: { 
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Please enter a valid email address'
              } 
            })}
          />
          
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock size={18} />}
              placeholder="Enter your password"
              error={errors.password?.message}
              {...register('password', { 
                required: 'Password is required',
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <Button 
            type="submit"
            fullWidth
            isLoading={isLoading}
          >
            Login
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-teal-600 font-medium hover:text-teal-700 transition-colors"
            >
              Create account
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;