import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useImage } from '../context/ImageContext';
import transformationService from '../services/transformService';

const TransformationHistory = ({ imageId }) => {
  const [transformations, setTransformations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useAuth();
  const { applyTransformation } = useImage();

  useEffect(() => {
    if (imageId) {
      fetchTransformationHistory();
    }
  }, [imageId]);

  const fetchTransformationHistory = async () => {
    if (!currentUser || !imageId) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const history = await transformationService.getTransformationHistory(imageId);
      setTransformations(history);
    } catch (err) {
      setError('Failed to load transformation history');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReapplyTransformation = async (transformation) => {
    try {
      await applyTransformation(imageId, transformation.type, transformation.parameters);
    } catch (err) {
      console.error('Failed to reapply transformation:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!transformations.length) {
    return (
      <div className="text-gray-500 text-center py-4">
        No transformation history available for this image.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-800">Transformation History</h3>
      </div>
      
      <ul className="divide-y divide-gray-200">
        {transformations.map((transformation, index) => (
          <li key={transformation._id || index} className="px-4 py-3 hover:bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium text-gray-800 capitalize">
                  {transformation.type}
                </span>
                <p className="text-sm text-gray-500 mt-1">
                  {renderTransformationParams(transformation.parameters)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(transformation.createdAt).toLocaleString()}
                </p>
              </div>
              
              <button
                onClick={() => handleReapplyTransformation(transformation)}
                className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm"
              >
                Reapply
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const renderTransformationParams = (parameters) => {
  if (!parameters || Object.keys(parameters).length === 0) {
    return 'No parameters';
  }
  
  return Object.entries(parameters).map(([key, value]) => {
    let displayValue = value;
    
    if (typeof value === 'number') {
      displayValue = Number.isInteger(value) ? value : value.toFixed(2);
    } else if (typeof value === 'boolean') {
      displayValue = value ? 'Yes' : 'No';
    } else if (typeof value === 'object' && value !== null) {
      displayValue = JSON.stringify(value);
    }
    
    return `${key}: ${displayValue}`;
  }).join(', ');
};

export default TransformationHistory;