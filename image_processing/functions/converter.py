#!/usr/bin/env python3

from PIL import Image
import sys, io

def converter(img: Image.Image, mode: str) -> Image.Image:
  """
  Convert an image to the specified format and appropriate color mode.
  
  Args:
    img: The PIL Image object to convert
    mode: Target format ("JPEG", "PNG", "GIF", "BMP", "WEBP")
    
  Returns:
    The converted PIL Image object
  """
  if mode not in ["JPEG", "PNG", "GIF", "BMP", "WEBP"]:
    raise ValueError(f"Format not supported: {mode}")
    
    # Convert to appropriate color mode based on the target format
  match mode:
    case "JPEG":
      if img.mode != 'RGB':
        img = img.convert('RGB')
    case "PNG":
      if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGBA')
    case "GIF":
      if img.mode != 'P':
        img = img.convert('P')
    case "BMP":
      if img.mode != 'RGB':
        img = img.convert('RGB')
    case "WEBP":
      if img.mode not in ('RGB', 'RGBA'):
        img = img.convert('RGBA')
        
        # Actually change the format by doing a temporary save and reload
        # This ensures img.format will be updated
  temp_buffer = io.BytesIO()
  img.save(temp_buffer, format=mode)
  temp_buffer.seek(0)
  img = Image.open(temp_buffer)
  
  # Keep the image loaded in memory
  img.load()
  
  sys.stderr.write(f"\nConverted to {mode}, color mode now: {img.mode}, format now: {img.format}\n")
  
  return img