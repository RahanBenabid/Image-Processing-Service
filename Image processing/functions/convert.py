#!/usr/bin/env python3

from PIL import Image

def convert(img: Image.Image, mode: str) -> Image.Image:
	if mode not in ["JPEG", "PNG", "GIF", "BMP"]:
		raise ValueError("Format not supported")
		
	
	return img
