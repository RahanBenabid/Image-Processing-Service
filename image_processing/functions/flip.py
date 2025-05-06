#!/usr/bin/env python3

from PIL import Image

def flip(img: Image.Image, method: str) -> Image.Image:
	method = method.lower()
	if method == "horizontal":
		img = img.transpose(method=Image.Transpose.FLIP_LEFT_RIGHT)
	elif method == "vertical":
		img = img.transpose(method=Image.Transpose.FLIP_TOP_BOTTOM)
	elif method ==  "both":
		img = img.transpose(method=Image.Transpose.FLIP_TOP_BOTTOM)
		img = img.transpose(method=Image.Transpose.FLIP_LEFT_RIGHT)
	else:
		raise ValueError("method must be one of: 'horizontal', 'vertical', 'both'")
	return img