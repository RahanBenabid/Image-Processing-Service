	#!/usr/bin/env python3

import sys
import json
from PIL import Image
import requests

from functions.resize import resize
from functions.crop import crop
from functions.rotate import rotate
from functions.converter import converter
from functions.apply_filters import Filters
from functions.watermark import watermark
from functions.compress import compress
from functions.flip import flip

# response = requests.get("http://localhost:3000")

def process_image(changes):
	print(f'got the request successfully: {changes}')
	print(f'extracting from the json: {changes['resize']['height']}')
	
	# call the functions depending on what the JSON contrains
	if 'resize' in changes:
		print(f"i got it! {changes['resize']}")
	if 'to' not in changes:
		print("didn't get this one")
				
	
	return

if __name__ == "__main__":
	if len(sys.argv) > 1:
		changes = json.loads(sys.argv[1])
		print(changes)
		process_image(changes[0])
	else:
		print("No changes provided")
	
"""
{
		"transformations": {
			"resize": {
				"width": "number",
				"height": "number"
			},
			"crop": {
				"width": "number",
				"height": "number",
				"x": "number",
				"y": "number"
			},
			"rotate": "number",
			"format": "string",
			"filters": {
				"grayscale": "boolean",
				"sepia": "boolean"
		}
	}
}
"""