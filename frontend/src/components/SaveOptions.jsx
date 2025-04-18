import { useState } from 'react';
import { useImage } from '../context/ImageContext';
import { Save, Loader2 } from 'lucide-react';

const SaveOptions = ({ imageId }) => {
  const { saveTransformedImage } = useImage();
  const [fileName, setFileName] = useState('');
  const [format, setFormat] = useState('jpeg');
  const [quality, setQuality] = useState(90);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await saveTransformedImage(imageId, {
        fileName: fileName || `transformed_${Date.now()}`,
        format,
        quality: Number(quality)
      });
      setMessage({ type: 'success', text: 'Image saved successfully!' });
      setFileName(''); 
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to save image' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-n-7 rounded-xl border border-n-6 p-6 shadow-lg">
      <div className="flex items-center mb-6">
        <Save className="w-5 h-5 text-blue-400 mr-2" />
        <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-purple-300">
          Save Options
        </h3>
      </div>
      
      {message && (
        <div className={`mb-6 p-4 rounded-lg border-l-4 ${
          message.type === 'success' 
            ? 'bg-green-900/30 border-green-500 text-green-300'
            : 'bg-red-900/30 border-red-500 text-red-300'
        } flex items-center`}>
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            {message.type === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSave} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-n-3">
            File Name
          </label>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="transformed_image"
            className="w-full bg-n-6 border border-n-5 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-300 placeholder:text-n-4"
          />
          <p className="text-xs text-n-4">Leave blank for auto-generated name</p>
        </div>
        
        <div className="space-y-2">
          <label className="block text-sm font-medium text-n-3">
            Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {['jpeg', 'png', 'webp'].map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`py-2 px-3 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                  format === fmt
                    ? 'bg-gradient-to-br from-blue-500/20 to-purple-600/20 border-blue-500/50 text-blue-400'
                    : 'bg-n-6 border-n-5 hover:bg-n-5 text-n-2'
                }`}
              >
                {fmt.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className="block text-sm font-medium text-n-3">
              Quality
            </label>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              {quality}%
            </span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            value={quality}
            onChange={(e) => setQuality(e.target.value)}
            className="w-full h-2 bg-n-6 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-gradient-to-r [&::-webkit-slider-thumb]:from-blue-500 [&::-webkit-slider-thumb]:to-purple-600"
          />
          <div className="flex justify-between text-xs text-n-4">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-300 flex items-center justify-center ${
            loading
              ? 'bg-n-6 text-n-3 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-purple-500/20'
          }`}
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2 h-4 w-4" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Image
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SaveOptions;