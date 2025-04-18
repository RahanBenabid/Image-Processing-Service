import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import imageService from '../services/imageService';
import ImageTransform from '../components/ImageTransform';
import { ArrowLeft, Download, RefreshCw } from 'lucide-react';
import bgImage from '../assets/sign_inout/bg1.png';

const ImageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        setLoading(true);
        const data = await imageService.getPictureById(id);
        setImage(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch image:', err);
        setError('Failed to load image. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [id]);

  const handleTransformComplete = async () => {
    try {
      const data = await imageService.getPictureById(id);
      setImage(data);
    } catch (err) {
      console.error('Failed to refresh image:', err);
    }
  };

  const handleDownload = () => {
    if (!image?.url) return;
    
    const link = document.createElement('a');
    link.href = image.url;
    link.download = image.name || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen -m-2 text-white bg-cover" style={{ backgroundImage: `url(${bgImage})` }}>
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-200"
          >
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
          
          {image && (
            <div className="flex space-x-2">
              <button 
                onClick={handleDownload}
                className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-200"
              >
                <Download size={16} />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 bg-opacity-30 border border-red-800 text-red-200 p-6 rounded-xl">
            <h3 className="font-semibold text-lg mb-2">Error</h3>
            <p>{error}</p>
          </div>
        ) : !image ? (
          <div className="bg-gray-800 bg-opacity-50 rounded-xl p-10 text-center">
            <h3 className="text-xl font-medium mb-2">Image not found</h3>
            <p className="text-gray-400 mb-6">The image you're looking for doesn't exist or was deleted</p>
            <button 
              onClick={() => navigate(-1)}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-all duration-300"
            >
              Return to Dashboard
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
             <div className="lg:col-span-2">
              <div className="bg-gray-800 bg-opacity-70 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                  <h2 className="font-semibold">Image Preview</h2>
                  <button 
                    onClick={handleTransformComplete}
                    className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <RefreshCw size={14} />
                    <span className="text-sm">Refresh</span>
                  </button>
                </div>
                <div className="p-6 flex justify-center">
                  <img 
                    src={`${image.url}?t=${new Date().getTime()}`} 
                    alt={image.name || 'Image preview'} 
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>
                <div className="p-4 border-t border-gray-700">
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-400">
                    <div>
                      <span className="block">Name: </span>
                      <span className="font-medium text-white">{image.name || 'Untitled'}</span>
                    </div>
                    {image.size && (
                      <div>
                        <span className="block">Size: </span>
                        <span className="font-medium text-white">
                          {(image.size / 1024).toFixed(2)} KB
                        </span>
                      </div>
                    )}
                    {image.dimensions && (
                      <div>
                        <span className="block">Dimensions: </span>
                        <span className="font-medium text-white">
                          {image.dimensions.width} × {image.dimensions.height}
                        </span>
                      </div>
                    )}
                    {image.format && (
                      <div>
                        <span className="block">Format: </span>
                        <span className="font-medium text-white">
                          {image.format.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <ImageTransform 
                imageId={id} 
                onTransformComplete={handleTransformComplete} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageEditor;