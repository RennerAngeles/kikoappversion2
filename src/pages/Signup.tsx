import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { User, Mail, MapPin, Phone, Users, Hash, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import Input from '../components/Input';
import Select from '../components/Select';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';

interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  contact: string;
  gender: string;
  age: string;
  password: string;
  confirmPassword: string;
}

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, watch, formState: { errors } } = useForm<SignupFormData>();
  
  const password = watch('password', '');
  
  const onSubmit = async (data: SignupFormData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      if (data.password !== data.confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      // Format phone number to ensure it starts with 09
      const formattedContact = data.contact.startsWith('09') 
        ? data.contact 
        : `09${data.contact.replace(/^[+]?63|^0+/, '')}`;
      
      const success = await signup({
        firstName: data.firstName.trim(),
        lastName: data.lastName.trim(),
        email: data.email.toLowerCase().trim(),
        location: data.location.trim(),
        contact: formattedContact,
        gender: data.gender,
        age: parseInt(data.age, 10),
        password: data.password,
      });
      
      if (success) {
        navigate('/main');
      } else {
        setError('An account with this email already exists.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex flex-col justify-start p-6">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
          icon={<span className="mr-1">←</span>}
        >
          Back
        </Button>
        <h1 className="text-2xl font-bold text-gray-800">Create Account</h1>
        <p className="text-gray-600">Fill in your details below</p>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="bg-white px-6 py-8 rounded-2xl shadow-lg w-full mb-10"
      >
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
            <AlertCircle size={18} className="text-red-600 mr-2 flex-shrink-0 mt-0.5" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              icon={<User size={18} />}
              placeholder="Enter first name"
              error={errors.firstName?.message}
              {...register('firstName', { 
                required: 'First name is required',
                minLength: {
                  value: 2,
                  message: 'First name must be at least 2 characters'
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'First name can only contain letters'
                }
              })}
            />
            
            <Input
              label="Last Name"
              icon={<User size={18} />}
              placeholder="Enter last name"
              error={errors.lastName?.message}
              {...register('lastName', { 
                required: 'Last name is required',
                minLength: {
                  value: 2,
                  message: 'Last name must be at least 2 characters'
                },
                pattern: {
                  value: /^[A-Za-z\s]+$/,
                  message: 'Last name can only contain letters'
                }
              })}
            />
          </div>
          
          <Input
            label="Email"
            type="email"
            icon={<Mail size={18} />}
            placeholder="example@email.com"
            error={errors.email?.message}
            {...register('email', { 
              required: 'Email is required',
              validate: (value) => {
                if (!value.includes('@')) {
                  return 'Email must contain @';
                }
                
                const [localPart, domain] = value.split('@');
                if (!domain) {
                  return 'Invalid email format';
                }
                
                if (!domain.toLowerCase().endsWith('.com')) {
                  return 'Email must end with .com';
                }
                
                return true;
              }
            })}
          />
          
          <Input
            label="Location"
            icon={<MapPin size={18} />}
            placeholder="Enter your location"
            error={errors.location?.message}
            {...register('location', { 
              required: 'Location is required',
              minLength: {
                value: 3,
                message: 'Location must be at least 3 characters'
              }
            })}
          />
          
          <Input
            label="Contact Number"
            type="tel"
            icon={<Phone size={18} />}
            placeholder="09XX XXX XXXX"
            error={errors.contact?.message}
            {...register('contact', { 
              required: 'Contact number is required',
              pattern: {
                value: /^09[0-9]{9}$/,
                message: 'Please enter a valid Philippines phone number (09XXXXXXXXX)'
              },
              validate: (value) => {
                if (!value.startsWith('09')) {
                  return 'Phone number must start with 09';
                }
                return true;
              }
            })}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Gender"
              icon={<Users size={18} />}
              options={[
                { value: 'Male', label: 'Male' },
                { value: 'Female', label: 'Female' },
                { value: 'Other', label: 'Other' }
              ]}
              error={errors.gender?.message}
              {...register('gender', { required: 'Gender is required' })}
            />
            
            <Input
              label="Age"
              type="number"
              icon={<Hash size={18} />}
              placeholder="Enter your age"
              min={18}
              error={errors.age?.message}
              {...register('age', { 
                required: 'Age is required',
                min: {
                  value: 18,
                  message: 'You must be at least 18 years old'
                },
                max: {
                  value: 100,
                  message: 'Please enter a valid age'
                }
              })}
            />
          </div>
          
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              icon={<Lock size={18} />}
              placeholder="Create password (min. 8 characters)"
              error={errors.password?.message}
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                pattern: {
                  value: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
                  message: 'Password must contain at least one letter, one number, and one special character'
                }
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
          
          <div className="relative">
            <Input
              label="Confirm Password"
              type={showConfirmPassword ? 'text' : 'password'}
              icon={<Lock size={18} />}
              placeholder="Confirm your password"
              error={errors.confirmPassword?.message}
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: (value) => value === password || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              className="absolute right-3 top-[38px] text-gray-400 hover:text-gray-600"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          <Button 
            type="submit"
            fullWidth
            isLoading={isLoading}
            className="mt-6"
          >
            Create Account
          </Button>
        </form>
      </motion.div>
    </div>
  );
};

export default Signup;