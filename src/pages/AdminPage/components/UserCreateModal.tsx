import React, { useState } from 'react';
import { MdClose } from 'react-icons/md';
import { RoleType } from '../../../types/user';
import { api } from '../../../api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';



const initialFormData = {
  username: '',
  account: '',
  password: '',
  role: 'user' as RoleType, // 設定預設角色
  email: ''
};


interface UserCreateModalProps {
  onClose: () => void;
}

export const UserCreateModal: React.FC<UserCreateModalProps> = ({
  onClose,
}) => {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState<Partial<typeof initialFormData>>({});

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.username) newErrors.username = 'Username is required';
    if (!formData.account) newErrors.account = 'Account is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!isValidEmail(formData.email)) newErrors.email = 'Invalid email format';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await api.post('/user/signup', formData);
      } catch (err) {
        console.log(err)
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            {'Create New User'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username Input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className={`w-full h-8 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.username ? 'border-red-500' : ''
                }`}
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account
            </label>
            <input
              type="text"
              value={formData.account}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                account: e.target.value
              }))}
              className={`w-full h-8 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.account ? 'border-red-500' : ''
                }`}
            />
            {errors.account && (
              <p className="mt-1 text-sm text-red-500">{errors.account}</p>
            )}
          </div>
          <div className="mb-4">
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                 type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                className={`w-full  h-8  px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? 'border-red-500' : ''
                  }`}
              />
          
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pt-7 text-lg">
                {showPassword ? (
                  <FaEyeSlash onClick={()=>setShowPassword(pre=>!pre)} className="text-gray-500 cursor-pointer " />
                ) : (
                  <FaEye onClick={()=>setShowPassword(pre=>!pre)} className="text-gray-500 cursor-pointer" />
                )}
              </div>
           
            </div>
               {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>
        

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                email: e.target.value
              }))}
              className={`w-full  h-8  px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : ''
                }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                role: e.target.value as RoleType
              }))}
              className="w-full  px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              {'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};