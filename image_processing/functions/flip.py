#!/usr/bin/env python3

from PIL import Image

def flip(img: Image.Image, method: str) -> Image.Image:
	if method == "Horizontal":
		img = img.transpose(method=Image.Transpose.FLIP_LEFT_RIGHT)
	elif method == "Vertical":
		img = img.transpose(method=Image.Transpose.FLIP_TOP_BOTTOM)
	else:
		raise ValueError("wrong method")
	return img