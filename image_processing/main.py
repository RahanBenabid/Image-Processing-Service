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
from functions.applyFilters import Filters
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
    if filters.get('blackAndWhite'):
      img = Filters.black_and_white(img)
    if filters.get('thumbnail'):
      thumb_size = (128, 128)
      if isinstance(filters.get('thumbnail'), dict):
        thumb_data = filters.get('thumbnail')
        width = thumb_data.get('width', 128)
        height = thumb_data.get('height', 128)
        thumb_size = (width, height)
      img = Filters.create_thumbnail(img, size=thumb_size)
    if filters.get('sharpen'):
      factor = 4.0
      if isinstance(filters.get('sharpen'), (int, float)):
        factor = filters.get('sharpen')
      img = Filters.sharpen_image(img, factor=factor)
    if filters.get('blur'):
      radius = 2.0
      if isinstance(filters.get('blur'), (int, float)):
        radius = filters.get('blur')
      img = Filters.blur_image(img, radius=radius)
    if filters.get('brightness'):
      factor = filters.get('brightness')
      if isinstance(factor, (int, float)):
        img = Filters.adjust_brightness(img, factor=factor)
    if filters.get('contrast'):
      factor = filters.get('contrast')
      if isinstance(factor, (int, float)):
        img = Filters.adjust_contrast(img, factor=factor)
    if filters.get('sepia'):
      img = Filters.sepia(img)
    if filters.get('invert'):
      img = Filters.invert(img)
      
  if 'format' in changes:
    format_ = changes.get('format', "").upper()
    img = converter(img, mode=format_)
  
  if 'flip' in changes:
    method = changes.get('flip', "").lower()
    img = converter(img, mode=format_)
    
  if 'transpose' in changes:
    method = changes.get('transpose', "")
    img = flip(img, method=method)
    
  if 'compress' in changes and changes.get('compress') == True:
    img = compress(img)
    
  print("Image processed successfully")
  return img
  
  
if __name__ == "__main__":
  if len(sys.argv) > 1:
    try:
      # Get changes from first argument
      changes = json.loads(sys.argv[1])
      
      # Read image data from stdin as binary
      image_data = sys.stdin.buffer.read()
      
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
    