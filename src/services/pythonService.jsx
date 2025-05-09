const pythonService = {
   
    processImage: async (imageData, transformations) => {
      try {
        const pythonApiUrl = import.meta.env.VITE_PYTHON_API_URL || 'http://localhost:5000';
        
        const response = await fetch(`${pythonApiUrl}/process_image`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            imageData,
            transformations,
          }),
        });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
         const data = await response.json();
        // console.log('heeeey',data);

        if (data.error) {
          throw new Error(data.error);
        }
        
        return data.processedImage;
      } catch (error) {
        console.error('Error processing image with Python:', error);
        throw error;
      }
    },
  };
  
  export default pythonService;