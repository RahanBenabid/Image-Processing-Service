#!/usr/bin/env python3

from PIL import Image

def converter(img: Image.Image, mode: str) -> Image.Image:
	if mode not in ["JPEG", "PNG", "GIF", "BMP"]:
		raise ValueError("Format not supported")
		
	match mode:
		case "JPEG":
			if not img.mode == 'RGB':
				img = img.convert('RGB')
		case "PNG":
			if not img.mode == "RGB" or "RGBA":
				img = img.convert("RGBA")
		case "GIF":
			if not img.mode == 'P':
				img = img.convert('P')
		case "BMP":
			if not img.mode == "RGB":
				img = img.convert("RGB")
				
	
	return img
