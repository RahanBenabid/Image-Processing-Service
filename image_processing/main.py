#!/usr/bin/env python3

import sys
import _testbuffer
import json
import io
from PIL import Image

from functions.resize import resize
from functions.crop import crop
from functions.rotate import rotate
from functions.converter import converter
from functions.apply_filters import Filters
from functions.watermark import watermark
from functions.compress import compress
from functions.flip import flip

def process_image(changes: dict, img: Image.Image):
  if 'resize' in changes:
    height = changes["resize"].get('height', 0)
    width = changes["resize"].get('width', 0)
    img = resize(img, height=height, width=width)
    
  if 'crop' in changes:
    width = changes.get('crop', {}).get('width', 0)
    height = changes.get('crop', {}).get('height', 0)
    x = changes.get('crop', {}).get('x', 0)
    y = changes.get('crop', {}).get('y', 0)
    img = crop(img, startX=x, startY=y, endX=width, endY=height)
    
  if 'rotate' in changes:
    degree = changes.get('rotate', 0)
    img = rotate(img, angle=degree)
    
  if 'filters' in changes:
    filters = changes.get('filters', {})
    if filters.get('black_and_white'):
      img = Filters.back_and_white(img)
    if filters.get('thumbnail'):
      img = Filters.create_thumbnail(img)
    if filters.get('sharpen'):
      img = Filters.sharpen_image(img)
      
  if 'format' in changes:
    format_ = changes.get('format', "")
    img = converter(img, mode=format_)
    
  if 'transpose' in changes:
    method = changes.get('transpose', "")
    img = flip(img, method=method)
    
  if 'compress' in changes and changes.get('compress') == True:
    img = compress(img)
    
  img = Filters.back_and_white(img)
    
  print("Image processed")
  return img
  
  
if __name__ == "__main__":
  if len(sys.argv) > 1:
    try:
      # Get changes from first argument
      changes = json.loads(sys.argv[1])
      
      # Read image data from stdin as binary
      image_data = sys.stdin.buffer.read()
      
      # print(f'changes: {changes}, image type: {type(image_data)}')
      
      # Convert bytes to PIL Image
      image = Image.open(io.BytesIO(image_data))
      
      # apply changes
      processed_img = process_image(changes, image)
      
      # Convert back to bytes
      temporaryByte = io.BytesIO()
      processed_img.save(temporaryByte, format="PNG")
      byteArr = temporaryByte.getvalue()
      
      # send back to the Node App
      print("Finished, exiting")
      sys.stdout.buffer.write(byteArr)
      
    except json.JSONDecodeError:
      print("Invalid JSON provided")
      sys.exit(1)
  else:
    print("No changes provided")
    
    
    """
{
  "resize": {
    "width": 100,
    "height": 100
  },
  "crop": {
    "width": 50,
    "height": 50,
    "x": 10,
    "y": 10
  },
  "rotate": 90,
  "format": "png",
  "compress": true,
  "filters": {
    "back_and_white": true,
    "thumbnail": false,
    "sharpen": true
  }
}
"""
    