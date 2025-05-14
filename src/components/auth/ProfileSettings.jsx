import React, { useEffect, useState } from 'react';
import {userService} from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings = ({user}) => {

  const { currentUser, updateProfile } = useAuth();
 
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    newPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData(prevData => ({
        ...prevData,
        username: user.username || '',
        email: user.email || ''
      }));
    }
  }, [user]);
   console.log('FormData:', formData);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleDeleteAccount = async ()=>{
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await userService.deleteUser(user._id);
        setSuccess('Account deleted successfully!');
        setError(''); 
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } catch (err){
        setError(err.message);
        setSuccess('');
        console.error(err.message);
      }
  }}

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user._id, formData);
      setSuccess('Profile updated successfully!');
      setError('');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message);
      setSuccess('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
          Profile Settings
        </h3>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
            isEditing 
              ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {error && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 rounded-lg">
          <p className="text-red-300">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border-l-4 border-green-500 p-4 rounded-lg">
          <p className="text-green-300">{success}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="relative group">
            <label className="block text-sm text-n-3 mb-2">Username</label>
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full bg-n-6 border ${
                  isEditing 
                    ? 'border-blue-500/50 hover:border-blue-500 focus:border-blue-500'
                    : 'border-n-5'
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300`}
              />
              <div className={`absolute inset-0 rounded-lg pointer-events-none ${
                isEditing ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : ''
              }`}></div>
            </div>
          </div>

          <div className="relative group">
            <label className="block text-sm text-n-3 mb-2">Email</label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={!isEditing}
                className={`w-full bg-n-6 border ${
                  isEditing 
                    ? 'border-blue-500/50 hover:border-blue-500 focus:border-blue-500'
                    : 'border-n-5'
                } rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300`}
              />
              <div className={`absolute inset-0 rounded-lg pointer-events-none ${
                isEditing ? 'bg-gradient-to-r from-blue-500/10 to-purple-500/10' : ''
              }`}></div>
            </div>
          </div>
        </div>

        {isEditing && (
          <>
            <div className="relative group">
              <label className="block text-sm text-n-3 mb-2">Current Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-n-6 border border-blue-500/50 hover:border-blue-500 focus:border-blue-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              </div>
            </div>

            <div className="relative group">
              <label className="block text-sm text-n-3 mb-2">New Password</label>
              <div className="relative">
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-n-6 border border-blue-500/50 hover:border-blue-500 focus:border-blue-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-300"
                />
                <div className="absolute inset-0 rounded-lg pointer-events-none bg-gradient-to-r from-blue-500/10 to-purple-500/10"></div>
              </div>
              <p className="mt-1 text-xs text-n-4">Leave blank to keep current password</p>
            </div>
            <div className='flex  items-center pt-6 border-t border-n-6'>
             <button
              type="button"
              onClick={handleDeleteAccount}
              className="px-6 py-3 mr-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20" >
              Delete Account
            </button>
            <button
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-purple-500/20"
            >
              Save Changes
            </button>
            </div>
          </>
        )}
        
      </form>
    </div>
  );
};

export default ProfileSettings;