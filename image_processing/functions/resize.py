#!/usr/bin/env python3

from PIL import Image

def resize(img: Image.Image, width: int=0, height: int=0) -> Image.Image:
	if width < 0 and height < 0:
		raise ValueError("width and height must be positive values")
	if width == 0 and height == 0:
		raise ValueError("please provide a non negative value for both")
	
	if width != 0 and height != 0:
		img = img.resize((width, height))
	else:
		if height == 0:
			wpercent = (width / float(img.size[0]))
			height = int((float(img.size[1]) * float(wpercent)))
			img = img.resize((width, height))
		else:
			hpercent = (height / float(img.size[1]))
			width = int((float(img.size[0]) * float(hpercent)))
			img = img.resize((width, height))
	
	return img