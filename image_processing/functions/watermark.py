#!/usr/bin/env python3

from PIL import Image
from .resize import resize

def watermark(img: Image.Image, watermark: Image.Image) -> Image.Image:
	# get height of the image
	size = int(img.size[0]/4)
	watermark = resize(watermark, height=size)
	img.paste(watermark, (0,0), mask=watermark)
	return img