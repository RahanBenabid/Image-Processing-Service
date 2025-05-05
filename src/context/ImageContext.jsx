import { createContext, useContext, useState, useEffect } from 'react';
import imageService from '../services/imageService';
import transformationService from '../services/transformService';
import { useAuth } from './AuthContext';

const ImageContext = createContext();
export const useImage = () => {
  const context = useContext(ImageContext);
  if (!context) {
    throw new Error('useImage must be used within an ImageProvider');
  }
  return context;
};

export const ImageProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(null);
  const [transformationHistory, setTransformationHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUserImages();
    }
  }, [isAuthenticated]);

  const fetchUserImages = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageService.getAllImages();
      setImages(response);
    } catch (err) {
      setError(err.message || 'Failed to fetch images');
    } finally {
      setLoading(false);
    }
  };

  const getImageById = async (imageId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageService.getImageById(imageId);
      return response.picture;
    } catch (err) {
      setError(err.message || 'Failed to fetch image');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const selectImage = async (imageId) => {
    try {
      const imageData = await getImageById(imageId);
      setCurrentImage(imageData);
      if (imageData.transformations && imageData.transformations.length > 0) {
        setTransformationHistory(imageData.transformations);
      } else {
        setTransformationHistory([]);
      }
    } catch (err) {
      console.error('Error selecting image:', err);
    }
  };

  const clearSelection = () => {
    setCurrentImage(null);
    setTransformationHistory([]);
  };

  const uploadImage = async (fileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageService.uploadImage(fileData);
      setImages(prev => [...prev, ...response.uploadedFiles]);
      return response.uploadedFiles;
    } catch (err) {
      setError(err.message || 'Failed to upload image');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const uploadImages = async (filesArray) => {
    setLoading(true);
    setError(null);
    try {
      const response = await imageService.uploadImages(filesArray);
      setImages(prev => [...prev, ...response.uploadedFiles]);
      return response.uploadedFiles;
    } catch (err) {
      setError(err.message || 'Failed to upload images');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteImage = async (imageId) => {
    setLoading(true);
    setError(null);
    try {
      await imageService.deleteImage(imageId);
      setImages(prev => prev.filter(img => img._id !== imageId));
      
      if (currentImage && currentImage._id === imageId) {
        clearSelection();
      }
    } catch (err) {
      setError(err.message || 'Failed to delete image');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const applyTransformation = async (transformationOptions) => {
    if (!currentImage) {
      setError('No image selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await transformationService.applyAdvancedTransformations(
        currentImage._id, 
        transformationOptions
      );
      
      const newTransformation = {
        params: transformationOptions,
        url: response.url || currentImage.url,
        timestamp: new Date().toISOString()
      };
      
      setTransformationHistory(prev => [...prev, newTransformation]);
      
      setCurrentImage(prev => ({
        ...prev,
        url: response.url || prev.url,
        transformations: [...(prev.transformations || []), newTransformation]
      }));
      
      return newTransformation;
    } catch (err) {
      setError(err.message || 'Failed to apply transformation');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const resizeImage = async (width, height) => {
    if (!currentImage) {
      setError('No image selected');
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const response = await transformationService.resizeImage(
        currentImage._id,
        width,
        height
      );
      
      const newTransformation = {
        params: { resize: { width, height } },
        url: response.url || currentImage.url,
        timestamp: new Date().toISOString()
      };
      
      setTransformationHistory(prev => [...prev, newTransformation]);
      
      setCurrentImage(prev => ({
        ...prev,
        url: response.url || prev.url,
        transformations: [...(prev.transformations || []), newTransformation]
      }));
      
      return newTransformation;
    } catch (err) {
      setError(err.message || 'Failed to resize image');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const saveTransformedImage = async (saveOptions) => {
    if (!currentImage) {
      setError("No image selected to save");
      return null;
    }

    setLoading(true);
    try {
      const { filename = `transformed_${Date.now()}`, format = 'jpeg', quality = 85 } = saveOptions || {};

      const saveData = {
        imageId: currentImage._id,
        transformations: transformationHistory,
        saveOptions: {
          filename,
          format,
          quality: parseInt(quality)
        }
      };

      const savedImage = await imageService.saveTransformedImage(saveData);

      setImages(prevImages => {
        const existingIndex = prevImages.findIndex(img => img._id === savedImage._id);
        if (existingIndex >= 0) {
          const updatedImages = [...prevImages];
          updatedImages[existingIndex] = savedImage;
          return updatedImages;
        }
        return [...prevImages, savedImage];
      });

      setSuccess(`Image saved successfully as ${savedImage.filename || filename}`);
      return savedImage;
    } catch (err) {
      setError(`Failed to save image: ${err.message || 'Unknown error'}`);
      console.error("Error saving transformed image:", err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    images,
    currentImage,
    transformationHistory,
    loading,
    error,
    success,
    setSuccess,
    fetchUserImages,
    getUserImages: fetchUserImages,
    getImageById,
    selectImage,
    clearSelection,
    uploadImage,
    uploadImages,
    deleteImage,
    applyTransformation,
    resizeImage,
    saveTransformedImage
  };

  return (
    <ImageContext.Provider value={value}>
      {children}
    </ImageContext.Provider>
  );
};

export default ImageContext;
