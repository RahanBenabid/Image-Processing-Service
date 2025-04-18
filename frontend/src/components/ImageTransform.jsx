import React, { useState } from 'react';
import transformService from '../services/transformService';
import { Sliders, Crop, RotateCw, RefreshCw, FileImage, Image, Palette, Type } from 'lucide-react';

const ImageTransform = ({ imageId, onTransformComplete }) => {
  const [activeTab, setActiveTab] = useState('resize');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  const [transformParams, setTransformParams] = useState({
    resize: { width: 800, height: 600, maintainAspectRatio: true },
    crop: { x: 0, y: 0, width: 500, height: 500 },
    rotate: { degrees: 90 },
    flip: { direction: 'horizontal' },
    filter: { filter: 'grayscale' },
    compress: { quality: 80 },
    convert: { format: 'webp' },
    watermark: { text: 'Watermark', position: 'bottom-right' }
  });

  const handleTransform = async (transformationType) => {
    setIsProcessing(true);
    setError(null);
    setSuccess(null);
    
    try {
      await transformService.applyTransformation(
        imageId, 
        transformationType, 
        transformParams[transformationType]
      );
      setSuccess(`${transformationType} applied successfully!`);
      if (onTransformComplete) onTransformComplete();
    } catch (err) {
      setError(err.message || `Failed to apply ${transformationType}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const updateParams = (type, key, value) => {
    setTransformParams(prev => ({
      ...prev,
      [type]: { ...prev[type], [key]: value }
    }));
  };

  const renderTabContent = () => {
    const params = transformParams[activeTab];
    const icons = {
      resize: <Sliders size={18} className="text-blue-400" />,
      crop: <Crop size={18} className="text-purple-400" />,
      rotate: <RotateCw size={18} className="text-pink-400" />,
      flip: <RefreshCw size={18} className="text-green-400" />,
      filter: <Palette size={18} className="text-yellow-400" />,
      compress: <FileImage size={18} className="text-red-400" />,
      convert: <Image size={18} className="text-indigo-400" />,
      watermark: <Type size={18} className="text-teal-400" />
    };

    const tabConfig = {
      resize: {
        inputs: [
          { 
            label: 'Width (px)', 
            type: 'number', 
            value: params.width, 
            onChange: (e) => updateParams('resize', 'width', parseInt(e.target.value)) 
          },
          { 
            label: 'Height (px)', 
            type: 'number', 
            value: params.height, 
            onChange: (e) => updateParams('resize', 'height', parseInt(e.target.value)) 
          },
          { 
            label: 'Maintain aspect ratio', 
            type: 'checkbox', 
            checked: params.maintainAspectRatio, 
            onChange: (e) => updateParams('resize', 'maintainAspectRatio', e.target.checked) 
          }
        ]
      },
      crop: {
        inputs: [
          { label: 'X Position', type: 'number', value: params.x, onChange: (e) => updateParams('crop', 'x', parseInt(e.target.value)) },
          { label: 'Y Position', type: 'number', value: params.y, onChange: (e) => updateParams('crop', 'y', parseInt(e.target.value)) },
          { label: 'Width', type: 'number', value: params.width, onChange: (e) => updateParams('crop', 'width', parseInt(e.target.value)) },
          { label: 'Height', type: 'number', value: params.height, onChange: (e) => updateParams('crop', 'height', parseInt(e.target.value)) }
        ]
      },
      rotate: {
        options: [90, 180, 270].map(deg => ({
          label: `${deg}°`,
          active: params.degrees === deg,
          onClick: () => updateParams('rotate', 'degrees', deg)
        }))
      },
      flip: {
        options: [
          { 
            label: 'Horizontal', 
            icon: <RefreshCw size={20} className="rotate-90" />,
            active: params.direction === 'horizontal',
            onClick: () => updateParams('flip', 'direction', 'horizontal')
          },
          { 
            label: 'Vertical', 
            icon: <RefreshCw size={20} />,
            active: params.direction === 'vertical',
            onClick: () => updateParams('flip', 'direction', 'vertical')
          }
        ]
      },
      filter: {
        options: ['grayscale', 'sepia', 'blur', 'sharpen', 'negative', 'brightness', 'contrast'].map(filter => ({
          label: filter,
          active: params.filter === filter,
          onClick: () => updateParams('filter', 'filter', filter)
        }))
      },
      compress: {
        inputs: [
          { 
            label: `Quality: ${params.quality}%`, 
            type: 'range', 
            min: 10, 
            max: 100, 
            value: params.quality, 
            onChange: (e) => updateParams('compress', 'quality', parseInt(e.target.value)) 
          }
        ]
      },
      convert: {
        options: ['jpg', 'png', 'webp', 'gif'].map(format => ({
          label: format.toUpperCase(),
          active: params.format === format,
          onClick: () => updateParams('convert', 'format', format)
        }))
      },
      watermark: {
        inputs: [
          { 
            label: 'Watermark Text', 
            type: 'text', 
            value: params.text, 
            onChange: (e) => updateParams('watermark', 'text', e.target.value) 
          },
          { 
            label: 'Position', 
            type: 'select', 
            value: params.position, 
            options: ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'],
            onChange: (e) => updateParams('watermark', 'position', e.target.value) 
          }
        ]
      }
    };

    return (
      <div className="p-6 bg-n-7 rounded-b-xl border-t border-n-6">
        <div className="flex items-center mb-6">
          {icons[activeTab]}
          <h3 className="text-xl font-semibold ml-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Settings
          </h3>
        </div>

        <div className="space-y-6">
          {tabConfig[activeTab].inputs?.map((input, index) => (
            <div key={index} className="space-y-2">
              <label className="block text-sm text-n-3">{input.label}</label>
              {input.type === 'checkbox' ? (
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={input.checked}
                    onChange={input.onChange}
                    className="form-checkbox h-5 w-5 text-blue-500 rounded border-n-5 bg-n-6 focus:ring-blue-500"
                  />
                  <span className="text-n-2">{input.label}</span>
                </label>
              ) : input.type === 'select' ? (
                <select
                  value={input.value}
                  onChange={input.onChange}
                  className="w-full bg-n-6 border border-n-5 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                >
                  {input.options.map(option => (
                    <option key={option} value={option}>
                      {option.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              ) : input.type === 'range' ? (
                <>
                  <input
                    type="range"
                    min={input.min}
                    max={input.max}
                    value={input.value}
                    onChange={input.onChange}
                    className="w-full h-2 bg-n-6 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-600"
                  />
                </>
              ) : (
                <input
                  type={input.type}
                  value={input.value}
                  onChange={input.onChange}
                  className="w-full bg-n-6 border border-n-5 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300"
                />
              )}
            </div>
          ))}

          {tabConfig[activeTab].options && (
            <div className={`grid gap-3 ${
              activeTab === 'rotate' ? 'grid-cols-3' : 
              activeTab === 'flip' ? 'grid-cols-2' : 
              'grid-cols-2 sm:grid-cols-3 md:grid-cols-4'
            }`}>
              {tabConfig[activeTab].options.map((option, index) => (
                <button
                  key={index}
                  onClick={option.onClick}
                  className={`py-3 px-4 rounded-lg border flex flex-col items-center justify-center transition-all duration-300 ${
                    option.active
                      ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50 shadow-lg shadow-blue-500/10'
                      : 'bg-n-6 border-n-5 hover:bg-n-5'
                  }`}
                >
                  {option.icon && <span className="mb-2">{option.icon}</span>}
                  <span className={`font-medium ${
                    option.active ? 'text-blue-400' : 'text-n-2'
                  }`}>{option.label}</span>
                </button>
              ))}
            </div>
          )}

          <button
            onClick={() => handleTransform(activeTab)}
            disabled={isProcessing}
            className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
              isProcessing
                ? 'bg-n-6 text-n-3 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/20'
            }`}
          >
            {isProcessing ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              `Apply ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
            )}
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-n-8 rounded-xl overflow-hidden border border-n-6">
      {error && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4">
          <p className="text-red-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </p>
        </div>
      )}

      {success && (
        <div className="bg-green-900/30 border-l-4 border-green-500 p-4">
          <p className="text-green-300 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            {success}
          </p>
        </div>
      )}

      <div className="grid grid-cols-4 md:grid-cols-8 gap-1 bg-n-7 p-1">
        {['resize', 'crop', 'rotate', 'flip', 'filter', 'compress', 'convert', 'watermark'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`py-3 flex flex-col items-center justify-center text-xs rounded-lg transition-all duration-300 ${
              activeTab === tab
                ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 text-blue-400 shadow-inner'
                : 'text-n-3 hover:text-n-1 hover:bg-n-6'
            }`}
          >
            {{
              resize: <Sliders size={16} className="mb-1" />,
              crop: <Crop size={16} className="mb-1" />,
              rotate: <RotateCw size={16} className="mb-1" />,
              flip: <RefreshCw size={16} className="mb-1" />,
              filter: <Palette size={16} className="mb-1" />,
              compress: <FileImage size={16} className="mb-1" />,
              convert: <Image size={16} className="mb-1" />,
              watermark: <Type size={16} className="mb-1" />
            }[tab]}
            <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
};

export default ImageTransform;