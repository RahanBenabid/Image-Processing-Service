import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ProfileSettings from '../components/auth/ProfileSettings';
import {userService} from '../services/userService';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser, isLoading } = useAuth();
  const [userInfo, setInfo] = useState({'user': {}}); 
  const navigate = useNavigate();
  
  useEffect(() => {
  
  async function fetchUser() {
    try {
      if (currentUser) {
        const user = await userService.getUser(currentUser.id);
        setInfo(user.user); 
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  }
  fetchUser(); 
  
},[currentUser]);
console.log('userrr shit : ', userInfo._id, userInfo.username, userInfo.email)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-n-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }
  const handleLogout = ()=>{
    userService.logout();
    navigate('/');
  }
  return (
    <div className="min-h-screen bg-n-8 text-n-1 pt-20 pb-12 px-4 sm:px-6 lg:px-8 mt-2">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400 mb-2">
            User Profile
          </h1>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>
        
        {currentUser ? (
          <div className="bg-n-7 rounded-xl shadow-lg overflow-hidden border border-n-6">
            <div className="p-8">
              <div className="mb-10">
                <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  Account Information
                </h2>
                <button
              onClick={handleLogout}
              className="bg-n-6 mb-2 rounded-lg px-4 py-2 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 border border-n-5 flex items-center gap-2"
            >
              <span className='bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-400'>Logout</span>
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </button>
            </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-n-6 rounded-lg p-5 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 border border-n-5">
                    <p className="text-sm text-n-3 mb-1">Username</p>
                    <p className="font-medium text-lg">{userInfo.username}</p>
                  </div>
                  <div className="bg-n-6 rounded-lg p-5 hover:shadow-purple-500/20 hover:-translate-y-1 transition-all duration-300 border border-n-5">
                    <p className="text-sm text-n-3 mb-1">Email</p>
                    <p className="font-medium text-lg">{userInfo.email}</p>
                  </div>
                </div>
              </div>
              
              <div className="mb-10">
                <h2 className="text-2xl font-semibold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
                  Account Statistics
                </h2>
                <div className="bg-gradient-to-br from-n-6 to-n-7 p-6 rounded-xl border border-n-5">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-n-3">Storage Used</span>
                    <span className="font-medium text-lg bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                      {currentUser.storageUsed || '0'} MB
                    </span>
                  </div>
                  <div className="w-full bg-n-6 rounded-full h-2.5 mt-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${Math.min((currentUser.storageUsed || 0)/1000 * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-n-4 mt-2">500 MB of 1 GB used</p>
                </div>
              </div>
              
              <div className="border-t border-n-6 pt-8">
                <ProfileSettings user={userInfo}/>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-900/30 border-l-4 border-yellow-500 p-4 rounded-lg">
            <p className="text-yellow-300 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Please log in to view your profile.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;