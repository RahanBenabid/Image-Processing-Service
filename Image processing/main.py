#!/usr/bin/env python3

from PIL import Image
import requests
from functions.resize import resize
from functions.crop import crop

# response = requests.get("http://localhost:3000")

imageUrl = "./image-test/image.jpg"

with Image.open(imageUrl) as img:
#	img = crop(img)
	args={'width':0, 'height':40}
	img = resize(img, **args)
	img.show()
	
	
