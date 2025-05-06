#!/usr/bin/env python3

from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import math

class Filters:
	def create_thumbnail(img: Image.Image, size: (int, int) = (128, 128)) -> Image.Image:
		img_copy = img.copy()
		
		width, height = img.size
		target_width, target_height = size
		
		width_ratio = target_width / width
		height_ratio = target_height / height
		ratio = min(width_ratio, height_ratio)
		
		new_width = int(width * ratio)
		new_height = int(height * ratio)
		
		resized_img = img_copy.resize((new_width, new_height), Image.LANCZOS)
		return resized_img
	
	def black_and_white(img: Image.Image, factor: float= 4.0) -> Image.Image:
		return img.convert("L")
	
	def sharpen_image(img: Image.Image, factor: float = 4.0) -> Image.Image:
		enhancer = ImageEnhance.Sharpness(img)
		return enhancer.enhance(factor)
	
	def blur_image(img: Image.Image, radius: float = 2.0) -> Image.Image:
		return img.filter(ImageFilter.GaussianBlur(radius=radius))
	
	def adjust_brightness(img: Image.Image, factor: float = 1.5) -> Image.Image:
		enhancer = ImageEnhance.Brightness(img)
		return enhancer.enhance(factor)
	
	def adjust_contrast(img: Image.Image, factor: float = 1.5) -> Image.Image:
		enhancer = ImageEnhance.Contrast(img)
		return enhancer.enhance(factor)
	
	def sepia(img: Image.Image) -> Image.Image:
		if img.mode != "RGB":
			img = img.convert("RGB")
		
		width, height = img.size
		new_img = Image.new("RGB", (width, height))
		pixels = img.load()
		new_pixels = new_img.load()
		
		for i in range(width):
			for j in range(height):
				r, g, b = pixels[i, j]
				
				tr = int(1.393 * r + 0.769 * g + 0.189 * b)
				tg = int(0.349 * r + 0.686 * g + 0.168 * b)
				tb = int(0.272 * r + 0.534 * g + 0.131 * b)
				
				tr = min(255, tr)
				tg = min(255, tg)
				tb = min(255, tb)
				
				new_pixels[i, j] = (tr, tg, tb)
				
		return new_img
	
	def invert(img: Image.Image) -> Image.Image:
		return ImageOps.invert(img) if img.mode == "RGB" else img.point(lambda x: 255 - x)
	
	
	