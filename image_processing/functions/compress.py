#!/usr/bin/env python3

from PIL import Image

def compress(img: Image.Image, percentage: float=1.0) -> Image.Image:
	"""
	This one is tricky, to be able to compress the image using the `.save()` method
	without saving the image in the disk, we save the image to an in-memory buffer
	and reload to simulate the compression without saving it to the disk.
	"""
	
	img = img.convert('RGB')
	
	if percentage != 1.0:
		new_size = tuple(int(ti*percentage) for ti in img.size)
		(width, height) = new_size
		img = resize(img, width=width, height=height)
	
	
	from io import BytesIO
	buffer = BytesIO()
	img.save(buffer, format="JPEG", quality=90, optimize=True)
	buffer.seek(0)
	
	compressed_img = Image.open(buffer)
		
	return compressed_img