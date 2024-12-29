#!/usr/bin/env python3

from PIL import Image
import requests
from functions.resize import resize
from functions.crop import crop
from functions.rotate import rotate
from functions.converter import converter
from functions.apply_filters import Filters
from functions.watermark import watermark
from functions.compress import compress

# response = requests.get("http://localhost:3000")

imageUrl = "./image_test/image.jpg"
watermarkUrl = "./image_test/icon.jpg"

with (
	Image.open(imageUrl) as img,
	Image.open(watermarkUrl) as watermark_img
):
# image processing here

#	img = crop(img)

#	args={'width':500}
#	img = resize(img, **args)
	
#	size = (500, 500)
#	img = Filters.create_thumbnail(img, size)
#	img = Filters.back_and_white(img)


#	img = rotate(img, 90)

#	img = watermark(img, watermark_img)

#	img = converter(img, "GIF")

	img = compress(img)
	
	img.show() # be aware, this will turn it into a png
	
	# return img
