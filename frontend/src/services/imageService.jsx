import api from './api';

const imageService = {
  getAllImages: async () => {
    try {
      return await api.get('/api/pictures');
    } catch (error) {
      console.error('Error fetching images:', error.message);
      throw new Error(error.message || 'Failed to fetch images');
    }
  },

  getImageById: async (imageId) => {
    try {
      return await api.get(`/api/pictures/${imageId}`);
    } catch (error) {
      console.error('Error fetching image:', error);
      throw new Error(error.message || 'Failed to fetch image');
    }
  },

  uploadImage: async (fileData) => {
    try {
      const formData = new FormData();
      formData.append('picture', fileData);
      
      console.log('Form data entries:', Array.from(formData.entries()));
      
      return await api.upload('/api/pictures/upload', formData);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  uploadImages: async (filesArray) => {
    try {
      const formData = new FormData();
      
      filesArray.forEach((file, index) => {
        formData.append('picture', file);
      });
      
      return await api.upload('/api/pictures/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', 
        }});
    } catch (error) {
      console.error('Error uploading images:', error);
      throw new Error(error.message || 'Failed to upload images');
    }
  },

  updateImage: async (imageId, fileData) => {
    try {
      const formData = new FormData();
      formData.append('picture', fileData);
      
      return await api.upload(`/api/pictures/${imageId}`, formData, 'PUT');
    } catch (error) {
      console.error('Error updating image:', error);
      throw new Error(error.message || 'Failed to update image');
    }
  },

  deleteImage: async (imageId) => {
    try {
      return await api.delete(`/api/pictures/${imageId}`);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error(error.message || 'Failed to delete image');
    }
  },

  getPublicUrl: async (imageId) => {
    try {
      return await api.get(`/api/pictures/getPublicUrl/${imageId}`);
    } catch (error) {
      console.error('Error getting public URL:', error);
      throw new Error(error.message || 'Failed to get image URL');
    }
  }
};

export default imageService;