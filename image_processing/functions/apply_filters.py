#!/usr/bin/env python3

from PIL import Image

class Filters:
	def create_thumbnail(img: Image.Image, size: (int, int) = (128, 128)) -> Image.Image:
		img.thumbnail(size)
		return img
	
	