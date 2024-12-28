#!/usr/bin/env python3

from PIL import Image

def rotate(img: Image.Image, angle: int=0) -> Image.Image:
	img = img.rotate(angle)
	return img