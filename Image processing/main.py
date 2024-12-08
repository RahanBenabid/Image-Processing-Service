#!/usr/bin/env python3

from PIL import Image
import requests
from image_transformation.resize import resize
from image_transformation.crop import crop

# response = requests.get("http://localhost:3000")

imageUrl = "./image-test/image.jpg"

with Image.open(imageUrl) as img:
#	img = crop(img)
	args={'width':0.4, 'height':0.5}
	img = resize(img, **args)
	img.show()
	
	
