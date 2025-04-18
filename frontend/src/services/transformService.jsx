import api from './api';

const transformationService = {
  async applyTransformation(imageId, transformationType, params) {
    try {
      const backendTransformations = this.mapToBackendFormat(transformationType, params);
      
      return await api.post(`/api/pictures/${imageId}/transform`, backendTransformations);
    } catch (error) {
      console.error('Transformation error:', error);
      throw new Error(error.response?.data?.message || 'Transformation failed');
    }
  },

  mapToBackendFormat(type, params) {
    const transformations = [];
    
    switch(type) {
      case 'resize':
        transformations.push({
          resize: {
            width: params.width,
            height: params.height
          }
        });
        break;

      case 'crop':
        transformations.push({
          crop: {
            x: params.x,
            y: params.y,
            width: params.width,
            height: params.height
          }
        });
        break;

      case 'rotate':
        transformations.push({
          rotate: params.degrees
        });
        break;

      case 'flip':
        transformations.push({
          transpose: params.direction === 'horizontal' ? 'Horizontal' : 
                    params.direction === 'vertical' ? 'Vertical' : 'Both'
        });
        break;

      case 'filter':
        transformations.push({
          filters: {
            black_and_white: params.filter === 'grayscale',
            sharpen: params.filter === 'sharpen',
            thumbnail: params.filter === 'thumbnail'
          }
        });
        break;

      case 'convert':
        transformations.push({
          format: params.format.toUpperCase() 
        });
        break;

      case 'compress':
        transformations.push({
          compress: true,
          // quality: params.quality 
        });
        break;

      case 'watermark':
        
        throw new Error('Watermark not yet implemented');
    }

    return transformations;
  },

  async resize(imageId, width, height) {
    return this.applyTransformation(imageId, 'resize', { width, height });
  },

  async rotate(imageId, degrees) {
    if (![90, 180, 270].includes(degrees)) {
      throw new Error('Invalid rotation angle');
    }
    return this.applyTransformation(imageId, 'rotate', { degrees });
  }
};

export default transformationService;