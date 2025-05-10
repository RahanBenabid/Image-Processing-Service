from flask import Flask, request, jsonify
import base64
import io
from PIL import Image
import sys
import json
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from flask_cors import CORS #import cors
from main import process_image

app = Flask(__name__)
# Enable CORS for all routes with proper configuration
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/process_image', methods=['POST'])
def process_image_endpoint():
    try:
        # if 'image' not in request.files:
        #     return jsonify({'error': 'No image file provided'}), 400
        data = request.json
        image_data = data.get('imageData')
        transformations = data.get('transformations')
        


        if not image_data or not transformations:
            return jsonify({'error': 'Missing image data or transformations'}), 400
        try:
            if ',' in image_data:
                binary_data = image_data.split(',')[1]
            else:
                binary_data = image_data
                
            image_bytes = base64.b64decode(binary_data)
            img = Image.open(io.BytesIO(image_bytes))
            
            processed_img = process_image(transformations, img)
            buffered = io.BytesIO()
            processed_img.save(buffered, format=processed_img.format or "PNG")
           
           
           
            img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
            return jsonify({
                'success': True,
                'processedImage': f"data:image/{processed_img.format.lower() if processed_img.format else 'png'};base64,{img_str}"
            })
            
        except Exception as e:
            print(f"Error processing image: {str(e)}")
            return jsonify({'error': f'Error processing image: {str(e)}'}), 500
            
    except Exception as e:
        print(f"Server error: {str(e)}")
        return jsonify({'error': f'Server error: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)