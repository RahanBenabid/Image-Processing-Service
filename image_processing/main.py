#!/usr/bin/env python3

from PIL import Image
import requests
from functions.resize import resize
from functions.crop import crop
from functions.rotate import rotate
from functions.convert import convert
from functions.apply_filters import Filters
from functions.watermark import watermark

# response = requests.get("http://localhost:3000")

imageUrl = "./image_test/icon.jpg"
watermarkUrl = "./image_test/icon.jpg"

with Image.open(imageUrl) as img:
#	img = crop(img)
	
	args={'width':500, 'height':500}
	img = resize(img, **args)

#	size = (500, 500)
#	img = Filters.create_thumbnail(img, size)
#	
#	img = rotate(img, 45)
	
	img = watermark(img, watermarkUrl)
	
	img.show()
