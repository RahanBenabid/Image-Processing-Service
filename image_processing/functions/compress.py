#!/usr/bin/env python3

from PIL import Image
from io import BytesIO

def compress(img: Image.Image, percentage: float=1.0) -> Image.Image:
	"""
	This one is tricky, to be able to compress the image using the `.save()` method
	without saving the image in the disk, we save the image to an in-memory buffer
	and reload to simulate the compression without saving it to the disk.
	"""
	
	goalpercentage = 100 - percentage
	
	buffer = BytesIO()
	img.save(buffer, format="JPEG", quality=goalpercentage, optimize=True)
	buffer.seek(0)
	
	print("kys")
	
	compressed_img = Image.open(buffer)
		
	return compressed_img