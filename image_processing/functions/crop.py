#!/usr/bin/env python3

from PIL import Image

def crop(img: Image.Image, startX: int, startY: int, endX: int, endY: int) -> Image.Image:
	width, height = img.size
	img = img.crop((startX, startY, endX, endY))
	return img