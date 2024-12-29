#!/usr/bin/env python3

from PIL import Image, ImageFilter

class Filters:
	def create_thumbnail(img: Image.Image, size: (int, int) = (128, 128)) -> Image.Image:
		img.thumbnail(size)
		return img
	
	def back_and_white(img: Image.Image) -> Image.Image:
		img = img.convert("L")
		return img
	
	def sharpen_image(img: Image.Image) -> Image.Image:
		img.filte
		return img
	