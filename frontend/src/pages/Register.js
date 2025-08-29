import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { 
  MdEmail, 
  MdLock, 
  MdPerson, 
  MdDirectionsBoat,
  MdInventory,
  MdGroup,
  MdCheckCircle,
  MdPersonAdd,
  MdRefresh
} from 'react-icons/md';

const Register = () => {
  const [loading, setLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const vesselTypes = [
    { value: 'cargo', label: 'Cargo' },
    { value: 'fishing', label: 'Fishing' },
    { value: 'pleasure', label: 'Pleasure' },
    { value: 'tanker', label: 'Tanker' },
    { value: 'passenger', label: 'Passenger' },
    { value: 'other', label: 'Other' }
  ];

  const roles = [
    { value: 'sailor', label: 'Sailor' },
    { value: 'captain', label: 'Captain' },
    { value: 'admin', label: 'Admin' }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerUser(data);
      toast.success('Registration successful!');
      navigate('/login');
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Static background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Static ship icons */}
        <div className="absolute top-32 left-1/3 opacity-10 transform rotate-12">
          <MdDirectionsBoat className="w-16 h-16 text-blue-600" />
        </div>
        
        <div className="absolute bottom-32 right-1/4 opacity-10 transform -rotate-12">
          <MdDirectionsBoat className="w-12 h-12 text-cyan-600" />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-24 w-24 bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-transform duration-300">
              <MdPersonAdd className="h-12 w-12 text-white" />
            </div>
            <h2 className="mt-8 text-4xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
              Create Your Account
            </h2>
            <p className="mt-3 text-lg text-gray-600">
              Join EcoNav MPA for safe maritime navigation
            </p>
            <div className="mt-4 flex items-center justify-center space-x-2">
              <div className="w-8 h-0.5 bg-gradient-to-r from-transparent to-blue-400"></div>
              <span className="text-blue-500 text-sm font-medium">Maritime Navigation</span>
              <div className="w-8 h-0.5 bg-gradient-to-l from-transparent to-cyan-400"></div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPerson className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="name"
                      type="text"
                      {...register('name', { required: 'Name is required' })}
                      className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.name ? 'border-red-400 ring-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.name && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdEmail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                      className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.email ? 'border-red-400 ring-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      type="password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                      className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.password ? 'border-red-400 ring-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Create a password"
                    />
                  </div>
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.password.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdCheckCircle className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="confirmPassword"
                      type="password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: (val) => {
                          if (watch('password') !== val) {
                            return "Passwords don't match";
                          }
                        }
                      })}
                      className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.confirmPassword ? 'border-red-400 ring-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Confirm your password"
                    />
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Vessel Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <label htmlFor="vesselName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Vessel Name *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdDirectionsBoat className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="vesselName"
                      type="text"
                      {...register('vesselName', { required: 'Vessel name is required' })}
                      className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.vesselName ? 'border-red-400 ring-red-400' : 'border-gray-200'
                      }`}
                      placeholder="Enter vessel name"
                    />
                  </div>
                  {errors.vesselName && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.vesselName.message}
                    </p>
                  )}
                </div>

                <div className="relative">
                  <label htmlFor="vesselType" className="block text-sm font-semibold text-gray-700 mb-2">
                    Vessel Type *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdInventory className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="vesselType"
                      {...register('vesselType', { required: 'Vessel type is required' })}
                      className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                        errors.vesselType ? 'border-red-400 ring-red-400' : 'border-gray-200'
                      }`}
                    >
                      <option value="">Select vessel type</option>
                      {vesselTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.vesselType && (
                    <p className="mt-2 text-sm text-red-600 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.vesselType.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="relative">
                <label htmlFor="role" className="block text-sm font-semibold text-gray-700 mb-2">
                  Role *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MdGroup className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="role"
                    {...register('role', { required: 'Role is required' })}
                    className={`block w-full pl-10 pr-4 py-3 border-2 rounded-xl shadow-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                      errors.role ? 'border-red-400 ring-red-400' : 'border-gray-200'
                    }`}
                  >
                    <option value="">Select your role</option>
                    {roles.map(role => (
                      <option key={role.value} value={role.value}>
                        {role.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.role && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors.role.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-48 flex justify-center py-3 px-6 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-navy-800 via-navy-900 to-blue-900 hover:from-navy-900 hover:via-blue-900 hover:to-navy-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 mx-auto"
                >
                  {loading ? (
                    <div className="flex items-center">
                      <MdRefresh className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                      Registering...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <MdPersonAdd className="w-4 h-4 mr-2" />
                      Register
                    </div>
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-500 transition-colors duration-200 hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
