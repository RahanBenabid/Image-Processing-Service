import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useImage } from '../context/ImageContext';
import TransformationHistory from '../components/TransformationHistory';

const Transformations = () => {
  const { isAuthenticated } = useAuth();
  const { userImages, getUserImages, isLoading } = useImage();
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      getUserImages();
    }
  }, [isAuthenticated, getUserImages]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Transformation History</h1>
      
      {userImages && userImages.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-md p-4">
              <h2 className="text-lg font-semibold mb-4 text-gray-700">Your Images</h2>
              
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {userImages.map((image) => (
                  <div 
                    key={image._id}
                    onClick={() => setSelectedImage(image)}
                    className={`
                      flex items-center p-2 rounded-md cursor-pointer transition
                      ${selectedImage && selectedImage._id === image._id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'}
                    `}
                  >
                    <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                      {image.url && (
                        <img 
                          src={image.url} 
                          alt={image.metadata?.fileName || 'Image'} 
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="ml-3 overflow-hidden">
                      <p className="font-medium text-gray-800 truncate">
                        {image.metadata?.fileName || 'Untitled Image'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(image.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-8">
            {selectedImage ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex flex-col md:flex-row items-start gap-6 mb-6">
                  <div className="w-full md:w-1/3 flex-shrink-0">
                    <div className="rounded-md overflow-hidden bg-gray-100">
                      <img 
                        src={selectedImage.url} 
                        alt={selectedImage.metadata?.fileName || 'Selected Image'}
                        className="w-full h-auto object-contain"
                      />
                    </div>
                    <div className="mt-3">
                      <h3 className="font-medium">{selectedImage.metadata?.fileName || 'Untitled Image'}</h3>
                      <p className="text-sm text-gray-500">
                        {selectedImage.metadata?.width} × {selectedImage.metadata?.height} pixels
                      </p>
                      <p className="text-sm text-gray-500">
                        {selectedImage.metadata?.format?.toUpperCase() || 'Unknown format'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-2/3">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Transformation History</h2>
                    {selectedImage.transformations && selectedImage.transformations.length > 0 ? (
                      <TransformationHistory imageId={selectedImage._id} />
                    ) : (
                      <p className="text-gray-500 italic">No transformations applied to this image yet.</p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-gray-500">Select an image to view its transformation history</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">You don't have any images yet</p>
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            onClick={() => window.location.href = '/dashboard'}
          >
            Upload an Image
          </button>
        </div>
      )}
    </div>
  );
};

export default Transformations;